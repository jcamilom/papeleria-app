import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-debts-detail',
    templateUrl: 'debts-detail.html',
})
export class DebtsDetailPage {

    debtor: any = null;
    debts: any = null;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
        this.debtor = navParams.data.debtor;
        this.debts = navParams.data.debts;
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad DebtsDetailPage');
    }

}
