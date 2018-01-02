import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomeMainPage } from './home-main';
import { TooltipsModule } from 'ionic-tooltips';

@NgModule({
    declarations: [
        HomeMainPage,
    ],
    imports: [
        IonicPageModule.forChild(HomeMainPage),
        TooltipsModule
    ],
    exports: [
        HomeMainPage
    ]
})
export class HomeMainPageModule { }
