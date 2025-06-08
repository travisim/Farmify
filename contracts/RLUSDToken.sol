// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RLUSDToken is ERC20, Ownable {
    constructor(address initialOwner) ERC20("Ripple USD EVM", "RLUSD") Ownable(initialOwner) {
        // Decimals are set to 6, as commonly used for USD-pegged stablecoins
        // and implied by some database schemas in the plan.
        // ERC20 constructor handles _decimals internally if not overridden.
        // OpenZeppelin's ERC20 defaults to 18 decimals. We need to override _decimals.
        // However, the standard ERC20.sol doesn't allow setting decimals in constructor directly.
        // We would typically override the decimals() function or use a preset like ERC20PresetMinterPauser.
        // For simplicity here, and to ensure 6 decimals, we'll use a more direct approach if needed,
        // or acknowledge that a standard OZ ERC20 might default to 18 and require adjustment in usage.

        // To explicitly set decimals to 6, we would need to override the decimals() function.
        // For this exercise, we'll assume the standard ERC20 is sufficient and consumers
        // will be aware of its decimal places. If a specific decimal count is critical and
        // not 18, a custom ERC20 or a different OpenZeppelin preset would be used.
        // Let's stick to a simple ERC20 and note that decimals are 18 by default with OZ.
        // The plan implies 6 decimals for RLUSD values in database/display.
        // For an actual implementation, we'd use ERC20Permit or ERC20PresetMinterPauser
        // and ensure decimals are set to 6.

        // Given the constraints, let's make a version that explicitly sets decimals.
        // This requires not using the direct OZ ERC20 but a custom version or ensuring the version used supports it.
        // For now, I will proceed with the standard OZ ERC20 and add a comment.
        // If precise control over decimals is needed and the base OZ ERC20 is used,
        // it will be 18. The project's off-chain logic would need to handle this.
    }

    // Override decimals to be 6
    function decimals() public view virtual override returns (uint8) {
        return 6;
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }

    function burnFrom(address account, uint256 amount) public onlyOwner {
        _burn(account, amount);
    }
}