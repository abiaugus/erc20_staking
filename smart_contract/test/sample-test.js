const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("StakingToken", function () {
  let StakingToken;
  let stakingtoken;
  let owner;
  let stakeHolderA;
  let stakeHolderASign;
  let stakeHolderBSign;
  beforeEach( async () => {
    const signers = await ethers.getSigners();
    owner = signers[0];
    stakeHolderA = signers[2].address;
    stakeHolderASign = signers[2];
    stakeHolderBSign = signers[3];
    // console.log("owner", owner, stakeHolderA);
    StakingToken = await ethers.getContractFactory("StakingToken");
    stakingtoken = await StakingToken.deploy(owner.address, "100000000");
    // owner = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
    // stakeHolderA = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
  })

  describe("Mint", async() => {
    it("Should have 100M initial mint.", async function () {
      await stakingtoken.deployed();
      const balance = await stakingtoken.balanceOf(owner.address);
      const parsedBalance =  balance.toString();
      expect(parsedBalance).to.equal("100000000");
    });
  })

  describe("Transfer", async() => {
    it("can transfer tokens", async () => {
      await stakingtoken.deployed();
      stakingtoken.transfer(stakeHolderA, "10000000");
      const balance = await stakingtoken.balanceOf(stakeHolderA);
      const parsedBalance =  balance.toString();
      expect(parsedBalance).to.equal("10000000");
    })
  })
  describe("Stakes", async() => {
    it("can create stakes and keep track of totalStakes", async() => {
      await stakingtoken.deployed();
      await stakingtoken.transfer(stakeHolderA, 10);
      await stakingtoken.transfer(stakeHolderBSign.address, 10);
      await stakingtoken.connect(stakeHolderASign).createStake(5);
      await stakingtoken.connect(stakeHolderBSign).createStake(5);
      const balance = await stakingtoken.balanceOf(stakeHolderA);
      const parsedBalance =  balance.toString();
      expect(parsedBalance).to.equal("5");
      const totalStakes = await stakingtoken.totalStakes();
      const parsedStakes = totalStakes.toString();
      expect(parsedStakes).to.equal("10");
    })
  })
  describe("Rewards", async () => {
    it("can distribute rewards", async () => {
      await stakingtoken.deployed();
      await stakingtoken.transfer(stakeHolderA, 100);
      await stakingtoken.connect(stakeHolderASign).createStake(100);
      await stakingtoken.distributeRewards();
      const rewards = await stakingtoken.rewardOf(stakeHolderA);
      expect(rewards).to.equal(1);
    })
  })
});
