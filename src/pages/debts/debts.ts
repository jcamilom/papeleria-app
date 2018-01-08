import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { DebtsProvider } from '../../providers/providers';
import { Debt } from '../../models/debt';
import { DebtsMain } from '../../pages/pages';
/* import { MessagesProvider } from '../../providers/providers'; */

@IonicPage()
@Component({
    selector: 'page-debts',
    templateUrl: 'debts.html',
})
export class DebtsPage {
    debtsMain:any = DebtsMain;

    private allDebts: Debt[];
    private debtors;
    private debts: Debt[];

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private debtsProvider: DebtsProvider) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad DebtsPage');

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
        console.log('ionViewWillEnter DebtsPage');
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

}
