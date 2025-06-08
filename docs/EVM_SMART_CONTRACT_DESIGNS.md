# EVM Smart Contract Designs for AgriVest

This document outlines the design of Solidity smart contracts intended to replace the existing XRPL Hooks functionality for the AgriVest platform, as per the migration plan to utilize the XRP EVM Sidechain.

## 1. Core Concepts and Architecture

The smart contract system will manage the lifecycle of agricultural projects, including creation, funding, stage progression, and settlement. Key functionalities previously handled by XRPL Hooks will be implemented within these EVM contracts.

- **Project Registry:** A central contract or a factory pattern to manage and deploy individual project contracts.
- **Project Contract:** Each agricultural project will have its own smart contract instance holding its specific data, state, and logic.
- **RLUSD Token:** Assumes an ERC20-compliant RLUSD token exists on the XRP EVM Sidechain. The address of this token will be a key configuration parameter.
- **Access Control:** Roles (e.g., platform admin, project owner/farmer) will be managed, likely using OpenZeppelin's AccessControl or Ownable patterns.

## 2. Project Contract (`Project.sol`)

This contract will manage the state and lifecycle of an individual agricultural project.

### State Variables:

```solidity
// Configuration (set at deployment)
address public immutable projectOwner; // Farmer's address
address public immutable adminAddress; // Platform admin address
address public immutable rlusdTokenAddress; // Address of the RLUSD ERC20 token
uint256 public fundingGoalUnits; // Total RLUSD units to be raised
uint256 public minInvestmentUnits; // Minimum RLUSD units per investment
uint256 public projectDuration; // Expected duration in days/seconds
string public projectDetailsURI; // Link to off-chain project metadata (e.g., IPFS)

// Dynamic State
enum ProjectStage {
    Funding,        // Project is open for investment
    Active,         // Funding goal met, project underway
    SettlementPending, // Awaiting admin verification of revenue
    DistributionActive, // Revenue verified, payouts authorized
    Completed,      // Payouts done, project finished
    Cancelled       // Project cancelled
}
ProjectStage public currentStage;

uint256 public currentFundingUnits; // Total RLUSD units raised so far
mapping(address => uint256) public investments; // Investor address to amount invested

bool public isDistributionAuthorized;
uint256 public verifiedRevenueUnits;
uint256 public totalPaidOutUnits;

// Timestamps
uint256 public fundingDeadline;
uint256 public projectStartDate;
uint256 public projectEndDate;
```

### Events:

```solidity
event ProjectCreated(address indexed projectOwner, uint256 fundingGoal, uint256 minInvestment, uint256 fundingDeadline);
event InvestmentMade(address indexed investor, uint256 amount);
event FundingGoalReached(uint256 totalFunded);
event StageChanged(ProjectStage oldStage, ProjectStage newStage);
event DistributionAuthorized(uint256 revenueAmount);
event PayoutMade(address indexed recipient, uint256 amount);
event ProjectCompleted();
event ProjectCancelled();
```

### Functions:

#### 2.1. Initialization & Configuration

-   `constructor(address _projectOwner, address _adminAddress, address _rlusdToken, uint256 _fundingGoal, uint256 _minInvestment, uint256 _durationDays, string memory _detailsURI)`
    *   Sets immutable parameters.
    *   Initializes `currentStage` to `Funding`.
    *   Sets `fundingDeadline`.
    *   Emits `ProjectCreated`.

#### 2.2. Investment Logic (Replaces `investment_validation_hook.c`)

-   `invest(uint256 _amount)`: `external payable` (if native EVM currency is used for gas, or non-payable if only ERC20 transfers)
    *   Requires `currentStage == ProjectStage.Funding`.
    *   Requires `block.timestamp <= fundingDeadline`.
    *   Requires `_amount >= minInvestmentUnits`.
    *   Requires `currentFundingUnits + _amount <= fundingGoalUnits`.
    *   Transfers `_amount` of RLUSD tokens from `msg.sender` to this contract. (Requires `approve` from investor to this contract beforehand).
    *   Updates `currentFundingUnits += _amount`.
    *   Updates `investments[msg.sender] += _amount`.
    *   Emits `InvestmentMade`.
    *   If `currentFundingUnits == fundingGoalUnits`:
        *   Sets `currentStage = ProjectStage.Active`.
        *   Sets `projectStartDate = block.timestamp`.
        *   Sets `projectEndDate = block.timestamp + projectDuration`.
        *   Emits `FundingGoalReached` and `StageChanged`.

#### 2.3. Stage Management (Replaces `project_stage_update_hook.c`)

-   `updateStageByAdmin(ProjectStage _newStage)`: `external`
    *   Requires `msg.sender == adminAddress`.
    *   Allows admin to manually transition stages if necessary (e.g., to `Cancelled` or other specific admin-controlled transitions).
    *   Validates permissible stage transitions.
    *   Updates `currentStage = _newStage`.
    *   Emits `StageChanged`.

