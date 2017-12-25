import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { Api } from '../api/api';

import { Sale } from '../../models/sale';

@Injectable()
export class SalesProvider {

    private salesSource: BehaviorSubject<Sale[]>;
    public currentSales: Observable<Sale[]>; 

    constructor(private api: Api) {
        //this.salesSource = new BehaviorSubject<Sale[]>([{value: 3800, paidValue: 1200, paid: false}]);
        this.salesSource = new BehaviorSubject<Sale[]>([]);
        this.currentSales = this.salesSource.asObservable();
    }

    /**
     * Send a GET request to our sales endpoint. After that, the BehaviorSubject
     * broadcasts the received data.
     */
    public getSales() {
        this.api.get('sales').subscribe((resp) => {
            let sales_arr: Sale[] = [];
            if(resp.status == 'success') {
                let sales = resp.data;
                for(let sale of sales) {
                    console.log(JSON.stringify(sale));
                    sales_arr.push(new Sale(sale));
                }
                this.changeSales(sales_arr);
            } else {
                console.log("Get sales bad request");
            }
        }, (err) => {
            console.log("Sales provider error");
        });
    }

    public changeSales(sales: Sale[]) {
        this.salesSource.next(sales);
    }

}
