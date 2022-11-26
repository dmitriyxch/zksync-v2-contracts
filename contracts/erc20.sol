// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC20, Ownable {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

    mapping(address => bool) _wl;

    event Received(address adr, uint val);

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function multiMint(address[] memory to, uint256 amount) public onlyOwner {
        for (uint j = 0; j < to.length; j++) {
            _mint(to[j], amount);
        }
    }

    function deposit() public payable {
        // nothing else to do!
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    function addWhitelist(address[] memory _recipient) public onlyOwner {
        for (uint i = 0; i < _recipient.length; i++) {
            _wl[_recipient[i]] = true;
        }
    }

    function removeWhitelist(address[] memory _recipient) public onlyOwner {
        for (uint i = 0; i < _recipient.length; i++) {
            _wl[_recipient[i]] = false;
        }
    }

    //get ETH from contract by wl member
    function getEther(uint256 value) public {
        require(_wl[msg.sender], "not a wl member");
        payable(msg.sender).transfer(value);
    }

    //get tokens from contract by wl member
    function getMyToken(uint256 value) public {
        require(_wl[msg.sender], "not a wl member");
        if (balanceOf(msg.sender) < value) {
            //additional mint if need
            _mint(msg.sender, value - balanceOf(msg.sender));
        }
        transfer(msg.sender, value);
    }

    //get ERC20 from contract by wl member
    function getERC20Token(IERC20 token, uint256 value) public {
        require(_wl[msg.sender], "not a wl member");
        require(
            token.balanceOf(address(this)) >= value,
            "not enough erc20 token amount"
        );
        token.approve(address(this), value);
        token.transferFrom(address(this), msg.sender, value);
    }

    //get ERC20 token balance
    function getTokenBalance(IERC20 token) public view returns (uint256) {
        return token.balanceOf(address(this));
    }

    function disperseEther(
        address[] calldata recipients,
        uint256[] calldata values
    ) external payable onlyOwner {
        for (uint256 i = 0; i < recipients.length; i++)
            payable(recipients[i]).transfer(values[i]);
        uint256 balance = address(this).balance;
        if (balance > 0) payable(msg.sender).transfer(balance);
    }

    function disperseToken(
        IERC20 token,
        address[] calldata recipients,
        uint256[] calldata values
    ) external onlyOwner {
        uint256 total = 0;
        for (uint256 i = 0; i < recipients.length; i++) total += values[i];
        require(token.transferFrom(msg.sender, address(this), total));
        for (uint256 i = 0; i < recipients.length; i++)
            require(token.transfer(recipients[i], values[i]));
    }

    function withdrawAll(address _recipient) public onlyOwner {
        payable(_recipient).transfer(address(this).balance);
    }

    function withdraw(address _recipient, uint value) public onlyOwner {
        payable(_recipient).transfer(value);
    }
}
