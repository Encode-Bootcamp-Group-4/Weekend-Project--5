import { NgModule } from '@angular/core';
import { WalletConnectComponent } from './wallet-connect/wallet-connect.component';
import { LotteryComponent } from './lottery/lottery.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: WalletConnectComponent },
  { path: 'wallet-connect', component: WalletConnectComponent },
  { path: 'lottery', component: LotteryComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }