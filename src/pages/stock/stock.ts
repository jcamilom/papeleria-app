import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ItemsProvider } from '../../providers/providers';
import { Item } from '../../models/item';

@IonicPage()
@Component({
    selector: 'page-stock',
    templateUrl: 'stock.html',
})
export class StockPage {

    private allItems: Item[];

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private itemsProvider: ItemsProvider) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad StockPage');
        this.itemsProvider.currentAllItems.subscribe(items => {
            // Sort by name before setting the data
            items.sort(this.sortByName);
            this.allItems = items;
        });
    }

    public increaseItem(item: Item) {
        item.nAvailable++;
    }

    public decreaseItem(item: Item) {
        item.nAvailable--;
    }

    private sortByName(a, b) {
        // Use toUpperCase() to ignore character casing
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
    
        let comparison = 0;
        if(nameA > nameB) {
            comparison = 1;
        } else if(nameA < nameB) {
            comparison = -1;
        }
        return comparison;
    }
    

}
