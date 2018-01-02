import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TooltipsModule } from 'ionic-tooltips';

import { SearchPage } from './search';

@NgModule({
  declarations: [
    SearchPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchPage),
    TooltipsModule
  ],
  exports: [
    SearchPage
  ]
})
export class SearchPageModule { }
