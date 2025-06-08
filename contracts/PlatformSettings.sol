// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract PlatformSettings is Ownable {
    address public rlusdTokenAddress;
    address public platformTreasuryAddress;
    
    uint16 public platformFeePermille; // e.g., 200 for 20% (200 / 1000)
    uint16 public farmerRevenueSharePermille; // e.g., 400 for 40%
    uint16 public investorPoolSharePermille; // e.g., 400 for 40%

    event SettingsUpdated(
        address indexed rlusdToken, 
        address indexed platformTreasury, 
        uint16 platformFee, 
        uint16 farmerShare, 
        uint16 investorShare
    );

    constructor(
        address initialOwner,
        address _rlusdTokenAddress,
        address _platformTreasuryAddress,
        uint16 _platformFeePermille,
        uint16 _farmerRevenueSharePermille,
        uint16 _investorPoolSharePermille
    ) Ownable(initialOwner) {
        require(_platformFeePermille + _farmerRevenueSharePermille + _investorPoolSharePermille == 1000, "PlatformSettings: Shares must sum to 1000 (100%)");
        require(_platformTreasuryAddress != address(0), "PlatformSettings: Treasury address cannot be zero");
        require(_rlusdTokenAddress != address(0), "PlatformSettings: RLUSD token address cannot be zero");

        rlusdTokenAddress = _rlusdTokenAddress;
        platformTreasuryAddress = _platformTreasuryAddress;
        platformFeePermille = _platformFeePermille;
        farmerRevenueSharePermille = _farmerRevenueSharePermille;
        investorPoolSharePermille = _investorPoolSharePermille;

        emit SettingsUpdated(
            _rlusdTokenAddress, 
            _platformTreasuryAddress, 
            _platformFeePermille, 
            _farmerRevenueSharePermille, 
            _investorPoolSharePermille
        );
    }

    function setRlusdTokenAddress(address _newAddress) external onlyOwner {
        require(_newAddress != address(0), "PlatformSettings: RLUSD token address cannot be zero");
        rlusdTokenAddress = _newAddress;
        emit SettingsUpdated(rlusdTokenAddress, platformTreasuryAddress, platformFeePermille, farmerRevenueSharePermille, investorPoolSharePermille);
    }

    function setPlatformTreasuryAddress(address _newAddress) external onlyOwner {
        require(_newAddress != address(0), "PlatformSettings: Treasury address cannot be zero");
        platformTreasuryAddress = _newAddress;
        emit SettingsUpdated(rlusdTokenAddress, platformTreasuryAddress, platformFeePermille, farmerRevenueSharePermille, investorPoolSharePermille);
    }

    function setShares(
        uint16 _newPlatformFeePermille,
        uint16 _newFarmerRevenueSharePermille,
        uint16 _newInvestorPoolSharePermille
    ) external onlyOwner {
        require(_newPlatformFeePermille + _newFarmerRevenueSharePermille + _newInvestorPoolSharePermille == 1000, "PlatformSettings: Shares must sum to 1000 (100%)");
        platformFeePermille = _newPlatformFeePermille;
        farmerRevenueSharePermille = _newFarmerRevenueSharePermille;
        investorPoolSharePermille = _newInvestorPoolSharePermille;
        emit SettingsUpdated(rlusdTokenAddress, platformTreasuryAddress, platformFeePermille, farmerRevenueSharePermille, investorPoolSharePermille);
    }
}