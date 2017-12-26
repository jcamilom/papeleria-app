import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class Api {
    url: string = 'http://localhost:1337/api/v1';

    constructor(public http: HttpClient) {}

    get(endpoint: string, params ? : any, reqOpts ? : any): Observable<any> {
        if(!reqOpts) {
            reqOpts = {
                params: new HttpParams(),
                //observe: 'response'
            };
        }

        // Support easy query params for GET requests
        if(params) {
            reqOpts.params = new HttpParams();
            for(let k in params) {
                reqOpts.params.set(k, params[k]);
            }
        }

        return this.http.get<any>(this.url + '/' + endpoint, reqOpts);
    }

    post(endpoint: string, body: any, reqOpts ? : any): Observable<any> {
        return this.http.post<any>(this.url + '/' + endpoint, body, reqOpts);
    }

    put(endpoint: string, body: any, reqOpts ? : any): Observable<any> {
        return this.http.put<any>(this.url + '/' + endpoint, body, reqOpts);
    }

    delete(endpoint: string, reqOpts ? : any): Observable<any> {
        return this.http.delete<any>(this.url + '/' + endpoint, reqOpts);
    }

/*     patch(endpoint: string, body: any, reqOpts ? : any) {
        return this.http.put(this.url + '/' + endpoint, body, reqOpts);
    } */
}
