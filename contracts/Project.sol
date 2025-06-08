// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
}

contract Project {
    // Configuration (set at deployment)
    address public immutable projectOwner; // Farmer's address
    address public immutable adminAddress; // Platform admin address
    IERC20 public immutable rlusdToken; // Address of the RLUSD ERC20 token
    address public immutable platformSettingsAddress; // Address of the PlatformSettings contract
    uint256 public fundingGoalUnits; // Total RLUSD units to be raised
    uint256 public minInvestmentUnits; // Minimum RLUSD units per investment
    uint256 public projectDurationSeconds; // Expected duration in seconds
    string public projectDetailsURI; // Link to off-chain project metadata (e.g., IPFS)

    // Dynamic State
    enum ProjectStage {
        Funding,        // Project is open for investment
        Active,         // Funding goal met, project underway
        SettlementPending, // Awaiting admin verification of revenue (farmer has submitted proof)
        RevenueVerified, // Admin has verified revenue, ready for internal distribution
        InvestorClaimsActive, // Platform & Farmer paid, investors can claim their share
        Completed,      // All investor claims processed or claim period ended, project finished
        Cancelled       // Project cancelled
    }
    ProjectStage public currentStage;

    uint256 public currentFundingUnits; // Total RLUSD units raised so far
    mapping(address => uint256) public investments; // Investor address to amount invested

    // State variables for new distribution logic
    uint256 public verifiedRevenueUnits;
    uint256 public platformFeePaid;
    uint256 public farmerSharePaid;
    uint256 public investorPoolShareTotal; // Total amount allocated to the investor pool
    uint256 public investorPoolClaimedAmount; // Total amount claimed by investors from the pool
    mapping(address => uint256) public investorClaimedShares; // Tracks how much each investor has claimed

    // Timestamps
    uint256 public fundingDeadlineTimestamp;
    uint256 public projectStartDateTimestamp;
    uint256 public projectEndDateTimestamp;

    // Events
    event ProjectCreated(address indexed projectOwner, address platformSettings, uint256 fundingGoal, uint256 minInvestment, uint256 fundingDeadline);
    event InvestmentMade(address indexed investor, uint256 amount);
    event FundingGoalReached(uint256 totalFunded);
    event StageChanged(ProjectStage oldStage, ProjectStage newStage);
    event RevenueVerifiedAndSharesAllocated(uint256 totalRevenue, uint256 platformCut, uint256 farmerCut, uint256 investorPool);
    event InvestorShareClaimed(address indexed investor, uint256 amountClaimed);
    event ProjectCompleted();
    event ProjectCancelled();
    event FundsRefunded(address indexed investor, uint256 amount);


    modifier onlyAdmin() {
        require(msg.sender == adminAddress, "Project: Caller is not the admin");
        _;
    }

    modifier onlyProjectOwner() {
        require(msg.sender == projectOwner, "Project: Caller is not the project owner");
        _;
    }

    modifier atStage(ProjectStage _stage) {
        require(currentStage == _stage, "Project: Not in required stage");
        _;
    }

    constructor(
        address _projectOwner,
        address _adminAddress,
        address _rlusdTokenAddress,
        address _platformSettingsAddress, // New parameter
        uint256 _fundingGoal,
        uint256 _minInvestment,
        uint256 _durationDays,
        string memory _detailsURI,
        uint256 _fundingPeriodDays
    ) {
        require(_platformSettingsAddress != address(0), "Project: PlatformSettings address cannot be zero");
        projectOwner = _projectOwner;
        adminAddress = _adminAddress;
        rlusdToken = IERC20(_rlusdTokenAddress);
        platformSettingsAddress = _platformSettingsAddress; // Initialize the stored address
        fundingGoalUnits = _fundingGoal;
        minInvestmentUnits = _minInvestment;
        projectDurationSeconds = _durationDays * 1 days;
        projectDetailsURI = _detailsURI;

        currentStage = ProjectStage.Funding;
        fundingDeadlineTimestamp = block.timestamp + (_fundingPeriodDays * 1 days);

        emit ProjectCreated(_projectOwner, _platformSettingsAddress, _fundingGoal, _minInvestment, fundingDeadlineTimestamp);
    }

    function invest(uint256 _amount) external atStage(ProjectStage.Funding) {
        require(block.timestamp <= fundingDeadlineTimestamp, "Project: Funding deadline has passed");
        require(_amount >= minInvestmentUnits, "Project: Amount less than minimum investment");
        require(currentFundingUnits + _amount <= fundingGoalUnits, "Project: Investment exceeds funding goal");

        currentFundingUnits += _amount;
        investments[msg.sender] += _amount;
        
        require(rlusdToken.transferFrom(msg.sender, address(this), _amount), "Project: RLUSD transfer failed");

        emit InvestmentMade(msg.sender, _amount);

        if (currentFundingUnits == fundingGoalUnits) {
            ProjectStage oldStage = currentStage;
            currentStage = ProjectStage.Active;
            projectStartDateTimestamp = block.timestamp;
            projectEndDateTimestamp = block.timestamp + projectDurationSeconds;
            emit FundingGoalReached(currentFundingUnits);
            emit StageChanged(oldStage, currentStage);
        }
    }

    function updateStageByAdmin(ProjectStage _newStage) external onlyAdmin {
        require(_newStage != currentStage, "Project: New stage is same as current");
        // Add more specific validation for stage transitions if needed, e.g., cannot go backwards
        ProjectStage oldStage = currentStage;
        currentStage = _newStage;
        emit StageChanged(oldStage, currentStage);
    }

    function checkFundingDeadline() external atStage(ProjectStage.Funding) {
        require(block.timestamp > fundingDeadlineTimestamp, "Project: Funding deadline not yet passed");
        
        if (currentFundingUnits < fundingGoalUnits) {
            ProjectStage oldStage = currentStage;
            currentStage = ProjectStage.Cancelled;
            emit StageChanged(oldStage, ProjectStage.Cancelled);
            emit ProjectCancelled();
        }
    }
    
    function refundInvestment() external {
        require(currentStage == ProjectStage.Cancelled, "Project: Not in Cancelled stage");
        uint256 investmentAmount = investments[msg.sender];
        require(investmentAmount > 0, "Project: No investment found for this address");
        
        investments[msg.sender] = 0; 
        currentFundingUnits -= investmentAmount; 
        
        require(rlusdToken.transfer(msg.sender, investmentAmount), "Project: RLUSD refund transfer failed");
        emit FundsRefunded(msg.sender, investmentAmount);
    }

    function authorizeRevenueAndAllocateShares(uint256 _verifiedRevenue) external onlyAdmin {
        require(currentStage == ProjectStage.Active || currentStage == ProjectStage.SettlementPending, "Project: Not in Active or SettlementPending stage");
        require(_verifiedRevenue > 0, "Project: Verified revenue must be greater than zero");

        verifiedRevenueUnits = _verifiedRevenue;
        ProjectStage oldStage = currentStage;
        currentStage = ProjectStage.RevenueVerified; 

        PlatformSettings settings = PlatformSettings(platformSettingsAddress);
        uint16 platformFeePermille = settings.platformFeePermille();
        uint16 farmerRevenueSharePermille = settings.farmerRevenueSharePermille();
        address platformTreasury = settings.platformTreasuryAddress();

        uint256 platformCut = (_verifiedRevenue * platformFeePermille) / 1000;
        uint256 farmerCut = (_verifiedRevenue * farmerRevenueSharePermille) / 1000;
        uint256 investorPoolCut = _verifiedRevenue - platformCut - farmerCut;
        
        require(platformCut + farmerCut + investorPoolCut == _verifiedRevenue, "Project: Share calculation mismatch");

        if (platformCut > 0) {
            require(rlusdToken.transfer(platformTreasury, platformCut), "Project: Platform fee transfer failed");
            platformFeePaid = platformCut;
        }
        if (farmerCut > 0) {
            require(rlusdToken.transfer(projectOwner, farmerCut), "Project: Farmer share transfer failed");
            farmerSharePaid = farmerCut;
        }
        
        investorPoolShareTotal = investorPoolCut;

        currentStage = ProjectStage.InvestorClaimsActive; 
        emit RevenueVerifiedAndSharesAllocated(_verifiedRevenue, platformCut, farmerCut, investorPoolCut);
        emit StageChanged(oldStage, currentStage); 
    }

    function claimInvestorShare() external atStage(ProjectStage.InvestorClaimsActive) {
        require(investorPoolShareTotal > 0, "Project: No investor pool available");
        uint256 userInvestment = investments[msg.sender];
        require(userInvestment > 0, "Project: No investment from this address");
        require(investorClaimedShares[msg.sender] == 0, "Project: Share already claimed");

        uint256 userProportionalShare = (userInvestment * investorPoolShareTotal) / currentFundingUnits;
        require(userProportionalShare > 0, "Project: Calculated share is zero");
        require(investorPoolClaimedAmount + userProportionalShare <= investorPoolShareTotal, "Project: Claim exceeds available pool");

        investorClaimedShares[msg.sender] = userProportionalShare;
        investorPoolClaimedAmount += userProportionalShare;

        require(rlusdToken.transfer(msg.sender, userProportionalShare), "Project: Investor share transfer failed");
        emit InvestorShareClaimed(msg.sender, userProportionalShare);

        if (investorPoolClaimedAmount == investorPoolShareTotal) {
            ProjectStage oldStage = currentStage;
            currentStage = ProjectStage.Completed;
            emit StageChanged(oldStage, currentStage);
            emit ProjectCompleted();
        }
    }
    
    function getProjectSummary() external view returns (
        address owner,
        ProjectStage stage,
        uint256 goal,
        uint256 currentFunding,
        uint256 deadline,
        uint256 investorsCount // This remains a placeholder
    ) {
        return (
            projectOwner,
            currentStage,
            fundingGoalUnits,
            currentFundingUnits,
            fundingDeadlineTimestamp,
            0 // Placeholder for actual investor count logic
        );
    }

    function getInvestorShareInfo(address _investor) external view returns (uint256 investment, uint256 potentialShare, uint256 claimedShare) {
        uint256 userInvestment = investments[_investor];
        uint256 userProportionalShare = 0;
        if (currentFundingUnits > 0 && investorPoolShareTotal > 0 && (currentStage == ProjectStage.InvestorClaimsActive || currentStage == ProjectStage.Completed) ) {
             userProportionalShare = (userInvestment * investorPoolShareTotal) / currentFundingUnits;
        }
        return (userInvestment, userProportionalShare, investorClaimedShares[_investor]);
    }
}

interface PlatformSettings {
    function rlusdTokenAddress() external view returns (address);
    function platformTreasuryAddress() external view returns (address);
    function platformFeePermille() external view returns (uint16);
    function farmerRevenueSharePermille() external view returns (uint16);
    function investorPoolSharePermille() external view returns (uint16);
}