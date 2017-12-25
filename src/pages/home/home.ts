import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

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
        public alertCtrl: AlertController,
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

    private increaseItem(item: Item) {
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

    private pressEvent(event, item: Item) {
        let alertConfirm = this.doConfirm();
        alertConfirm.present();
        alertConfirm.onDidDismiss((resp) => {
            if(resp === true) {
                this.removeItem(item);
                this.itemsProvider.changeSelectedItems(this.selectedItems);
            }
        });
    }

    private removeItem(item: Item) {
        this.selectedItems.splice(this.selectedItems.indexOf(item), 1);
    }

    private doConfirm() {
        let alertConfirm = this.alertCtrl.create({
          //title: 'Remover ítem',
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