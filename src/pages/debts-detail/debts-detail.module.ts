import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DebtsDetailPage } from './debts-detail';

@NgModule({
  declarations: [
    DebtsDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(DebtsDetailPage),
  ],
  exports: [
    DebtsDetailPage
  ]
})
export class DebtsDetailPageModule {}
