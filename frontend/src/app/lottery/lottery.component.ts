import { Component, OnInit } from '@angular/core';
import { ethers } from 'ethers';
import { WalletService } from '../services/wallet.service';

const LOTTERY_ADDRESS = '0x109565dFdA78De21A7E8459fb008B108f0d9A09b'; 
const LOTTERYTOKEN_ADDRESS = '0xFa0A807a048D56E5b2Bdd59b570dBe4834bf802e';
@Component({
  selector: 'app-lottery',
  templateUrl: './lottery.component.html',
  styleUrls: ['./lottery.component.scss']
})
export class LotteryComponent implements OnInit {
  walletId: string = '';
  provider: any;
  signer: any;
  public ethereum;

  constructor(private walletService: WalletService) { 
    this.ethereum = (window as any).ethereum;
    this.provider = new ethers.providers.Web3Provider(this.ethereum);
    this.signer = this.provider.getSigner();
  }

  ngOnInit(): void {
    this.walletService
    .checkWalletConnected()
    .then((accounts) => (this.walletId = accounts[0]));
  }

  async getLotteryState() {
    console.log('Getting lottery state...');
  }
}
