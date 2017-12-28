import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ItemsProvider } from '../../providers/providers';
import { Item } from '../../models/item';
import { SalesProvider } from '../../providers/providers';
import { Sale } from '../../models/sale';
import { MessagesProvider } from '../../providers/providers';

@IonicPage()
@Component({
    selector: 'page-home',
    templateUrl: 'home.html',
})
export class HomePage {

    private selectedItems: Item[] = [];
    private itemToRemove: Item;
    private sale: Sale = new Sale({value: 0, paid: false, paidValue: 0});

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private itemsProvider: ItemsProvider,
        private salesProvider: SalesProvider,
        private msgProvider: MessagesProvider) {            
    }

    ionViewDidLoad() {
        this.itemsProvider.currentSelectedItems.subscribe(items => {
            this.selectedItems = items;
            this.findSaleValue();
        });
    }

    private findSaleValue() {
        this.sale.value = 0;
        for(let item of this.selectedItems) {
            this.sale.value += (item.price * item.nSelected);
        }
    }

    public increaseItem(item: Item) {
        if(item.nAvailable > item.nSelected) {
            item.nSelected++;
            this.findSaleValue();
        } else {
            // Use a toast
            console.log("No hay más items '" + item.name + "' en el inventario");
        }
    }

    public decreaseItem(item: Item) {
        if(item.nSelected > 1) {
            item.nSelected--;
            this.findSaleValue();
        } else {
            // Ask before remove
            this.pressEvent(item);
        }
    }

    private pressEvent(item: Item) {
        // Tag the item to remove
        this.itemToRemove = item;
        // Show confirmation alert
        this.msgProvider.showConfirmAlert(this.removeItemHandler);
    }

    public removeItemHandler = () => {
        this.removeItem(this.itemToRemove);
        this.itemToRemove = null;
        this.itemsProvider.changeSelectedItems(this.selectedItems);
    }

    public removeItem(item: Item) {
        this.selectedItems.splice(this.selectedItems.indexOf(item), 1);
    }

    public generateSale() {
        if(this.sale.value > 0) {
            // Ask if debtor checkbox
            if(true) {
                this.sale.paidValue = this.sale.value;
                this.sale.paid = true;
            }
            this.salesProvider.AddSale(this.sale).subscribe((resp) => {
                if(resp.status == 'success') {
                    // Clear the sale
                    this.sale.clearSale();
                    // Clear the selected Items
                    this.selectedItems = [];
                    // Update the selected items (for the search page)
                    this.itemsProvider.changeSelectedItems(this.selectedItems);
                    // Set a flag in salesProvider, so that first page that uses the global sales
                    // updates the global value before it opens
                    this.salesProvider.setUpdateAvailable(true);
                    // Notify the user that the sale was successfully added
                    this.msgProvider.presentToast('Venta registrada exitosamente.');
                } else {
                    // Notify the user that the sale couldn't be added
                    this.msgProvider.presentToast('Error: la venta no pudo ser registrada.', true);
                }
            }, (err) => { throw(err); });
        }
    }

}
