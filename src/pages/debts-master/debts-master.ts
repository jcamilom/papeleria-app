import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Debt } from '../../models/debt';
import { DebtsProvider } from '../../providers/providers';
import { DebtsDetail } from '../../pages/pages';


@IonicPage()
@Component({
    selector: 'page-debts-master',
    templateUrl: 'debts-master.html',
})
export class DebtsMasterPage {

    detailNavCtrl: any;

    private allDebts: Debt[];
    private debtors;
    private debts: Debt[];

    

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private debtsProvider: DebtsProvider) {
        this.detailNavCtrl = this.navParams.get('detailNavCtrl');
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad DebtsMasterPage');
        //this.detailNavCtrl.setRoot(DebtsDetail);

        this.debtors = [];

        this.debtsProvider.currentDebts.subscribe(debts => {
            // Sort by name before setting the data
            //debts.sort(this.debtsProvider.sortByName);
            this.allDebts = debts;
            // Initialize / Update the query debts when global debts where updated
            //this.queryItems = this.allItems;
            // Filter the query debts (First time the '' show all the debts)
            //this.filterItems();
            this.generateDebtors();
        });

        // Initialize the updatedItems array
        this.debtsProvider.getDebts();
    }

    ionViewWillEnter() {
        console.log('ionViewWillEnter DebtsMasterPage');
        if(this.debtsProvider.getUpdateAvailable()) {
            console.log('UpdateAvailable from DebtsPage!');
            this.debtsProvider.getDebts();
        }
    }

    private generateDebtors() {
        for(let debt of this.allDebts) {
            // If the debtor doesn't exist, push it
            if(!this.debtors.includes(debt.debtor)) {
                this.debtors.push(debt.debtor);
            }
        }
        // Sort debtors by name
        this.debtors.sort();
    }

    private generateDebts() {

    }

    onDebtorSelected(debtor) {
        this.detailNavCtrl.setRoot(DebtsDetail, {debtor: debtor, value: 100});
    }

}
