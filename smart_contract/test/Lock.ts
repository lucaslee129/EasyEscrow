import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre, { ethers } from "hardhat";

describe("Deployment", function () {
  let sender: any;
  let recipient: any;
  let validator: any;
  let easyEscrowContract: any;
  const seedPhrase = "I am a blockchain Engineer";

  beforeEach("Should deploy the smart contract on VM", async function () {
    [sender, recipient, validator] = await hre.ethers.getSigners();

    const EasyEscrow = await hre.ethers.getContractFactory("EasyEscrow");
    easyEscrowContract = await EasyEscrow.deploy();
  });

  it("the escrow should be created", async function() {
    const blockNumBefore = await hre.ethers.provider.getBlockNumber();
    const blockBefore = await hre.ethers.provider.getBlock(blockNumBefore);
    const timestampBefore = blockBefore?.timestamp;
    
    if (timestampBefore === undefined) {
      throw new Error("Failed to get block timestamp");
    }

    const condition = hre.ethers.sha256(hre.ethers.toUtf8Bytes(seedPhrase));

    await easyEscrowContract.createEscrow(
      123321,
      sender.address,
      validator.address,
      1000,
      recipient.address,
      (timestampBefore + 3600),
      condition,
      {
        value: 1000,
      }
    );

    // console.log("Get Escrow>>>", await easyEscrowContract.getEscrow(123321));

    time.increase(3800);
  })  


  it('the easy escrow should be finished status', async function() {
    const blockNumBefore = await hre.ethers.provider.getBlockNumber();
    const blockBefore = await hre.ethers.provider.getBlock(blockNumBefore);
    const timestampBefore = blockBefore?.timestamp;
    
    if (timestampBefore === undefined) {
      throw new Error("Failed to get block timestamp");
    }

    const condition = hre.ethers.sha256(hre.ethers.toUtf8Bytes(seedPhrase));

    await easyEscrowContract.createEscrow(
      123321,
      sender.address,
      validator.address,
      1000,
      recipient.address,
      (timestampBefore + 3000),
      condition,
      {
        value: 1000,
      }
    );


    await time.increase(3800);

    await easyEscrowContract.connect(recipient).finishEscrow(123321);
    // console.log("Get Escrow>>>", await easyEscrowContract.getEscrow(123321));
  })

  it("should occur the error while releasing the fund", async function() {
    let provider = ethers.provider;
    const blockNumBefore = await hre.ethers.provider.getBlockNumber();
    const blockBefore = await hre.ethers.provider.getBlock(blockNumBefore);
    const timestampBefore = blockBefore?.timestamp;
    
    if (timestampBefore === undefined) {
      throw new Error("Failed to get block timestamp");
    }

    const condition = hre.ethers.sha256(hre.ethers.toUtf8Bytes(seedPhrase));

    await easyEscrowContract.createEscrow(
      123321,
      sender.address,
      validator.address,
      1000,
      recipient.address,
      (timestampBefore + 360),
      condition,
      {
        value: 1000,
      }
    );
    await time.increase(4200);
    await easyEscrowContract.connect(recipient).finishEscrow(123321);
    await easyEscrowContract.releaseFund(123321);
    await easyEscrowContract.connect(recipient).releaseFund(123321);
    console.log(await easyEscrowContract.getAcceptStatus(123321));

    // console.log("Get Escrow>>>", await easyEscrowContract.getEscrow(123321));
  })

  it("test for validation escrow", async function() {
    const blockNumBefore = await hre.ethers.provider.getBlockNumber();
    const blockBefore = await hre.ethers.provider.getBlock(blockNumBefore);
    const timestampBefore = blockBefore?.timestamp;
    
    if (timestampBefore === undefined) {
      throw new Error("Failed to get block timestamp");
    }

    const condition = hre.ethers.sha256(hre.ethers.toUtf8Bytes(seedPhrase));

    await easyEscrowContract.createEscrow(
      123321,
      sender.address,
      validator.address,
      1000,
      recipient.address,
      (timestampBefore + 3600),
      condition,
      {
        value: 1000,
      }
    );
    // console.log("Get Escrow>>>", await easyEscrowContract.getEscrow(123321));
    let provider = ethers.provider;

    console.log("Funds on the contract Before", await provider.getBalance(await easyEscrowContract.getAddress()));

    await easyEscrowContract.connect(validator).validateEscrow(123321, true);
    console.log("Funds on the contract After", await provider.getBalance(await easyEscrowContract.getAddress()));
    console.log(await easyEscrowContract.getAcceptStatus(123321));
  })
});