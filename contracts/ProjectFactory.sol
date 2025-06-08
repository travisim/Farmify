// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Project.sol";
import "./PlatformSettings.sol";

contract ProjectFactory {
    address public adminAddress; // Platform admin
    address public rlusdTokenAddress; // RLUSD Token address on EVM (can be fetched from PlatformSettings)
    address public platformSettingsAddress; // Address of the PlatformSettings contract
    Project[] public deployedProjects;

    event NewProjectDeployed(address indexed projectContractAddress, address indexed projectOwner, uint256 fundingGoal, string detailsURI);

    modifier onlyAdmin() {
        require(msg.sender == adminAddress, "ProjectFactory: Caller is not the admin");
        _;
    }

    constructor(address _admin, address _platformSettings) {
        require(_admin != address(0), "ProjectFactory: Admin address cannot be zero");
        require(_platformSettings != address(0), "ProjectFactory: PlatformSettings address cannot be zero");
        adminAddress = _admin;
        platformSettingsAddress = _platformSettings;
        // rlusdTokenAddress can be fetched from PlatformSettings if needed, or set independently
        // For now, Project.sol will get it from PlatformSettings
    }

    function createProject(
        address _projectOwner,
        uint256 _fundingGoal,
        uint256 _minInvestment,
        uint256 _durationDays,
        string memory _detailsURI,
        uint256 _fundingPeriodDays
    ) external onlyAdmin {
        // Fetch RLUSD token address from PlatformSettings to ensure consistency
        address currentRlusdTokenAddress = PlatformSettings(platformSettingsAddress).rlusdTokenAddress();
        require(currentRlusdTokenAddress != address(0), "ProjectFactory: RLUSD token not set in PlatformSettings");

        Project newProject = new Project(
            _projectOwner,
            adminAddress,
            currentRlusdTokenAddress,
            platformSettingsAddress, // Pass the PlatformSettings address
            _fundingGoal,
            _minInvestment,
            _durationDays,
            _detailsURI,
            _fundingPeriodDays
        );
        deployedProjects.push(newProject);
        emit NewProjectDeployed(address(newProject), _projectOwner, _fundingGoal, _detailsURI);
    }

    function getDeployedProjects() external view returns (address[] memory) {
        address[] memory projects = new address[](deployedProjects.length);
        for (uint i = 0; i < deployedProjects.length; i++) {
            projects[i] = address(deployedProjects[i]);
        }
        return projects;
    }

    function getDeployedProjectsCount() external view returns (uint256) {
        return deployedProjects.length;
    }
}