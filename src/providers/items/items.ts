import { Injectable } from '@angular/core';
//import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs';

import { Api } from '../api/api';

import { Item } from '../../models/item';

export interface ItemsResponse {
    status: string;
    data?: any[];
}

@Injectable()
export class ItemsProvider {

    private activeItemResponse: ReplaySubject<any> = new ReplaySubject(1);
    
    constructor(private api: Api) { }

    /**
     * Send a GET request to our items endpoint.
     */
    public getAllItems() {
        this.api.get('items').subscribe((resp) => {
            let allItems: Item[] = [];
            if(resp.status == 'success') {
                let items = resp.data;                
                //console.log(resp);
                for (let item of items) {
                    item.selected = false;
                    allItems.push(new Item(item));
                }
            } else {
                console.log("Get all items bad request");
            }
            this.activeItemResponse.next(allItems);
        }, (err) => {
            console.log("Provider: error");
        });

        return this.activeItemResponse;    
            
            /* res => this.activeItemResponse.next(res));
        return this.activeItemResponse; */






        
        /* let seq = this.api.get('items');
        
        seq.subscribe((resp) => {
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
        }); */

   /*       seq.subscribe((res: any) => {
            // If the API returned a successful response, mark the user as logged in
            if(res.status == 'success') {
                //this._loggedIn(res);
                console.log("getAllItems success from ItemsProvider")
            } else {}
        }, err => {
            console.error('ERROR', err);
        });

        return seq; */
    }
    
}
