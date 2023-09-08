// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract WrappedBRL is ERC20 {
    constructor() ERC20("WrappedBRL", "wBRL") {}

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}
