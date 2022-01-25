const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("StakingToken", function () {
  it("Should have 100M initial mint.", async function () {
    const StakingToken = await ethers.getContractFactory("StakingToken");
    const stakingtoken = await StakingToken.deploy("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", "100000000");
    await stakingtoken.deployed();

    // expect(await greeter.greet()).to.equal("Hello, world!");
    const balance = await stakingtoken.balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
    // console.log("Balance is", balance.toString());
    const parsedBalance =  balance.toString();
    console.log(parsedBalance);
    expect(parsedBalance).to.equal("100000000");

    // const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // // wait until the transaction is mined
    // await setGreetingTx.wait();

    // expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});
