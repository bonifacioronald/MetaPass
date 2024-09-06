const { expect } = require("chai");
const { ethers } = require("hardhat");

const NAME = "MetaPass";
const SYMBOL = "MP";

const OCCASION_NAME = "ETH Texas";
const OCCASION_COST = ethers.utils.parseUnits("1",'ether');
const OCCASION_MAX_TICKETS = 100;
const OCCASION_DATE = 'Apr 27';
const OCCASION_TIME = "10:00AM CST";
const OCCASION_LOCATION = "Austin, TX";


describe("MetaPass", () => {
  let metaPass
  let deployer, buyer

  beforeEach(async () => {
    [deployer, buyer] = await ethers.getSigners(); //Signers are the accounts that can sign transactions 

    // Deploy the contract
    const MetaPass = await ethers.getContractFactory(NAME);
    metaPass = await MetaPass.deploy(NAME, SYMBOL);

    //Create a new occassion
    //Specify the acount to do/sign the transaction using the connect keyword, then call the list function
    const transaction = await metaPass.connect(deployer).list( 
      OCCASION_NAME, 
      OCCASION_COST, 
      OCCASION_MAX_TICKETS, 
      OCCASION_DATE, 
      OCCASION_TIME, 
      OCCASION_LOCATION
    ); 

    await transaction.wait(); //wait for the transaction to be included in the blockchain

  })

  describe("Deployment", () => {
    it("Sets the name", async ()  => {
      expect(await metaPass.name()).to.equal(NAME);
    })

    it("Sets the symbol",  async () => {
      expect(await metaPass.symbol()).to.equal(SYMBOL);
    })

    it("Sets the owner", async () => {
      expect(await metaPass.owner()).to.equal(deployer.address);
    })
  })

  describe("Occasions", () => {
    it("Update occasions count", async () => {
      const totalOccasions = await metaPass.totalOccasions(); //the global totalOccasions variable
      expect(totalOccasions).to.equal(1);
    })

    it("Return occasion details", async () => {
      const ocassion =await metaPass.getOccasion(1);
      expect(ocassion.name).to.equal(OCCASION_NAME);
      expect(ocassion.cost).to.equal(OCCASION_COST);
      expect(ocassion.maxTickets).to.equal(OCCASION_MAX_TICKETS);
      expect(ocassion.date).to.equal(OCCASION_DATE);
      expect(ocassion.time).to.equal(OCCASION_TIME);
      expect(ocassion.location).to.equal(OCCASION_LOCATION);
    })
  })

  describe("Minting", async () => {
    const ID = 1; //example occasion id
    const SEAT = 50; //example seat number bought
    const AMOUNT = ethers.utils.parseUnits("1", "ether"); //example amount paid

    beforeEach(async () => {
      const transaction = await metaPass.connect(buyer).mint(ID, SEAT, { value: AMOUNT }); //connect the buyer account to the contract (sign the tx) and mint a ticket
      await transaction.wait();
    })

    it("Update ticket count", async () => {
        const occassion = await metaPass.getOccasion(ID);
        expect(occassion.remainingTickets).to.equal(OCCASION_MAX_TICKETS - 1)
    })

    it("Update buying status", async () => {
      const status = await metaPass.hasBought(ID, buyer.address);
      expect(status).to.equal(true);
    })

    it("Updates seat status", async () => {
      const owner = await metaPass.seatOwnership(ID, SEAT);
      expect(owner).to.equal(buyer.address);
    })

    it("Updates overall seating status", async () => {
      const seats = await metaPass.getAllSeatNumbersTakenInAnOccasion(ID);
      expect(seats.length).to.equal(1);
      expect(seats[0]).to.equal(SEAT);
    })

    it("Updates contract balance", async () => {
      const balance = await ethers.provider.getBalance(metaPass.address); //get the balance of the contract
      expect(balance).to.equal(AMOUNT);
    })
  })
})
