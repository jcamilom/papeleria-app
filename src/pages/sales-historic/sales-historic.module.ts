import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { SalesHistoricPage } from './sales-historic';

@NgModule({
    declarations: [
        SalesHistoricPage,
    ],
    imports: [
        IonicPageModule.forChild(SalesHistoricPage),
    ],
    exports: [
        SalesHistoricPage
    ]
})
export class SalesHistoricPageModule { }
