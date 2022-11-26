//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Simpler {
    string private greeting;

    constructor(string memory _greeting) {
        greeting = _greeting;
    }

    function simpleGreat() public view returns (string memory) {
        return greeting;
    }

    function setSimpleGreat(string memory _greeting) public {
        greeting = _greeting;
    }
}
