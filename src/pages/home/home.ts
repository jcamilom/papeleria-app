import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ItemsProvider } from '../../providers/providers';

@IonicPage()
@Component({
    selector: 'page-home',
    templateUrl: 'home.html',
})
export class HomePage {

    message: string;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private itemsProvider: ItemsProvider) {            
    }

    ionViewDidLoad() {
        this.itemsProvider.currentMessage.subscribe(message => this.message = message)
    }

}