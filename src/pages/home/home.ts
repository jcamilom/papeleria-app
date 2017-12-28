import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { HomeSide, HomeMain } from '../pages';

@IonicPage()
@Component({
    selector: 'page-home',
    templateUrl: 'home.html',
})
export class HomePage {
    homeSide = HomeSide;
    homeMain = HomeMain;

    constructor(public navCtrl: NavController,
        public navParams: NavParams) {            
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad HomePage');
    }

}
