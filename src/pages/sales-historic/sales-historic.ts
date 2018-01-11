import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Sale } from '../../models/sale';
import { SalesProvider } from '../../providers/providers';
import { MessagesProvider } from '../../providers/providers';

import { MatTableDataSource } from '@angular/material';

const removeSaleTitle: string = 'Eliminar venta';
const removeSaleMessage: string = '¿Está seguro que desea eliminar la venta? Esta acción no se puede deshacer.';
const removeAttachedSaleMessage: string = `La venta que desea eliminar está ligada a una deuda. 
    Elimine primero dicha deuda para poder eliminar la venta.`;

@IonicPage()
@Component({
    selector: 'page-sales-historic',
    templateUrl: 'sales-historic.html',
})
export class SalesHistoricPage {

    public displayedColumns = ['id', 'createdAt', 'value', 'paid', 'paidValue', 'updatedAt', 'debtor'];
    private dataSource: MatTableDataSource<any>;
    private saleToRemove: Sale;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private salesProvider: SalesProvider,
        private msgProvider: MessagesProvider) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad SalesHistoricPage');

        this.dataSource = new MatTableDataSource<Sale[]>();

        this.salesProvider.currentSales.subscribe(sales => {
            sales.sort(this.salesProvider.sortByCreatedAtDesc);
            this.dataSource.data = sales;
        });

        // Get all sales for provider
        this.salesProvider.getSales();
    }

    ionViewWillEnter() {
        console.log('SalesHistoricPage ionViewWillEnter');
        if(this.salesProvider.getUpdateAvailable()) {
            console.log('UpdateAvailable from SalesHistoricPage!');
            this.salesProvider.getSales();
        }
    }

    ionViewWillLeave() {
        console.log('SalesHistoricPage ionViewWillEnter');
        if(this.salesProvider.getUpdateAvailable()) {
            console.log('UpdateAvailable from SalesHistoricPage!');
            this.salesProvider.getSales();
        }
    }

    removeSaleEvent(sale: Sale) {
        // Allow removement only for sales not attached to a debt
        if(sale.debtor == null) {
            // Tag the sale to remove
            this.saleToRemove = sale;
            // Show confirmation alert
            this.msgProvider.showConfirmAlert(this.removeSaleHandler, removeSaleTitle, removeSaleMessage);
        } else {
            this.msgProvider.presentToast(removeAttachedSaleMessage, true);
        }
    }

    public removeSaleHandler = () => {
        this.removeSale(this.saleToRemove);
    }

    public removeSale(sale: Sale) {
        this.salesProvider.deleteSale(sale).subscribe((resp) => {
            if(resp.status == 'success') {
                console.log(resp.data[0].id + " deleted!");
                // Notify the user that the sale was successfully deleted
                this.msgProvider.presentToast('Venta eliminada exitosamente.');
                this.saleToRemove = null;
                // Update this page
                this.salesProvider.getSales();
            } else {
                console.log("The sale couldnt be deleted");
            }
        }, (err) => {
            console.log("The sale couldnt be deleted");
            throw(err);
        });
    }

}
