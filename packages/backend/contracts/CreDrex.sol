// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "./CreDrexKYCBadge.sol";
import "./WrappedBRL.sol";
import "./MathUtil.sol";

contract CreDrex is MathUtil {
    using SafeMath for uint256;

    WrappedBRL public wBRL;
    CreDrexKYCBadge public creDrexKYCBadge;

    uint256 public totalBorrowed;
    uint256 public totalReserve;
    uint256 public totalDeposit;
    uint256 public baseRate = 20000000000000000;
    uint256 public fixedAnnuBorrowRate = 300000000000000000;

    mapping(address => uint256) public usersBorrowed;
    mapping(address => uint256) public usersDeposited;

    constructor(address _wBRLAddress, address _creDrexKYCBadgeAddress) {
        wBRL = WrappedBRL(_wBRLAddress);
        creDrexKYCBadge = CreDrexKYCBadge(_creDrexKYCBadgeAddress);
    }

    modifier hasKYCBadge() {
        require(
            creDrexKYCBadge.balanceOf(msg.sender) > 0,
            "No KYC badge found"
        );
        _;
    }

    function deposit(uint256 _amount) public hasKYCBadge {
        require(_amount > 0, "Amount must be greater than 0");
        usersDeposited[msg.sender] += _amount;
        totalDeposit += _amount;
        wBRL.transferFrom(msg.sender, address(this), _amount);
    }

    function withdraw(uint256 _amount) public hasKYCBadge {
        require(wBRL.balanceOf(address(this)) >= _amount, "Not enough balance");
        uint256 depositRate = _depositRate();
        uint256 gain = mulExp(_amount, depositRate);
        uint256 withdrawAmount = _amount.add(gain);
        usersDeposited[msg.sender] -= withdrawAmount;
        totalDeposit -= withdrawAmount;
        wBRL.transfer(msg.sender, withdrawAmount);
    }

    function borrow(uint256 _amount) public hasKYCBadge {
        require(wBRL.balanceOf(address(this)) >= _amount, "Not enough balance");
        usersBorrowed[msg.sender] += _amount;
        totalBorrowed += _amount;
        wBRL.transfer(msg.sender, _amount);
    }

    function repay(uint256 _amount) public hasKYCBadge {
        require(usersBorrowed[msg.sender] > 0, "Doesnt have a debt to pay");
        wBRL.transferFrom(msg.sender, address(this), _amount);
        (uint256 fee, uint256 paid) = calculateBorrowFee(_amount);
        usersBorrowed[msg.sender] -= _amount;
        totalBorrowed -= _amount;
        totalReserve += fee;
    }

    function calculateBorrowFee(
        uint256 _amount
    ) public view returns (uint256, uint256) {
        uint256 borrowRate = _borrowRate();
        uint256 fee = mulExp(_amount, borrowRate);
        uint256 paid = _amount.sub(fee);
        return (fee, paid);
    }

    function _getLatestPrice() public view returns (int256) {
        return 5 * 10 ** 10;
    }

    function _utilizationRatio() public view returns (uint256) {
        return getExp(totalBorrowed, totalDeposit);
    }

    function _interestMultiplier() public view returns (uint256) {
        uint256 uRatio = _utilizationRatio();
        uint256 num = fixedAnnuBorrowRate.sub(baseRate);
        return getExp(num, uRatio);
    }

    function _borrowRate() public view returns (uint256) {
        uint256 uRatio = _utilizationRatio();
        uint256 interestMul = _interestMultiplier();
        uint256 product = mulExp(uRatio, interestMul);
        return product.add(baseRate);
    }

    function _depositRate() public view returns (uint256) {
        uint256 uRatio = _utilizationRatio();
        uint256 bRate = _borrowRate();
        return mulExp(uRatio, bRate);
    }
}
