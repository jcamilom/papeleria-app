import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DebtsMasterPage } from './debts-master';

@NgModule({
  declarations: [
    DebtsMasterPage,
  ],
  imports: [
    IonicPageModule.forChild(DebtsMasterPage),
  ],
  exports: [
    DebtsMasterPage
  ]
})
export class DebtsMasterPageModule {}
