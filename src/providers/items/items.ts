import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Api } from '../api/api';

import { Item } from '../../models/item';
import { Observable } from 'rxjs/Observable';

export interface ItemsResponse {
    status: string;
    data?: any[];
}

@Injectable()
export class ItemsProvider {

    private itemsEndpoint: string = 'items';

    private allItemsSource: BehaviorSubject<Item[]>;
    public currentAllItems: Observable<Item[]>;
    //private allItems: Item[] = [];

    private selectedItemsSource: BehaviorSubject<Item[]>;
    public currentSelectedItems: Observable<Item[]>;
    private selectedItems: Item[];    
    
    constructor(private api: Api) {
        this.allItemsSource = new BehaviorSubject<Item[]>([]);
        this.currentAllItems = this.allItemsSource.asObservable();
        //this.currentAllItems.subscribe(items => this.allItems = items);

        this.selectedItemsSource = new BehaviorSubject<Item[]>([]);
        //this.selectedItemsSource = new BehaviorSubject<Item[]>([{id: 1, name: "Lapiz", nAvailable: 10, price: 100 }]);
        this.currentSelectedItems = this.selectedItemsSource.asObservable();
        this.currentSelectedItems.subscribe(items => this.selectedItems = items);
    }

    /**
     * Send a GET request to our items endpoint. After that, the BehaviorSubject
     * broadcasts the received data.
     */
    public getAllItems() {
        this.api.get(this.itemsEndpoint).subscribe((resp) => {
            let allItems: Item[] = [];
            if(resp.status == 'success') {
                let items = resp.data;
                for(let item of items) {
                    //console.log(JSON.stringify(item));
                    let index = this.selectedItems.findIndex(this.findItemById, [item.id]);
                    if(index >= 0) {
                        item.selected = true;
                        item.nSelected = this.selectedItems[index].nSelected;
                    } else {
                        item.selected = false;
                    }
                    allItems.push(new Item(item));
                }
                //this.allItems = allItems;
                this.changeAllItems(allItems);
            } else {
                console.log("Get all items bad request");
            }
        // Should generate a toast saying that there is an error with the db connection
        }, (err) => {
            console.error("From itemsProvider: error connecting to the database:");
            throw(err);
        });
    }

    changeSelectedItems(items: Item[]) {
        this.selectedItemsSource.next(items);
    }

    changeAllItems(items: Item[]) {
        this.allItemsSource.next(items);
    }

    public addItem(item: Item) {
        return this.api.post(this.itemsEndpoint, item);
    }

    public updateItem(item) {
        return this.api.put(this.itemsEndpoint + "/" + item.id, item.body);
    }

    public findItemById(item) {
        return item.id === this[0];
    }

    public sortByName(a, b) {
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
