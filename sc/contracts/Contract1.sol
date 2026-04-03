// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IContract1.sol";

import "hardhat/console.sol";

/// @title CONTRACT Protocol Token
/// @notice ERC20-compliant token with capped supply and burn functionality.
/// @dev Uses OpenZeppelin's ERC20 and Ownable for standard behavior.
contract Contract1 is ERC20, Ownable {
    /// @notice Maximum number of tokens that can ever be minted.
    uint256 public constant MAX_SUPPLY = 1_000_000 ether;

    /// @notice Tracks the total number of tokens minted.
    uint256 public totalMinted;
}
