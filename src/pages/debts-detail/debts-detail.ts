import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-debts-detail',
    templateUrl: 'debts-detail.html',
})
export class DebtsDetailPage {

    debtor: any = null;
    value: any = null;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
        this.debtor = navParams.data.debtor;
        this.value = navParams.data.value;
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad DebtsDetailPage');
    }

}
