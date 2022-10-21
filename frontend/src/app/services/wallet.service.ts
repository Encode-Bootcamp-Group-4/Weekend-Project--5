import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  public ethereum;
  constructor() {
    this.ethereum = (window as any).ethereum;
  }

  public connectWallet = async () => {
    try {
      if (!this.ethereum) return alert('Please install Metamask');
      const accounts = await this.ethereum.request({
        method: 'eth_requestAccounts',
      });
      return accounts[0];
    } catch (e) {
      throw new Error('Error connecting to Metamask');
    }
  };

  public checkWalletConnected = async () => {
    try {
      if (!this.ethereum) return alert('Please install Metamask');
      const accounts = await this.ethereum.request({ method: 'eth_accounts' });
      return accounts;
    } catch (e) {
      throw new Error('Error getting accounts from Metamask');
    }
  };
}
