import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  _url = './assets/test.json';

  constructor(private httpClient: HttpClient) { }

  getPersons() {
    return this.httpClient.get<JSON>(this._url);
  }
}
