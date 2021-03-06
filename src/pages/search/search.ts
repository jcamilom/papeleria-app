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
    
    private allItems: Item[];
    private queryItems: Item[];
    private selectedItems: Item[];

    private searchQuery: string = '';

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
            // Filter the query items (First time the '' show all the items)
            this.filterItems();
        });
        this.itemsProvider.currentSelectedItems.subscribe(items => {
            this.selectedItems = items
            this.updateQueryItems();
        });
        
        // Get allItems for provider
        this.itemsProvider.getAllItems();
    }

    /**
     * Perform a service for the proper items.
     */
    // P template
    public filterItems(ev?: any) {
        // If not true, recover last query (called from ionViewWillEnter)
        if(ev) this.searchQuery = ev.target.value;

        let parsedValue = parseInt(this.searchQuery);
        
        // When the query is empty, restore the list of items.
        if (!this.searchQuery || !this.searchQuery.trim()) {
            this.queryItems = this.allItems;
            return;
        }
        // If not, check if it's an ID.
        else if(!isNaN(parsedValue)) {
            console.log("It's a number");
            let index = this.allItems.findIndex(this.itemsProvider.findItemById, [parsedValue]);
            // "If" not necessary, but still... index could be -1.
            console.log("Index: " + index);
            if(index > -1) {
                this.queryItems = [this.allItems[index]];
                return;
            }            
        }
        // If not, query the items.
        this.queryItems = this.query({name: this.searchQuery});
    }

    /**
     * Navigate to the detail page for this item.
     */
    openItem(item: Item) {
        this.navCtrl.push('ItemDetailPage', {
            item: item
        });
    }

    // For performance(?), the query is made on items already obtained, not on the database.
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

    public removeItem(item: Item, itemsArr: Item[]) {
        itemsArr.splice(this.selectedItems.indexOf(item), 1);
    }

    private deselectItem(itemId: number) {
        let index = this.queryItems.findIndex(this.itemsProvider.findItemById, [itemId]);
        // "If" not necessary, but still... index could be -1.
        if(index > -1) this.queryItems[index].selected = false;
    }

    /**
     * When an item is removed from the shoping cart, the selectedItems are updated globally,
     * but the queryItems doesnt (selected icon still appears).
     */
    private updateQueryItems() {
        for(let queryItem of this.queryItems) {
            let index = this.selectedItems.findIndex(this.itemsProvider.findItemById, [queryItem.id]);
            if (index < 0) this.deselectItem(queryItem.id);
        }
    }

}
