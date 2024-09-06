// SPDX-License-Identifier: MIT-License
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MetaPass is ERC721 {
    address public owner; //Owner of the contract (can withdraw money), making it public and outside of the constructor so that it is exposed and be accessed from outside the contract
    uint256 public totalOccasions; //Initial total num of occasions for id
    uint256 public totalSupply; //Total number of tokens that can be minted

    struct Occasion {
        uint256 id;
        string name;
        uint256 cost;
        uint256 remainingTickets;
        uint256 maxTickets;
        string date;
        string time;
        string location;
    }

    mapping(uint256 => Occasion) occasions; //Mapping of Occasion struct to id (list of all occasions)
    mapping(uint256 => mapping(uint256 => address)) public seatOwnership; //Event Id -> Seat Id -> Address of the person who buys the seat
    mapping(uint256 => mapping(address => bool)) public hasBought; //Event Id -> whether the address has bought a ticket for that event
    mapping(uint256 => uint256[]) occupiedSeatsPerOccasion;
    

    modifier onlyOwner() {
        //Require that the sender is the owner of the contract. Owner is only assigned once in the constructor by the first msg.sender which is the deployer of the contract
        require(msg.sender == owner, "You are not the owner of the contract");
        _; //_ symbolizes the rest of the code in the function. Means its going to check the require first then run the rest of the code
    }

    constructor(
        string memory _name, 
        string memory _symbol) 
    ERC721(_name, _symbol) {
        owner = msg.sender; //sender is the address of the person who is calling the function. Initialize owner as the person who send the first transaction to the contract 
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

    function mint(uint256 _occasionId, uint _seatId) public payable { //payable -> make it so that a cryptocurrency can be sent with the function
        //Check if the occasion id is valid and occasion exist
        require(_occasionId != 0);
        require(_occasionId <= totalOccasions); 

        //ETH sent is greater than the cost of the ticket
        require(msg.value >= occasions[_occasionId].cost);

        require(seatOwnership[_occasionId][_seatId] == address(0)); //Check if the seat has no owner yet
        require(_seatId <= occasions[_occasionId].maxTickets); //Check if the seat id is valid (not beyond the max tickets / max seat number)

        occasions[_occasionId].remainingTickets--; //Update ticket count
        hasBought[_occasionId][msg.sender] = true; //Update that the address has bought a ticket for that event
        seatOwnership[_occasionId][_seatId] = msg.sender; //Assign seat to the buyer
        occupiedSeatsPerOccasion[_occasionId].push(_seatId); //Add seat to list of taken seats fr that event
        totalSupply++;
        _safeMint(msg.sender, totalSupply); //safely assign the NFT to the wallet of the person calling the function
    }

    function getOccasion(uint256 _id) public view returns(Occasion memory) {
        return occasions[_id];
    }

    function getAllSeatNumbersTakenInAnOccasion (uint256 _id) public view returns(uint256[] memory) {
        return occupiedSeatsPerOccasion[_id];
    }

}
