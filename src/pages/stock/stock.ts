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
    private customIncreaseValue: any = 0;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private itemsProvider: ItemsProvider) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad StockPage');
        this.itemsProvider.currentAllItems.subscribe(items => {
            // Sort by name before setting the data
            items.sort(this.itemsProvider.sortByName);
            this.allItems = items;
        });
    }

    public increaseItem(item: Item) {
        item.nAvailable++;
    }

    public decreaseItem(item: Item) {
        if(item.nAvailable > 0) item.nAvailable--;
    }

    public increaseItemCustomValue(item: Item) {
        let parsedValue = parseInt(this.customIncreaseValue);
        // Check if it's a valid value
        if(!isNaN(parsedValue)) {
            let newValue = item.nAvailable + parsedValue;
            if(newValue > 0)  item.nAvailable = newValue;
        }        
    }

    public setItemCustomValue(item: Item) {
        let parsedValue = parseInt(this.customIncreaseValue);
        // Check if it's a valid value
        if(!isNaN(parsedValue)) {
            item.nAvailable = parsedValue;
        }
    }    

}
