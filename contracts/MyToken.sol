// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    address public owner;
    modifier onlyOwner() {
        require(msg.sender == owner, "Forbidden for user");
        _;
    }

    constructor(uint supplyInit) ERC20("My Memory", "MEME") {
        owner = msg.sender;
        _mint(msg.sender, supplyInit);
    }

    function mint() public payable {
        _mint(msg.sender, msg.value * 100);
    }

    function burn(uint amount) public onlyOwner {
        _burn(owner, amount);
    }
}
