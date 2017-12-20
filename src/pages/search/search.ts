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
    
    allItems: Item[] = [];
    queryItems: Item[] = [];
    selectedItems: Item[] = [];

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public toastCtrl: ToastController,
        public itemsProvider: ItemsProvider) {        
    }

    ionViewDidLoad() {
        this.initializeItems();
        this.itemsProvider.currentSelectedItems.subscribe(items => this.selectedItems = items)
    }

    // Attempt to get all the items.
    initializeItems() {
        this.itemsProvider.getAllItems().subscribe((resp) => {
            this.allItems = resp;
            this.queryItems = this.allItems;
        }, (err) => {
            console.log("Component: error");
        });
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
            this.selectedItems.push(item);
        } else {
            this.selectedItems.splice(this.selectedItems.indexOf(item), 1);
        }
        this.itemsProvider.changeSelectedItems(this.selectedItems);
    }

}
