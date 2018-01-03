import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DebtsPage } from './debts';

@NgModule({
  declarations: [
    DebtsPage,
  ],
  imports: [
    IonicPageModule.forChild(DebtsPage),
  ],
  exports: [
    DebtsPage
]
})
export class DebtsPageModule {}
