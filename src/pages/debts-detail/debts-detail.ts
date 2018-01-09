import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Debt } from '../../models/debt';
import { DebtsProvider } from '../../providers/providers';

@IonicPage()
@Component({
    selector: 'page-debts-detail',
    templateUrl: 'debts-detail.html',
})
export class DebtsDetailPage {

    debtor: string;
    debts: Debt[];
    sumValues: number;
    sumPaidValues: number;
    debt: number;
    lastPaymentDate: Date;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private debtsProvider: DebtsProvider) {

        this.debtor = navParams.data.debtor;
        this.debts = navParams.data.debts;
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad DebtsDetailPage');
        this.generateSums();
    }

    ionViewWillEnter() {
        console.log('ionViewWillEnter DebtsDetailPage');
    }

    private generateSums() {
        this.sumValues = 0;
        this.sumPaidValues = 0;
        for(let debt of this.debts) {
            this.sumValues += debt.value;
            this.sumPaidValues += debt.paidValue;
        }
        this.debt = this.sumValues - this.sumPaidValues;
    }

}   
