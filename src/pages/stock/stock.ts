import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ItemsProvider } from '../../providers/providers';
import { Item } from '../../models/item';
import { MessagesProvider } from '../../providers/providers';

@IonicPage()
@Component({
    selector: 'page-stock',
    templateUrl: 'stock.html',
})
export class StockPage {

    private allItems: Item[];
    private customIncreaseValue: any = 0;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private itemsProvider: ItemsProvider,
        private msgProvider: MessagesProvider) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad StockPage');
        this.itemsProvider.currentAllItems.subscribe(items => {
            // Sort by name before setting the data
            items.sort(this.itemsProvider.sortByName);
            this.allItems = items;
        });
    }

    public increaseItem(item: Item) {
        item.nAvailable++;
    }

    public decreaseItem(item: Item) {
        if(item.nAvailable > 0) item.nAvailable--;
    }

    public increaseItemCustomValue(item: Item) {
        let parsedValue = parseInt(this.customIncreaseValue);
        // Check if it's a valid value
        if(!isNaN(parsedValue)) {
            let newValue = item.nAvailable + parsedValue;
            if(newValue > 0)  item.nAvailable = newValue;
        }
    }

    public setItemCustomValue(item: Item) {
        let parsedValue = parseInt(this.customIncreaseValue);
        // Check if it's a valid value
        if(!isNaN(parsedValue)) {
            item.nAvailable = parsedValue;
        }
    }
    
    private createItem() {
        this.msgProvider.showCreateItemPrompt(this.createItemHander);
    }

    public createItemHander = (data: any) : void => {
        let trimedName: string = data.name.trim();
        // Check if the name is not an empty string
        if(trimedName != '') {
            let parsedPrice: number = parseInt(data.price);
            let parsedNAvailable: number = parseInt(data.nAvailable);
            // Check if they are valid values
            if(!isNaN(parsedPrice) && !isNaN(parsedNAvailable)) {
                // Chek if they are positive values
                if(parsedPrice >= 0 && parsedNAvailable >= 0) {
                    let item: Item = {name: trimedName, price: parsedPrice, nAvailable: parsedNAvailable};
                    // Post the new item
                    this.itemsProvider.AddItem(item).subscribe((resp) => {
                        if(resp.status == 'success') {
                            // Update allItems (for this page and global)
                            this.itemsProvider.getAllItems();
                            // Notify the user that the item was successfully added
                            this.msgProvider.presentToast('Ítem añadido exitosamente.');
                        } else {
                            // Notify the user that the sale couldn't be added
                            this.msgProvider.presentToast('El ítem no pudo ser añadido.', true);
                        }
                    }, (err) => { 
                        // Error. It's possible that item already exists
                        this.msgProvider.presentToast(
                            "No se pudo crear el ítem. Es posible que este ítem " +
                                "ya exista en la base de datos.", true);
                        throw(err);
                    });
                } else {
                    // Negative values
                    this.msgProvider.presentToast(
                        "No se pudo crear el ítem. Los valores numéricos deben ser positivos.", true);
                }
            } else {
                // Not valid number
                this.msgProvider.presentToast(
                    "No se pudo crear el ítem. Los valores numéricos ingresados no son válidos.", true);
            }
        } else {
            // Not valid name
            this.msgProvider.presentToast('El ítem no pudo ser añadido. Nombre no válido.', true);
        }        
    }

}
