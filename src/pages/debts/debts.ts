import { Component, ViewChild } from '@angular/core';
import { IonicPage, Nav } from 'ionic-angular';

import { DebtsMaster } from '../../pages/pages';

@IonicPage()
@Component({
    selector: 'page-debts',
    templateUrl: 'debts.html',
})
export class DebtsPage {

    // Grab References to our 2 NavControllers...
    @ViewChild('detailNav') detailNav: Nav;
    @ViewChild('masterNav') masterNav: Nav;

    // Empty placeholders for the 'master/detail' pages...
    masterPage: any = null;
    detailPage: any = null;

    constructor() { }

    ionViewDidLoad() {
        console.log('ionViewDidLoad DebtsPage');
        
        // Set initial pages for our nav controllers...
        this.masterNav.setRoot(DebtsMaster, { detailNavCtrl: this.detailNav });
    }

}
