import { Component, OnInit } from '@angular/core';
import { ethers } from 'ethers';
import { WalletService } from '../services/wallet.service';
import { FormControl } from '@angular/forms';

import Lottery from '../../assets/abi/Lottery.json';
import LotteryToken from '../../assets/abi/LotteryToken.json';

const LOTTERY_ADDRESS = '0x109565dFdA78De21A7E8459fb008B108f0d9A09b';
const LOTTERYTOKEN_ADDRESS = '0xFa0A807a048D56E5b2Bdd59b570dBe4834bf802e';

@Component({
  selector: 'app-lottery',
  templateUrl: './lottery.component.html',
  styleUrls: ['./lottery.component.scss'],
})
export class LotteryComponent implements OnInit {
  walletId: string = '';
  provider: any;
  signer: any;
  contract: any;
  token: any;
  public ethereum;

  constructor(private walletService: WalletService) {
    this.ethereum = (window as any).ethereum;
    this.provider = new ethers.providers.Web3Provider(this.ethereum);
    this.signer = this.provider.getSigner();
    this.contract = new ethers.Contract(
      LOTTERY_ADDRESS,
      Lottery.abi,
      this.signer
    );
    this.token = new ethers.Contract(
      LOTTERYTOKEN_ADDRESS,
      LotteryToken.abi,
      this.signer
    );
  }

  ngOnInit(): void {
    this.walletService
      .checkWalletConnected()
      .then((accounts) => (this.walletId = accounts[0]));
  }

  async getLotteryState() {
    const state = await this.contract.betsOpen();
    alert(`The lottery is ${state ? 'open' : 'closed'}\n`);
    // works up to here
    if (!state) return;
    this.provider
      .getBlock('latest')
      .then((currentBlock: any) => {
        const currentBlockDate = new Date(currentBlock.timestamp * 1000);
        alert(
          `The last block was mined at ${currentBlockDate.toLocaleDateString()} : ${currentBlockDate.toLocaleTimeString()}\n`
        );
      })
      .catch((error: any) => {
        alert({ error });
      });
    const closingTime = await this.contract.betsClosingTime();
    const closingTimeDate = new Date(closingTime.toNumber() * 1000);
    alert(
      `lottery should close at ${closingTimeDate.toLocaleDateString()} : ${closingTimeDate.toLocaleTimeString()}\n`
    );
  }

  _duration = new FormControl(0);
  async openBet(duration: any) {
    alert(duration);
    const currentBlock = await this.provider.getBlock('latest');
    const tx = await this.contract.openBets(
      currentBlock.timestamp + Number(duration)
    );
    const receipt = await tx.wait();
    console.log(`Bets opened (${receipt.transactionHash})`);
    const openBets = await this.contract.openBets(duration);
    console.log(`openBets\n`);
    console.log(openBets);
  }

  async displayBalance() {
    const balanceBN = await this.provider.getBalance(this.walletId);
    const balance = ethers.utils.formatEther(balanceBN);
    alert(`The account of address ${this.walletId} has ${balance} ETH\n`);
  }

  async displayTokenBalance() {
    const balanceBN = await this.token.balanceOf(this.walletId);
    const balance = ethers.utils.formatEther(balanceBN);
    alert(`The account of address ${this.walletId} has ${balance} Tokens\n`);
  }

  // this one doesn't work yet
  _betAmount = new FormControl(0);
  async bet(amount: any) {
    const allowTx = await this.token
      .connect(this.walletId)
      .approve(this.contract.address, ethers.constants.MaxUint256);
    await allowTx.wait();
    const tx = await this.contract.connect(this.walletId).betMany(amount);
    const receipt = await tx.wait();
    alert(`Bets placed (${receipt.transactionHash})\n`);
  }

  // connect missing on all the ones below this:

  async closeLottery() {
    const tx = await this.contract.closeLottery();
    const receipt = await tx.wait();
    alert(`Bets closed (${receipt.transactionHash})\n`);
  }

  async displayPrize(index: string): Promise<string> {
    const prizeBN = await this.contract.prize(this.walletId);
    const prize = ethers.utils.formatEther(prizeBN);
    alert(
      `The account of address ${this.walletId} 
      has earned a prize of ${prize} Tokens\n`
    );
    return prize;
  }

  async claimPrize(index: string, amount: string) {
    const tx = await this.contract
      .connect(this.walletId)
      .prizeWithdraw(ethers.utils.parseEther(amount));
    const receipt = await tx.wait();
    console.log(`Prize claimed (${receipt.transactionHash})\n`);
  }

  async displayOwnerPool() {
    const balanceBN = await this.contract.ownerPool();
    const balance = ethers.utils.formatEther(balanceBN);
    console.log(`The owner pool has (${balance}) Tokens \n`);
  }

  async withdrawTokens(amount: any) {
    const tx = await this.contract.ownerWithdraw(
      ethers.utils.parseEther(amount)
    );
    const receipt = await tx.wait();
    console.log(`Withdraw confirmed (${receipt.transactionHash})\n`);
  }

  async burnTokens(amount: any) {
    const allowTx = await this.token
      .connect(this.walletId)
      .approve(this.contract.address, ethers.constants.MaxUint256);
    const receiptAllow = await allowTx.wait();
    console.log(`Allowance confirmed (${receiptAllow.transactionHash})\n`);
    const tx = await this.contract
      .connect(this.walletId)
      .returnTokens(ethers.utils.parseEther(amount));
    const receipt = await tx.wait();
    console.log(`Burn confirmed (${receipt.transactionHash})\n`);
  }
}
