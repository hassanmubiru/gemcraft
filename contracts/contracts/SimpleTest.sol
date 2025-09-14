// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract SimpleTest {
    string public message;
    
    constructor(string memory _message) {
        message = _message;
    }
    
    function getMessage() public view returns (string memory) {
        return message;
    }
}
