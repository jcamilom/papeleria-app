import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { Api } from '../api/api';

import { Debt } from '../../models/debt';

@Injectable()
export class DebtsProvider {

    private debtsSource: BehaviorSubject<Debt[]>;
    public currentDebts: Observable<Debt[]>; 

    private updateAvailable: boolean;

    constructor(private api: Api) {
        //this.debtsSource = new BehaviorSubject<Debt[]>([{value: 3800, paidValue: 1200, paid: false}]);
        this.debtsSource = new BehaviorSubject<Debt[]>([]);
        this.currentDebts = this.debtsSource.asObservable();

        this.updateAvailable = false;
    }

    /**
     * Send a GET request to our debts endpoint. After that, the BehaviorSubject
     * broadcasts the received data.
     */
    public getDebts() {
        this.api.get('debts').subscribe((resp) => {
            let debts_arr: Debt[] = [];
            if(resp.status == 'success') {
                let debts = resp.data;
                for(let debt of debts) {
                    //console.log(JSON.stringify(debt));
                    debt.createdAt = new Date(debt.createdAt);
                    if(debt.updatedAt != null) debt.updatedAt = new Date(debt.updatedAt);
                    debts_arr.push(new Debt(debt));
                }
                this.changeDebts(debts_arr);
                this.setUpdateAvailable(false);
            } else {
                console.log("Get debts bad request");
            }
        // Should generate a toast saying that there is an error with the db connection
        }, (err) => {
            console.error("From debtsProvider: error connecting to the database:");
            throw(err);
        });
    }

    public AddDebt(debt: Debt) {
        return this.api.post('debts', debt);
    }

    public changeDebts(debts: Debt[]) {
        this.debtsSource.next(debts);
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
