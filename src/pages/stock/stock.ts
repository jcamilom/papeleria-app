import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { ItemsProvider } from '../../providers/providers';
import { Item } from '../../models/item';

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
        private alertCtrl: AlertController,
        private itemsProvider: ItemsProvider) {
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
        this.showPrompt();
    }

    showPrompt() {
        let prompt = this.alertCtrl.create({
            title: 'Crear un ítem',
            //message: "Ingresar las siguientes características:",
            inputs: [
                {
                    name: 'name',
                    placeholder: 'Nombre',
                    type: 'text'
                },
                {
                    name: 'price',
                    placeholder: 'Precio',
                    type: 'number',
                    min: 0
                },
                {
                    name: 'nAvailable',
                    placeholder: 'Cantidad:',
                    type: 'number',
                    min: 0
                }
            ],
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel'
                },
                {
                    text: 'Crear',
                    handler: this.createItemHander()
                }
            ]
        });
        prompt.present();
    }

    createItemHander() {
        return data => {
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
                                //this.presentToast('Venta registrada exitosamente');
                                console.log("Item added successfully");
                            } else {
                                // Notify the user that the sale couldn't be added
                                //this.presentToast('Error: la venta no pudo ser registrada');
                                console.log("Item couldnt be added");
                            }
                        }, (err) => { 
                            // Toast "No se pudo crear el item, es posible que ya exista en la base de datos"
                            console.error("No se pudo crear el item, es posible que ya exista en la base de datos");
                            throw(err);
                        });
                    } else {
                        // Toast "values must be positive"
                        console.log("Invalid numbers(-)");
                    }
                } else {
                    // Toast "not valid" number
                    console.log("Invalid numbers");
                }
            } else {
                // Toast "not valid" name
                console.log("Invalid name");
            }
        }
    }

}
