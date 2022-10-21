import { Component, OnInit } from '@angular/core';
import { ethers } from 'ethers';
import { WalletService } from '../services/wallet.service';

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

}
