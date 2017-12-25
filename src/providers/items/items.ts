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
        this.api.get('items').subscribe((resp) => {
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
                console.log("Get all items bad request")
            }
        }, (err) => {
            console.log("Provider: error");
        });
    }

    changeSelectedItems(items: Item[]) {
        this.selectedItemsSource.next(items);
    }

    changeAllItems(items: Item[]) {
        this.allItemsSource.next(items);
    }

    public findItemById(item) {
        return item.id === this[0];
    }
    
}
