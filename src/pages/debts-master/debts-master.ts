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

    private detailNavCtrl: any;

    private nameCurrentSelected: string = null;
    private allDebts: Debt[];
    private debtors;


    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private debtsProvider: DebtsProvider) {
        this.detailNavCtrl = this.navParams.get('detailNavCtrl');
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad DebtsMasterPage');
        
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

        // Set the "placeholder"
        if(this.debtors.length > 0) {
            if(this.nameCurrentSelected == null) {
                this.onDebtorSelected(this.debtors[0]);
            } else {
                // This is needed when for example the selectedDebor gets a new debt
                // so the detailsPage needs to be reloaded
                this.onDebtorSelected(this.nameCurrentSelected);
            }
        }
    }

    onDebtorSelected(debtor) {
        this.nameCurrentSelected = debtor;
        let selectedDebts = this.allDebts.filter(debt => debt.debtor == debtor);
        // Sort the debts by creation time (desc)
        selectedDebts.sort(this.debtsProvider.sortByCreatedAtDesc);
        this.detailNavCtrl.setRoot(DebtsDetail, {debtor: debtor, debts: selectedDebts});
    }

}
