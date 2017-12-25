import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Sale } from '../../models/sale';
import { SalesProvider } from '../../providers/providers';

@IonicPage()
@Component({
    selector: 'page-sales-historic',
    templateUrl: 'sales-historic.html',
})
export class SalesHistoricPage {

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
