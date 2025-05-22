import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BillService {

  url = environment.apiUrl;

  constructor(private _http: HttpClient) { }

  generateReport(data: any) {
    return this._http.post(this.url + "/bill/generateReport/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    })
  }

  getPDF(data: any): Observable<Blob> {
    return this._http.post(this.url + "/bill/getPdf/", data, { responseType: 'blob' });
  }

  getBills() {
    return this._http.get(this.url + "/bill/getBills/");
  }

  delete(id: any) {
    return this._http.delete(this.url + "/bill/delete/" + id, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    })
  }
}
