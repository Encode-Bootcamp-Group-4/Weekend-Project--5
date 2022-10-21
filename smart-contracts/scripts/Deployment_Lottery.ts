import { ethers } from "hardhat";
import * as dotenv from "dotenv";
//import { MyToken, MyToken__factory } from "../smart-contracts/typechain-types";
import {LotteryToken, LotteryToken__factory} from "../typechain-types";
import {Lottery, Lottery__factory} from "../typechain-types";

dotenv.config();

async function main() {

    let TOKEN_RATIO = 100;
    let BET_PRICE = 10;
    let BET_FEE = 1;


    // LotteryToken ---------------------------------------
    let MyLotteryTokenContract: LotteryToken;
    let MyLotteryContract: Lottery;

    const options = {
        // The default provider will be used if no provider is specified
        alchemy: process.env.ALCHEMY_API_KEY,
    }

    const provider = ethers.getDefaultProvider("goerli", options);

    console.log("Deploying MyLottery contract...");

    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
    console.log("Wallet address: ", wallet.address);
    const signer = wallet.connect(provider);


    // Lottery
    const myLotteryFactory = new Lottery__factory(signer);
    MyLotteryContract = await myLotteryFactory.deploy(
        "PudimCoin", 
        "PDM",
        TOKEN_RATIO,
        ethers.utils.parseEther(BET_PRICE.toFixed(18)),
        ethers.utils.parseEther(BET_FEE.toFixed(18)),
    );
    
    const deployment = await MyLotteryContract.deployed();
    const tokenAddress = await MyLotteryContract.paymentToken();
    const myLotteryTokenFactory = new LotteryToken__factory(signer);
    const token = myLotteryTokenFactory.attach(tokenAddress);
    
    console.log("Token: ", token);
    console.log("MyLottery contract deployed to: ", deployment.address);

    // Lottery ---------------------------------------

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});