import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

import { Item } from '../../models/item';
import { ItemsProvider } from '../../providers/items/items';

export interface ItemsResponse {
    status: string;
    data?: any[];
}

@IonicPage()
@Component({
    selector: 'page-search',
    templateUrl: 'search.html'
})
export class SearchPage {
    
    allItems: Item[] = [];
    queryItems: Item[] = [];

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public toastCtrl: ToastController,
        public itemsProvider: ItemsProvider) {        
    }

    ionViewDidLoad() {
        this.initializeItems();
    }

    // Attempt to get all the items.
    initializeItems() {
        this.itemsProvider.getAllItems().subscribe((resp) => {
            if(resp.status == 'success') {
                let items = resp.data;
                //console.log(resp);
                for (let item of items) {
                    item.selected = false;
                    this.allItems.push(new Item(item));
                }
                // Populate the all items in the search result.
                this.queryItems = this.allItems;
            } else {
                console.log("Get all items bad request.");
            }            
        }, (err) => {            
            // Unable to get all the items
            let toast = this.toastCtrl.create({
                message: 'error getting all the items',
                duration: 3000,
                position: 'top'
            });
            toast.present();
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

}
