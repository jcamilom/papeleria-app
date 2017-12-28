import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomeMainPage } from './home-main';

@NgModule({
    declarations: [
        HomeMainPage,
    ],
    imports: [
        IonicPageModule.forChild(HomeMainPage),
    ],
    exports: [
        HomeMainPage
    ]
})
export class HomeMainPageModule { }
