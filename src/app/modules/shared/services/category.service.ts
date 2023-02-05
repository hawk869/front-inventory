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
    const endPoint = `${base_url}/categories`;
    return this.http.get(endPoint);
  }
}
