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
  saveProduct( body: any ){
    return this.http.post(`${base_url}/products`, body);
  }
  updateProduct( body: any, id: any ){
    return this.http.put(`${base_url}/products/${id}`, body);
  }
  deleteProduct( id:any ){
    return this.http.delete(`${base_url}/products/${id}`);
  }
  getProductByName( name:any ){
    return this.http.get(`${base_url}/products/filter/${name}`);
  }
}
