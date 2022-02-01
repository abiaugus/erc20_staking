import React, {useState} from "react";
import { ethers } from "ethers";
import { AppContext } from "../context/AppContext";
// import detectEthereumProvider from '@metamask/detect-provider';
import { contractABI, contractAddress } from "../utils/constants";

const {ethereum} = window;
const provider = new ethers.providers.Web3Provider(window.ethereum)

let isOwnerState;
let cAccount = "";
let cBalance;
let res;
let count = 10;

const checkForMM = async () => {
    if(provider){
        console.log("Metamask is installed..");
    }
}

const getStakingContract = () => {
    const signer = provider.getSigner();
    const stakingContract = new ethers.Contract(contractAddress, contractABI, signer);
    return stakingContract;
}
const getTotalSupply = async() => {
    const stakingContract = getStakingContract();
    const totalSupply = await stakingContract.totalSupply();
    console.log("total supply is", totalSupply.toString());
}
const transferTokens = async() => {
    const stakingContract = getStakingContract();
    const result = await stakingContract.transfer("0x104003192149eed6e1a6EE18A489Cd231B154bB7","1000");
    console.log("tx result is", result);
}






const LandingPage = () => {
    checkForMM();
    const [tokenCount, setTokenCount] = useState();
    const [message, setMessage] = useState("");
    const [isOwner, setIsOwner] = useState(false);
    const [balance, setBalance] = useState("");
    const [rewards, setRewards] = useState();
    const [currentAccount, setCurrentAccount] = useState("");
    // const [totalSupply, setTotalSupply] = useState("");

    const getAccountsMM = async () => {
        const accounts = await ethereum.request({method: 'eth_requestAccounts'});
        console.log(accounts[0]);
        const balance = await provider.getBalance(accounts[0]);
        console.log("Balance is", balance.toString() / 10 ** 18);
        cAccount = accounts[0];
        setCurrentAccount(accounts[0]);
        cBalance = balance.toString() / 10 ** 18;
    }
    getAccountsMM();

    const checkIfOwner = async() => {
        const stakingContract = getStakingContract();
        isOwnerState = await stakingContract.isOwner();
        console.log("is owner?", isOwnerState);
        setIsOwner(isOwnerState);
        // setMessage(isOwnerState ? "This is the owner" : "This is not the owner");
    }

    const totalStakes = async () =>{
        const stakingContract =  getStakingContract();
        const accounts = await ethereum.request({method: 'eth_requestAccounts'});
        const stake = await stakingContract.stakeOf(accounts[0]);
        console.log("The stake is", stake.toString());
        setMessage(`You have staked  ${stake.toString()} Tokens`);
    }
    const checkBalance = async () => {
        const stakingContract = getStakingContract();
        const balance = await stakingContract.balanceOf(cAccount);
        console.log(cAccount);
        console.log("balance is", balance.toString());
        setMessage(`${balance.toString()} Tokens`);
    }
    const getRewards = async () => {
        const stakingContract =  getStakingContract();
        const accounts = await ethereum.request({method: 'eth_requestAccounts'});
        const rewards = await stakingContract.rewardOf(accounts[0]);
        console.log("rewards is", rewards.toString());
        let res = rewards.toString();
        console.log("Rewards is", rewards);
        setRewards(res);
        setMessage(res);
    }
    const createStake = async () =>{
        const stakingContract =  getStakingContract();
        const accounts = await ethereum.request({method: 'eth_requestAccounts'});
        const balanceb4stake = await stakingContract.balanceOf(accounts[0]);
        const result = await stakingContract.createStake(500);
        const balanceAfterStake = await stakingContract.balanceOf(accounts[0]);
        console.log("before", balanceb4stake.toString());
        console.log("after", balanceAfterStake.toString());
        console.log("result", result);
        const totalStakes = await stakingContract.totalStakes();
        console.log("total stakes",totalStakes.toString());
    }
    const removeStakes = async () => {
        const stakingContract =  getStakingContract();
        await stakingContract.removeStake(500);
    }
    const distributeRewards = async () => {
        const stakingContract =  getStakingContract();
        await stakingContract.distributeRewards();
    }
    const withdrawRewards = async () => {
        const stakingContract =  getStakingContract();
        await stakingContract.withdrawReward();
    }
    const getTotalSupply = async() => {
        const stakingContract = getStakingContract();
        const totalSupply = await stakingContract.totalSupply();
        console.log("total supply is", totalSupply.toString());
        setMessage(`Total Supply is ${totalSupply.toString()}`);

    }

    return(
        <div className="flex w-full justify-center items-center">
            <div className="flex mf:flex-row flex-col items-start justify-between md:p-20 py-10 px-2">
         {/* <button className="flex flex-row justify-center items-center my-3 bg-[#2952e3] p-2 rounded-full cursor-pointer hover:bg-[#2546bd] text-white" onClick={getAccountsMM}>
             Click to fetch Accounts
         </button> */}
         <button className="flex flex-row justify-center items-center my-3 bg-[#2952e3] p-2 rounded-full cursor-pointer hover:bg-[#2546bd] text-white" onClick={getTotalSupply}>
             Get Total Supply
         </button>
         {isOwner ?
         (<button  className="flex flex-row justify-center items-center my-3 bg-[#2952e3] p-2 rounded-full cursor-pointer hover:bg-[#2546bd] text-white" onClick={transferTokens}>
            Transfer 1000 tokens.
         </button>) : ("")
        }
         
         <button className="flex flex-row justify-center items-center my-3 bg-[#2952e3] p-2 rounded-full cursor-pointer hover:bg-[#2546bd] text-white" onClick={checkBalance}>
            Check Your Balance
         </button>
         <button className="flex flex-row justify-center items-center my-3 bg-[#2952e3] p-2 rounded-full cursor-pointer hover:bg-[#2546bd] text-white" onClick={checkIfOwner}>
             Check if Owner
         </button>
         <button className="flex flex-row justify-center items-center my-3 bg-[#2952e3] p-2 rounded-full cursor-pointer hover:bg-[#2546bd] text-white" onClick={createStake}>
             Create a Stake (500 Tokens)
         </button>
         <button className="flex flex-row justify-center items-center my-3 bg-[#2952e3] p-2 rounded-full cursor-pointer hover:bg-[#2546bd] text-white" onClick={removeStakes}>
             Remove Stake (500 Tokens)
         </button>
         <button className="flex flex-row justify-center items-center my-3 bg-[#2952e3] p-2 rounded-full cursor-pointer hover:bg-[#2546bd] text-white" onClick={totalStakes}>
             Stakes of {cAccount}
         </button>
         <button className="flex flex-row justify-center items-center my-3 bg-[#2952e3] p-2 rounded-full cursor-pointer hover:bg-[#2546bd] text-white" onClick={getRewards}>
             Get rewards info
         </button>
         <button className="flex flex-row justify-center items-center my-3 bg-[#2952e3] p-2 rounded-full cursor-pointer hover:bg-[#2546bd] text-white" onClick={withdrawRewards}>
             Withdraw Rewards.
         </button>
         {/* <button className="flex flex-row justify-center items-center my-3 bg-[#2952e3] p-2 rounded-full cursor-pointer hover:bg-[#2546bd] text-white" onClick={beStakeHolder}>
             Be a Stake Holder
         </button> */}

         { isOwner ? (
             <>
                <button className="flex flex-row justify-center items-center my-3 bg-[#2952e3] p-2 rounded-full cursor-pointer hover:bg-[#2546bd] text-white" onClick={transferTokens}>
                    You are the owner. Click to Transfer 1000 Tokens.
                </button>
                <button className="flex flex-row justify-center items-center my-3 bg-[#2952e3] p-2 rounded-full cursor-pointer hover:bg-[#2546bd] text-white" onClick={distributeRewards}>
                    Click here to distribute rewards.
                </button>
            </>

         ) : (
             <p>You are not the owner. Contact owner to get Tokens.</p>
         )}
            <form>
      <label>Enter your Stake and hit enter:
        <input
          type="text" 
          onChange={(e) => setTokenCount(e.target.value)}
          onSubmit={createStake}
        />
      </label>
    </form>
    <h1 className="text-3xl">{message}</h1>
         </div>
        </div>
    )

}

export default LandingPage;