import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { DebtsProvider } from '../../providers/providers';
import { Debt } from '../../models/debt';
/* import { MessagesProvider } from '../../providers/providers'; */

@IonicPage()
@Component({
    selector: 'page-debts',
    templateUrl: 'debts.html',
})
export class DebtsPage {

    private allDebts: Debt[];

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private debtsProvider: DebtsProvider) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad DebtsPage');
        this.debtsProvider.currentDebts.subscribe(debts => {
            // Sort by name before setting the data
            //debts.sort(this.debtsProvider.sortByName);
            this.allDebts = debts;
            // Initialize / Update the query debts when global debts where updated
            //this.queryItems = this.allItems;
            // Filter the query debts (First time the '' show all the debts)
            //this.filterItems();
        });

        // Initialize the updatedItems array
        this.debtsProvider.getDebts();
    }

}
