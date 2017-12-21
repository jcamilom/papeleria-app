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
            this.total += (item.price * item.nSelected);
        }
    }

    private addItem(item: Item) {
        if(item.nAvailable > item.nSelected) {
            item.nSelected++;
            this.findTotal();
        } else {
            // Use a toast
            console.log("No hay más items '" + item.name + "' en el inventario");
        }
    }

    private subtractItem(item) {
        if(item.nSelected > 1) {
            item.nSelected--;
            this.findTotal();
        } else {
            // Use a toast
            console.log("No es posible retirar el item de esta lista(por ahora)");
        }
    }

}