import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class SalesProvider {

  constructor(public http: HttpClient) {
    console.log('Hello SalesProvider Provider');
  }

}
