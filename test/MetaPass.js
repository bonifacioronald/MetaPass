const { expect } = require("chai");
const { ethers } = require("hardhat");

const NAME = "MetaPass";
const SYMBOL = "MP";

describe("MetaPass", () => {
  let metaPass
  let deployer, buyer

  beforeEach(async () => {
    [deployer, buyer] = await ethers.getSigners() //Signers are the accounts that can sign transactions

    // Deploy the contract
    const MetaPass = await ethers.getContractFactory(NAME);
    metaPass = await MetaPass.deploy(NAME, SYMBOL);

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


})
