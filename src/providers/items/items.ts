import { Injectable } from '@angular/core';

import { Api } from '../api/api';
import { Observable } from 'rxjs/Observable';
import { ItemsResponse } from '../../pages/search/search';

@Injectable()
export class ItemsProvider {
    
    constructor(public api: Api) { }

    /**
     * Send a GET request to our items endpoint.
     */
    getAllItems(): Observable<ItemsResponse> {
        return this.api.get('items');

   /*       seq.subscribe((res: any) => {
            // If the API returned a successful response, mark the user as logged in
            if(res.status == 'success') {
                //this._loggedIn(res);
                console.log("getAllItems success from ItemsProvider")
            } else {}
        }, err => {
            console.error('ERROR', err);
        });

        return seq; */
    }
    
}
