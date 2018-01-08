import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ItemsProvider } from '../../providers/providers';
import { Item } from '../../models/item';
import { SalesProvider } from '../../providers/providers';
import { Sale } from '../../models/sale';
import { DebtsProvider } from '../../providers/providers';
import { Debt } from '../../models/debt';
import { MessagesProvider } from '../../providers/providers';

const removeItemTitle: string = 'Remover ítem';
const removeItemMessage: string = '¿Remover ítem del carrito de ventas?';

@IonicPage()
@Component({
    selector: 'page-home-main',
    templateUrl: 'home-main.html',
})
export class HomeMainPage {

    private selectedItems: Item[] = [];
    private itemToRemove: Item;
    private sale: Sale = new Sale({value: 0, paid: false, paidValue: 0});
    private count: number;
    private nItemsToSale: number;
    private credit: boolean = false;
    private debtorName: string = '';
    private paidValue: number = 0;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private itemsProvider: ItemsProvider,
        private salesProvider: SalesProvider,
        private debtsProvider: DebtsProvider,
        private msgProvider: MessagesProvider) {
    }

    ionViewDidLoad() {
        //console.log('ionViewDidLoad HomeMainPage');

        // Variable to count the items that has been updated succesfully
        this.count = 0;
        this.nItemsToSale = 0;

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
            this.swipeEvent(item);
        }
    }

    private swipeEvent(item: Item) {
        // Tag the item to remove
        this.itemToRemove = item;
        // Show confirmation alert
        this.msgProvider.showConfirmAlert(this.removeItemHandler, removeItemTitle, removeItemMessage);
    }

    public removeItemHandler = () => {
        this.removeItem(this.itemToRemove);
        this.itemToRemove = null;
        this.itemsProvider.changeSelectedItems(this.selectedItems);
    }

    public removeItem(item: Item) {
        this.selectedItems.splice(this.selectedItems.indexOf(item), 1);
    }

    private toggleCredit() {
        
        console.log(this.credit);
    }

    public generateSale() {
        if(this.sale.value > 0) {
            // Ask if debtor checkbox
            let debtor = this.debtorName.trim();
            let genDebt = false;
            if(this.credit && debtor != '') {
                this.sale.debtor = debtor;
                this.sale.paid = (this.paidValue >= this.sale.value) ? true : false;
                // If abono is bigger than sale value...
                if(this.paidValue > this.sale.value) this.paidValue = this.sale.value;
                this.sale.paidValue = (this.paidValue >= 0) ? this.paidValue : 0;

                // Flag to generate a new debt
                genDebt = true;
            } else {
                this.sale.paidValue = this.sale.value;
                this.sale.paid = true;
            }
            
            // Restore the checkbox and inputs
            this.credit = false;
            this.debtorName = '';
            this.paidValue = 0;

            // Update the stock
            this.updateStock();
            // Add the sale to the database
            this.salesProvider.AddSale(this.sale).subscribe((resp) => {
                if(resp.status == 'success') {
                    // Generate the debt
                    if(genDebt) {
                        let debt = {
                            value: this.sale.value,
                            paid: this.sale.paid,
                            paidValue: this.sale.paidValue,
                            debtor: this.sale.debtor,
                            saleId: resp.data[0].id
                        };
                        this.debtsProvider.AddDebt(new Debt(debt)).subscribe((resp) => {
                            if(resp.status == 'success') {
                                // Set a flag in debtsProvider, so that first page that uses the global debts
                                // updates the global value before it opens
                                this.debtsProvider.setUpdateAvailable(true);
                                console.log("Debt successfully added");
                            } else {
                                console.log("Debt couldn't be added");
                            }
                        }, (err) => { throw(err); });
                    }

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

    /**
     * Used to update the items (nAvailable) in the DB before generating the sale
     */
    private updateStock() {
        // Generate the elements to send
        let itemsToSale: any[] = [];
        for(let itemToSale of this.selectedItems) {
            let obj = {nAvailable: itemToSale.nAvailable - itemToSale.nSelected};
            itemsToSale.push({id: itemToSale.id, body: obj});
        }
        this.nItemsToSale = itemsToSale.length;
        // Send the elements
        for(let itemToSale of itemsToSale) {
            this.itemsProvider.updateItem(itemToSale).subscribe((resp) => {
                if(resp.status == 'success') {
                    // Update allItems (for this page and global)
                    //this.itemsProvider.getAllItems();
                    // Notify the user that the item was successfully added
                    //this.msgProvider.presentToast('Ítem añadido exitosamente.');
                    console.log(resp.data[0].id + " sold!");
                    console.log(resp.data[0]);
                    this.count++;
                    if(this.count == this.nItemsToSale) {
                        this.count = 0;
                        console.log("All the sold items have been updated successfully");
                        // Update the items globally
                        this.itemsProvider.getAllItems();
                    }
                } else {
                    // Notify the user that the sale couldn't be added
                    //this.msgProvider.presentToast('El ítem no pudo ser añadido.', true);
                    console.log("The item couldnt be sold");
                }
            }, (err) => { 
                // Error. It's possible that item already exists
                /* this.msgProvider.presentToast(
                    `No se pudo crear el ítem. Es posible que este ítem
                        ya exista en la base de datos.`, true); */
                throw(err);
            });
        }
    }

}
