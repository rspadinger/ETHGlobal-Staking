// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract Staking is Ownable {
    uint256 public constant BASE = 10000; //100%
    uint256 public constant SECONDS_PER_YEAR = 365 * 24 * 60 * 60; //31536000

    IERC20 public stakingToken;

    struct UserInfo {
        uint256 totalStaked;
        uint256 weightedStartTime;
    }

    mapping(address => UserInfo) public userInfo;

    uint256 public minimumStakeAmount = 10e18;
    uint256 public annualRewardRate = 1000; // expressed in basis points (e.g., 1000 = 10%)
    uint256[3] public tierThresholds = [1000 ether, 5000 ether, 10000 ether];
    uint256[3] public tierRewardRates = [300, 500, 700]; // 3%, 5%, 7%

    uint256 public lockPeriod = 30 days;
    uint256 public earlyWithdrawalPenalty = 500; // 5% penalty

    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount, uint256 penalty);
    event AnnualRewardRateUpdated(uint256 newAnnualRate);

    constructor(address _stakingToken) Ownable(msg.sender) {
        stakingToken = IERC20(_stakingToken);
    }

    // ========= Staking Functions =========
    function stake(uint256 amount) external {
        require(amount >= minimumStakeAmount, "Stake must be at least minimumStakeAmount");

        UserInfo storage user = userInfo[msg.sender];

        if (user.totalStaked > 0) {
            // Update weighted start time using weighted average
            uint256 totalWeight = (user.totalStaked * user.weightedStartTime) + (amount * block.timestamp);
            user.weightedStartTime = totalWeight / (user.totalStaked + amount);
        } else {
            user.weightedStartTime = block.timestamp;
        }

        user.totalStaked += amount;

        stakingToken.transferFrom(msg.sender, address(this), amount);
        emit Staked(msg.sender, amount);
    }
}
