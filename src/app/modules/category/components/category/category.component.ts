import {Component, OnInit} from '@angular/core';
import {CategoryService} from "../../../shared/services/category.service";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit{

  constructor( private categoryService: CategoryService ) {
  }

  ngOnInit(): void {
        this.getCategories();
    }

  displayedColumns: string[] = [ 'id','name','description','actions' ];
  dataSource = new MatTableDataSource<CategoryElement>();

  getCategories(){
    this.categoryService.getCategories()
      .subscribe( data => {
        console.log('respuesta categorias', data);
        this.processCategoryResponse(data);
      }, error => {
        console.log('error: ', error);
      })
  }
  processCategoryResponse(resp: any){
    const dataCategory: CategoryElement[] = [];
    if ( resp.metadata[0].code == '00'){
      console.log('entro al if')
      let listCategory = resp.categoryResponse.categories;
      listCategory.forEach((element: CategoryElement) => {
        dataCategory.push(element);
      });
      this.dataSource = new MatTableDataSource<CategoryElement>(dataCategory);
    }
  }
}
export interface CategoryElement {
  description: string;
  id: number;
  name: string;
}
