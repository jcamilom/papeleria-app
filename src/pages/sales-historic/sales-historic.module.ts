import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { SalesHistoricPage } from './sales-historic';

import { MatTableModule } from '@angular/material/table';

@NgModule({
    declarations: [
        SalesHistoricPage,
    ],
    imports: [
        IonicPageModule.forChild(SalesHistoricPage),
        MatTableModule
    ],
    exports: [
        SalesHistoricPage
    ]
})
export class SalesHistoricPageModule { }
