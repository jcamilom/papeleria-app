import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Sale } from '../../models/sale';
import { SalesProvider } from '../../providers/providers';

import { MatTableDataSource } from '@angular/material';

@IonicPage()
@Component({
    selector: 'page-sales-historic',
    templateUrl: 'sales-historic.html',
})
export class SalesHistoricPage {

    public displayedColumns = ['id', 'createdAt', 'value', 'paid', 'paidValue', 'updatedAt', 'debtor'];
    private dataSource: MatTableDataSource<any>;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private salesProvider: SalesProvider) {
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
        console.log('ionViewWillEnter SalesHistoricPage');
        if(this.salesProvider.getUpdateAvailable()) {
            console.log('UpdateAvailable from SalesHistoricPage!');
            this.salesProvider.getSales();
        }
    }

}
