import {Component, OnInit} from '@angular/core';
import {CategoryService} from "../../../shared/services/category.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog} from "@angular/material/dialog";
import {NewCategoryComponent} from "../new-category/new-category.component";
import {MatSnackBar, MatSnackBarRef, SimpleSnackBar} from "@angular/material/snack-bar";
import {ConfirmComponent} from "../../../shared/components/confirm/confirm.component";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit{

  constructor( private categoryService: CategoryService,
               public dialog: MatDialog,
               private snackBar: MatSnackBar ) {
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
  openCategoryDialog(){
    const dialogRef = this.dialog.open(NewCategoryComponent, {
      width: '450px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if( result == 1 ) {
        this.openSnackBar('Categoría agregada', 'Exitosa');
        this.getCategories();
      } else if( result == 2 ) {
        this.openSnackBar('Se produjo un error al guardar la categoría', 'Error' )
      }
    });
  }
  update(id: number, name: string, description:string) {
    const dialogRef = this.dialog.open(NewCategoryComponent, {
      width: '450px',
      data: { id: id, name: name, description: description }
    });
    dialogRef.afterClosed().subscribe(result => {
      if( result == 1 ) {
        this.openSnackBar('Categoría actualizada', 'Exitosa');
        this.getCategories();
      } else if( result == 2 ) {
        this.openSnackBar('Se produjo un error al actualizar la categoría', 'Error' )
      }
    });
  }
  delete( id: any ) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      data: { id: id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if( result == 1 ) {
        this.openSnackBar('Categoría Eliminada', 'Exitosa');
        this.getCategories();
      } else if( result == 2 ) {
        this.openSnackBar('Se produjo un error al eliminar la categoría', 'Error' )
      }
    });
  }
  openSnackBar( menssage: string, action: string ) : MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(menssage,action, {
      duration: 2000
    })
  }
}
export interface CategoryElement {
  description: string;
  id: number;
  name: string;
}
