import { Component, OnInit } from '@angular/core';
import { ethers } from 'ethers';
import { WalletService } from '../services/wallet.service';
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
    console.log(`The lottery is ${state ? 'open' : 'closed'}\n`);
    if (!state) return;
    this.provider
      .getBlock('latest')
      .then((currentBlock: any) => {
        const currentBlockDate = new Date(currentBlock.timestamp * 1000);
        console.log(
          `The last block was mined at ${currentBlockDate.toLocaleDateString()} : ${currentBlockDate.toLocaleTimeString()}\n`
        );
      })
      .catch((error: any) => {
        console.log('error\n');
        alert({ error });
      });
    const closingTime = await this.contract.betsClosingTime();
    const closingTimeDate = new Date(closingTime.toNumber() * 1000);
    console.log(
      `lottery should close at  ${closingTimeDate.toLocaleDateString()} : ${closingTimeDate.toLocaleTimeString()}\n`
    );
  }

  async openBet(duration: number) {
    const openBets = await this.contract.openBets(duration);
    console.log(`openBets\n`);
    console.log(openBets);
  }

  async swap(number: string) {
    const swap = await this.contract.swap(number);
    console.log(`swap\n`);
    console.log(swap);
  }
}
