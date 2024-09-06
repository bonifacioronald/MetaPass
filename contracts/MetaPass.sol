// SPDX-License-Identifier: MIT-License
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MetaPass is ERC721 {
    address public owner; //Owner of the contract (can withdraw money)

    constructor(
        string memory _name, 
        string memory _symbol) 
    ERC721(_name, _symbol) {

        owner = msg.sender; //Message -> global variable; sender is the address of the person who is calling the function 

    }

}
