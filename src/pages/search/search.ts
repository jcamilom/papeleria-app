import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

import { Item } from '../../models/item';
import { ItemsProvider } from '../../providers/providers';

@IonicPage()
@Component({
    selector: 'page-search',
    templateUrl: 'search.html'
})
export class SearchPage {
    
    allItems: Item[];
    queryItems: Item[];
    selectedItems: Item[];

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public toastCtrl: ToastController,
        public itemsProvider: ItemsProvider) {        
    }

    ionViewDidLoad() {
        // Subscribe for changes in allItems and selectedItems
        this.itemsProvider.currentAllItems.subscribe(items => {
            //for(let item of items) console.log(JSON.stringify(item));
            this.allItems = items;
            this.queryItems = this.allItems;
        });
        this.itemsProvider.currentSelectedItems.subscribe(items => this.selectedItems = items);
        
        // Get allItems for provider
        this.itemsProvider.getAllItems();        
    }

    /**
     * Perform a service for the proper items.
     */
    getItems(ev) {
        let val = ev.target.value;
        // When the query is empty, restore the list of items.
        if (!val || !val.trim()) {
            this.queryItems = this.allItems;
            return;
        }
        // If not, query the items.
        this.queryItems = this.query({name: val});
    }

    /**
     * Navigate to the detail page for this item.
     */
    openItem(item: Item) {
        this.navCtrl.push('ItemDetailPage', {
            item: item
        });
    }

    // For performance(?), the quey is made on items already obtained, not on the database.
    query(params?: any) {
        return this.allItems.filter((item) => {
            for (let key in params) {
                let field = item[key];
                if (typeof field == 'string' && field.toLowerCase().indexOf(params[key].toLowerCase()) >= 0) {
                    return item;
                } else if (field == params[key]) {
                    return item;
                }
            }
            return null;
        });
    }

    changeSelectedItems(item: Item){
        item.selected = !item.selected;
        if(item.selected) {
            item.nSelected = 1;
            this.selectedItems.push(item);
        } else {
            item.nSelected = 0;
            this.selectedItems.splice(this.selectedItems.indexOf(item), 1);
        }
        this.itemsProvider.changeSelectedItems(this.selectedItems);
    }

}
