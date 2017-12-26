import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { ItemsProvider } from '../../providers/providers';
import { Item } from '../../models/item';
import { SalesProvider } from '../../providers/providers';
import { Sale } from '../../models/sale';

@IonicPage()
@Component({
    selector: 'page-home',
    templateUrl: 'home.html',
})
export class HomePage {

    private selectedItems: Item[] = [];
    private sale: Sale = new Sale({value: 0, paid: false, paidValue: 0});

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public alertCtrl: AlertController,
        private itemsProvider: ItemsProvider,
        private salesProvider: SalesProvider) {            
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

    public subtractItem(item: Item) {
        if(item.nSelected > 1) {
            item.nSelected--;
            this.findSaleValue();
        } else {
            // Ask before remove
            this.pressEvent(item);
        }
    }

    private pressEvent(item: Item) {
        let alertConfirm = this.doConfirm();
        alertConfirm.present();
        alertConfirm.onDidDismiss((resp) => {
            if(resp === true) {
                this.removeItem(item);
                this.itemsProvider.changeSelectedItems(this.selectedItems);
            }
        });
    }

    public removeItem(item: Item) {
        this.selectedItems.splice(this.selectedItems.indexOf(item), 1);
    }

    public generateSale() {
        if(this.sale.value > 0) {
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
                } else {
                    console.log("Error while creating the sale");
                }
            }, (err) => { throw(err); });
        }
    }

    private doConfirm() {
        let alertConfirm = this.alertCtrl.create({
            title: 'Remover ítem',
            message: '¿Remover ítem del carrito de ventas?',
            buttons: [
                {
                    text: 'Cancelar',
                    handler: () => {
                        alertConfirm.dismiss(false);
                        return false;
                    }
                },
                {
                    text: 'Aceptar',
                    handler: () => {
                        alertConfirm.dismiss(true);
                        return false;
                    }
                }
            ]
        });
        
        return alertConfirm;
    }

}