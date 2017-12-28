import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ItemsProvider } from '../../providers/providers';
import { Item } from '../../models/item';
import { MessagesProvider } from '../../providers/providers';

const removeItemTitle: string = 'Eliminar ítem';
const removeItemMessage: string = '¿Eliminar ítem del inventario? Esta acción no se puede deshacer.';

@IonicPage()
@Component({
    selector: 'page-stock',
    templateUrl: 'stock.html',
})
export class StockPage {

    private allItems: Item[];
    private customIncreaseValue: any = 0;
    private updatedItems: any;
    private itemToRemove: Item;

    private searchQuery: string = '';
    private queryItems: Item[];

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private itemsProvider: ItemsProvider,
        private msgProvider: MessagesProvider) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad StockPage');
        this.itemsProvider.currentAllItems.subscribe(items => {
            // Sort by name before setting the data
            //items.sort(this.itemsProvider.sortByName);
            this.allItems = items;
            // Initialize / Update the query items when global items where updated
            this.queryItems = this.allItems;
            // Filter the query items (First time the '' show all the items)
            this.filterItems();
        });

        // Initialize the updatedItems array
        this.updatedItems = [];
    }

    ionViewWillLeave() {
        console.log("Updating all items globally");
        this.itemsProvider.changeAllItems(this.allItems);

        // Update the modified items and clears the updatedItems array
        this.syncUpdatedItems();
    }

    public increaseItem(item: Item) {
        item.nAvailable++;
        // Push the item's modified value to the updatedItems array
        this.pushUpdatedItem(item, 'nAvailable');
    }

    public decreaseItem(item: Item) {
        if(item.nAvailable > 0) {
            item.nAvailable--;
            // Push the item's modified value to the updatedItems array
            this.pushUpdatedItem(item, 'nAvailable');
        }
    }

    public increaseItemCustomValue(item: Item) {
        let parsedValue = parseInt(this.customIncreaseValue);
        // Check if it's a valid value
        if(!isNaN(parsedValue)) {
            let newValue = item.nAvailable + parsedValue;
            if(newValue > 0)  item.nAvailable = newValue;
            // Push the item's modified value to the updatedItems array
            this.pushUpdatedItem(item, 'nAvailable');
        }
    }

    public setItemCustomValue(item: Item) {
        let parsedValue = parseInt(this.customIncreaseValue);
        // Check if it's a valid value
        if(!isNaN(parsedValue)) {
            item.nAvailable = parsedValue;
            // Push the item's modified value to the updatedItems array
            this.pushUpdatedItem(item, 'nAvailable');
        }
    }

    private pushUpdatedItem(item: Item, key: string) {
        // Look if the item already exist in the updatedItems array
        let index = this.updatedItems.findIndex(this.itemsProvider.findItemById, [item.id]);
        // The item already exists -> set new value
        if(index > -1) {
            this.updatedItems[index].body[key] = item[key];
        }
        // The item doesn't exists -> create it
        else {
            let obj = { };
            obj[key] = item[key];
            this.updatedItems.push({id: item.id, body: obj});
        }
        //console.log(this.updatedItems);
    }

    // P template
    public filterItems(ev?: any) {
        // If not true, recover last query (called from ionViewWillEnter)
        if(ev) this.searchQuery = ev.target.value;
        
        // When the query is empty, restore the list of items.
        if (!this.searchQuery || !this.searchQuery.trim()) {
            this.queryItems = this.allItems;
            return;
        }
        // If not, query the items.
        this.queryItems = this.query({name: this.searchQuery});
    }

    // For performance(?), the query is made on items already obtained, not on the database.
    query(params?: any) {
        return this.allItems.filter((item) => {
            for (let key in params) {
                let field = item[key];
                if (typeof field == 'string' && field.toLowerCase().indexOf(params[key].toLowerCase()) >= 0) {
                    return item;
                } else if (field == params[key]) {
                    return item;
                }
            }
            return null;
        });
    }

    // P template
    public removeItemEvent(item: Item) {
        // Tag the item to remove
        this.itemToRemove = item;
        // Show confirmation alert
        this.msgProvider.showConfirmAlert(this.removeItemHandler, removeItemTitle, removeItemMessage);
    }

    public removeItemHandler = () => {
        this.removeItem(this.itemToRemove);
    }

    public removeItem(item: Item) {
        this.itemsProvider.deleteItem(item).subscribe((resp) => {
            if(resp.status == 'success') {
                // Remove item from updatedItemsArray if present
                // Look if the item already exist in the updatedItems array
                let index = this.updatedItems.findIndex(this.itemsProvider.findItemById, [resp.data[0].id]);
                // The item already exists -> remove it
                if(index > -1) this.updatedItems.splice(index, 1);
                console.log(resp.data[0].id + " deleted!");
                this.itemToRemove = null;
                // Update the allItems globally
                this.itemsProvider.getAllItems();
            } else {
                console.log("The item couldnt be deleted")
            }
        }, (err) => {
            console.log("The item couldnt be deleted")
            throw(err);
        });
    }

    private syncUpdatedItems() {
        for(let item of this.updatedItems) {
            this.itemsProvider.updateItem(item).subscribe((resp) => {
                if(resp.status == 'success') {
                    // Update allItems (for this page and global)
                    //this.itemsProvider.getAllItems();
                    // Notify the user that the item was successfully added
                    //this.msgProvider.presentToast('Ítem añadido exitosamente.');
                    console.log(resp.data[0].id + " updated!");
                } else {
                    // Notify the user that the sale couldn't be added
                    //this.msgProvider.presentToast('El ítem no pudo ser añadido.', true);
                    console.log("The item couldnt be updated");
                }
            }, (err) => { 
                // Error. It's possible that item already exists
                /* this.msgProvider.presentToast(
                    `No se pudo crear el ítem. Es posible que este ítem
                        ya exista en la base de datos.`, true); */
                throw(err);
            });
        }
        // Clear the updatedItemsId array
        this.updatedItems = [];
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
                    this.itemsProvider.addItem(item).subscribe((resp) => {
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
                            `No se pudo crear el ítem. Es posible que este ítem
                                ya exista en la base de datos.`, true);
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
