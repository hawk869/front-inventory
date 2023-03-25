import {Component, OnInit, ViewChild} from '@angular/core';
import {CategoryService} from "../../../shared/services/category.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog} from "@angular/material/dialog";
import {NewCategoryComponent} from "../new-category/new-category.component";
import {MatSnackBar, MatSnackBarRef, SimpleSnackBar} from "@angular/material/snack-bar";
import {ConfirmComponent} from "../../../shared/components/confirm/confirm.component";
import {MatPaginator} from "@angular/material/paginator";

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

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  getCategories(){
    this.categoryService.getCategories()
      .subscribe(  {
        next: data => {
          console.log('respuesta categorias', data);
          this.processCategoryResponse(data);
        },
        error: e => console.log('error: ', e)
      })
  }
  processCategoryResponse(resp: any){
    const dataCategory: CategoryElement[] = [];
    if ( resp.metadata[0].code == '00'){
      let listCategory = resp.categoryResponse.categories;
      listCategory.forEach((element: CategoryElement) => {
        dataCategory.push(element);
      });
      this.dataSource = new MatTableDataSource<CategoryElement>(dataCategory);
      this.dataSource.paginator = this.paginator;
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
      data: { id:id, module:'category' }
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
  findCategory( term: string ) {
    if (term.length === 0){
      return this.getCategories();
    }
    this.categoryService.getCategoryById(term)
      .subscribe( response => {
        this.processCategoryResponse( response );
      })
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
