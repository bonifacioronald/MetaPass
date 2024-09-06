// SPDX-License-Identifier: MIT-License
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MetaPass is ERC721 {
    address public owner; //Owner of the contract (can withdraw money), making it public and outside of the constructor so that it is exposed and be accessed from outside the contract
    uint256 public totalOccasions; //Initial total num of occasions for id

    struct Occasion {
        uint256 id;
        string name;
        uint256 cost;
        uint256 tickets;
        uint256 maxTickets;
        string date;
        string time;
        string location;
    }

    mapping(uint256 => Occasion) occasions; //Mapping of Occasion struct to id (list of all occasions)

    modifier onlyOwner() {
        //Require that the sender is the owner of the contract. Owner is only assigned once in the constructor by the first msg.sender which is the deployer of the contract
        require(msg.sender == owner, "You are not the owner of the contract");
        _; //_ symbolizes the rest of the code in the function. Means its going to check the require first then run the rest of the code
    }

    constructor(
        string memory _name, 
        string memory _symbol) 
    ERC721(_name, _symbol) {
        owner = msg.sender; //Message -> global variable; sender is the address of the person who is calling the function 
    }

    //List events to the blockchain
    //public function -> can be called from outside of the smart contract (from the app)
    function list(
        string memory _name,
        uint256 _cost,
        uint256 _maxTickets,
        string memory _date,
        string memory _time,
        string memory _location
    ) public onlyOwner {    

        totalOccasions ++; 
        //Mapping the Occasion struct to the ocassions mapping using its id as the key
        Occasion memory addedOccacsion = Occasion(totalOccasions, _name, _cost, _maxTickets, _maxTickets, _date, _time, _location); 
        occasions[totalOccasions] = addedOccacsion;
    }

    function getOccasion(uint256 _id) public view returns(Occasion memory) {
        return occasions[_id];
    }

}