-   `checkFundingDeadline()`: `external` (can be called by anyone, or automated by a keeper)
    *   Requires `currentStage == ProjectStage.Funding` and `block.timestamp > fundingDeadline`.
    *   If `currentFundingUnits < fundingGoalUnits`, sets `currentStage = ProjectStage.Cancelled`.
        *   (Logic for refunding investors would be needed here or in a separate function).
    *   Emits `StageChanged` (if changed to Cancelled).

#### 2.4. Settlement Logic (Replaces `settlement_hook.c`)

-   `authorizeDistributionByAdmin(uint256 _verifiedRevenue)`: `external`
    *   Requires `msg.sender == adminAddress`.
    *   Requires `currentStage == ProjectStage.Active` or `ProjectStage.SettlementPending` (or a specific stage indicating harvest/sale completion).
    *   Sets `verifiedRevenueUnits = _verifiedRevenue`.
    *   Sets `isDistributionAuthorized = true`.
    *   Sets `currentStage = ProjectStage.DistributionActive`.
    *   Emits `DistributionAuthorized` and `StageChanged`.

-   `distributePayout(address _recipient, uint256 _payoutAmount)`: `external`
    *   Requires `msg.sender == projectOwner` (or `adminAddress`, depending on who manages payouts).
    *   Requires `currentStage == ProjectStage.DistributionActive`.
    *   Requires `isDistributionAuthorized == true`.
    *   Requires `totalPaidOutUnits + _payoutAmount <= verifiedRevenueUnits`.
    *   Transfers `_payoutAmount` of RLUSD from this contract to `_recipient`.
    *   Updates `totalPaidOutUnits += _payoutAmount`.
    *   Emits `PayoutMade`.
    *   If `totalPaidOutUnits == verifiedRevenueUnits`, sets `currentStage = ProjectStage.Completed`. Emits `StageChanged` and `ProjectCompleted`.

-   `claimInvestorShare()`: `external` (Alternative to `distributePayout` for investors to pull their share)
    *   Requires `currentStage == ProjectStage.DistributionActive`.
    *   Requires `isDistributionAuthorized == true`.
    *   Calculates `msg.sender`'s share based on `investments[msg.sender]`, `currentFundingUnits`, and `verifiedRevenueUnits` (minus farmer/platform share).
    *   Ensures share hasn't been paid out already.
    *   Transfers share. Updates `totalPaidOutUnits`. Emits `PayoutMade`.

## 3. Project Factory Contract (`ProjectFactory.sol`) (Optional but Recommended)

This contract would be responsible for deploying new `Project.sol` instances.

### State Variables:

```solidity
address public adminAddress; // Platform admin
address public rlusdTokenAddress;
Project[] public deployedProjects;
```

### Events:

```solidity
event NewProjectDeployed(address indexed projectContractAddress, address indexed projectOwner);
```

### Functions:

-   `constructor(address _admin, address _rlusd)`
    *   Sets `adminAddress` and `rlusdTokenAddress`.

-   `createProject(address _projectOwner, uint256 _fundingGoal, uint256 _minInvestment, uint256 _durationDays, string memory _detailsURI)`: `external`
    *   Requires `msg.sender == adminAddress` (or other authorized role).
    *   Deploys a new `Project` contract instance, passing necessary parameters including `adminAddress` and `rlusdTokenAddress` from factory's state.
    *   Stores the new project address in `deployedProjects`.
    *   Emits `NewProjectDeployed`.

-   `getDeployedProjects()`: `external view returns (Project[] memory)`

## 4. Considerations for RLUSD and EVM Interaction

-   **RLUSD on EVM:** The plan mentions "RLUSD (Ripple USD stablecoin on XRPL and potentially wrapped on EVM)" (line 25). These contracts assume an ERC20-compliant RLUSD token is available on the EVM sidechain.
-   **Bridging/Oracles:** If RLUSD payments happen on XRPL mainnet, a secure bridge and oracle system would be needed to:
    *   Notify the EVM smart contract of mainnet investments.
    *   Trigger RLUSD transfers on the EVM sidechain or credit users within the EVM contract system.
    *   This adds complexity compared to RLUSD being directly usable on the EVM sidechain. The current design assumes RLUSD is an ERC20 on the EVM.
-   **Transaction Fees:** Users will pay gas fees in the native currency of the EVM sidechain for interacting with these smart contracts.

## 5. Next Steps

-   Refine access control mechanisms (e.g., using OpenZeppelin's `AccessControl.sol`).
-   Detail the profit distribution logic (e.g., percentages for farmer, investors, platform).
-   Develop test cases for all contract functions.
-   Set up a development environment (Hardhat/Truffle) for implementation and testing.