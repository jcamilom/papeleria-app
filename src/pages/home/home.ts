import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';

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
        private toastCtrl: ToastController,
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
        let alertConfirm = this.doConfirmAlert();
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
            // Ask if debor checkbox
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
                    this.presentToast('Venta registrada exitosamente');
                } else {
                    // Notify the user that the sale couldn't be added
                    this.presentToast('Error: la venta no pudo ser registrada');
                }
            }, (err) => { throw(err); });
        }
    }

    private doConfirmAlert() {
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

    private presentToast(msg: string, dur: number = 3000, pos: string = 'bottom') {
        let toast = this.toastCtrl.create({
            message: msg,
            duration: dur,
            position: pos,
            closeButtonText: "cerrar",
            showCloseButton: true,
            cssClass: "custom-toast"
        });
    
        toast.onDidDismiss(() => {
            console.log('Dismissed toast');
        });
    
        toast.present();
    }
    

}