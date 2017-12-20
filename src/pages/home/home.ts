import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ItemsProvider } from '../../providers/providers';
import { Item } from '../../models/item';

@IonicPage()
@Component({
    selector: 'page-home',
    templateUrl: 'home.html',
})
export class HomePage {

    selectedItems: Item[] = [];
    private total: number = 0;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private itemsProvider: ItemsProvider) {            
    }

    ionViewDidLoad() {
        this.itemsProvider.currentSelectedItems.subscribe(items => {
            this.selectedItems = items;
            this.findTotal();
        });
    }

    private findTotal() {
        this.total = 0;
        for(let item of this.selectedItems) {
            this.total += item.price;
        }
    }

}