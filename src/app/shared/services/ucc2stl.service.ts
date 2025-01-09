import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Ucc2stlService {

  http: HttpClient = inject(HttpClient);

  getDensity(){
    return this.http.get('assets/data/density.txt', {responseType: 'text'})
  }

  getConnectivity(){
    return this.http.get('assets/data/connectivity.txt', {responseType: 'text'})
  }

  getNode(){
    return this.http.get('assets/data/node.txt', {responseType: 'text'})
  }
}
