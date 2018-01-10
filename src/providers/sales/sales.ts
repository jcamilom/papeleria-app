import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { Api } from '../api/api';

import { Sale } from '../../models/sale';

@Injectable()
export class SalesProvider {
    
    private salesEndpoint: string = 'sales';

    private salesSource: BehaviorSubject<Sale[]>;
    public currentSales: Observable<Sale[]>; 

    private updateAvailable: boolean;

    constructor(private api: Api) {
        //this.salesSource = new BehaviorSubject<Sale[]>([{value: 3800, paidValue: 1200, paid: false}]);
        this.salesSource = new BehaviorSubject<Sale[]>([]);
        this.currentSales = this.salesSource.asObservable();

        this.updateAvailable = false;
    }

    /**
     * Send a GET request to our sales endpoint. After that, the BehaviorSubject
     * broadcasts the received data.
     */
    public getSales() {
        this.api.get(this.salesEndpoint).subscribe((resp) => {
            let sales_arr: Sale[] = [];
            if(resp.status == 'success') {
                let sales = resp.data;
                for(let sale of sales) {
                    //console.log(JSON.stringify(sale));
                    sale.createdAt = new Date(sale.createdAt);
                    if(sale.updatedAt != null) sale.updatedAt = new Date(sale.updatedAt);
                    sales_arr.push(new Sale(sale));
                }
                this.changeSales(sales_arr);
                this.setUpdateAvailable(false);
            } else {
                console.log("Get sales bad request");
            }
        // Should generate a toast saying that there is an error with the db connection
        }, (err) => {
            console.error("From salesProvider: error connecting to the database:");
            throw(err);
        });
    }

    public changeSales(sales: Sale[]) {
        this.salesSource.next(sales);
    }

    /**
     * Set a flag which is used by pages before loading.
     */
    public setUpdateAvailable(available: boolean) {
        this.updateAvailable = available;
    }

    /**
     * Get the flag which is used by pages before loading.
     */
    public getUpdateAvailable(): boolean {
        return this.updateAvailable;
    }

    public addSale(sale: Sale) {
        return this.api.post(this.salesEndpoint, sale);
    }

    public updateSale(sale) {
        return this.api.put(this.salesEndpoint + "/" + sale.id, sale.body);
    }

    public deleteSale(sale: Sale) {
        return this.api.delete(this.salesEndpoint + "/" + sale.id);
    }

    public findSaleById(sale) {
        return sale.id === this[0];
    }

    public sortByCreatedAtDesc(a, b) {
        const dateA = a.createdAt;
        const dateB = b.createdAt;
    
        let comparison = 0;
        if(dateA > dateB) {
            comparison = -1;
        } else if(dateA < dateB) {
            comparison = 1;
        }
        return comparison;
    }

}
