import { Injectable } from '@angular/core';
import {environment} from "../../../../enviroments/enviroment";
import {HttpClient} from "@angular/common/http";

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor( private http: HttpClient ) { }

  getAllProducts(){
    return this.http.get(`${base_url}/products`);
  }
}
