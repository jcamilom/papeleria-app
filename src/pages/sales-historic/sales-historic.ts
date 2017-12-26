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

    displayedColumns = ['id', 'createdAt', 'value', 'paid', 'paidValue', 'updatedAt', 'debtor'];
    dataSource = new MatTableDataSource<SaleElement>(SALE_DATA);

    private sales: Sale[];

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private salesProvider: SalesProvider) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad SalesHistoricPage');

        this.salesProvider.currentSales.subscribe(sales => {
            this.sales = sales;
        });

        // Get all sales for provider
        this.salesProvider.getSales();
    }

}

export interface SaleElement {
        id: number;
        createdAt: string;
        updatedAt: string;
        value: number;
        paid: boolean;
        paidValue: number;
        debtor: string;
    }
  
  const SALE_DATA: SaleElement[] = [
    {id: 1, createdAt: '2017-12-26T02:31:22.281Z', updatedAt: null, value: 15000, paid: true, paidValue: 15000, debtor: ' '},
    {id: 2, createdAt: '2017-12-26T02:31:22.335Z', updatedAt: null, value: 8000, paid: false, paidValue: 1500, debtor: 'Federico'},
    {id: 3, createdAt: '2017-12-26T02:31:22.379Z', updatedAt: '2017-12-26T02:35:22.379Z', value: 12000, paid: true, paidValue: 12000, debtor: 'Andres'},
  ];
