import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../enviroments/enviroment";

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor( private http: HttpClient ) { }

  getCategories(){
    return this.http.get(`${base_url}/categories`);
  }

  saveCategory(body: any) {
    return this.http.post(`${base_url}/categories`, body);
  }
  updateCategory(body: any, id: any) {
    return this.http.put(`${base_url}/categories/${id}`, body);
  }
  deleteCategory( id: any ) {
    return this.http.delete(`${base_url}/categories/${id}`);
  }
  getCategoryById( id: any ){
    return this.http.get( `${base_url}/categories/${id}`);
  }
  exportCategories(){
    return this.http.get(`${base_url}/categories/export/excel`,{
      responseType: 'blob'
    })
  }
}
