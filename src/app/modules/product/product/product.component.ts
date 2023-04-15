import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {ProductService} from "../../shared/services/product.service";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar, MatSnackBarRef, SimpleSnackBar} from "@angular/material/snack-bar";
import {NewProductComponent} from "../new-product/new-product.component";
import {ConfirmComponent} from "../../shared/components/confirm/confirm.component";
import {UtilService} from "../../shared/services/util.service";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  isAdmin: any;
  constructor(private productService: ProductService,
              public dialog: MatDialog,
              private snackBar: MatSnackBar,
              private util: UtilService) {
  }

  ngOnInit(): void {
    this.getAllProducts();
    this.isAdmin = this.util.isAdmin();
  }

  displayedColumns: string[] = ['id', 'name', 'price', 'quantity', 'category', 'photo', 'actions'];
  dataSource = new MatTableDataSource<ProductElement>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  getAllProducts() {
    this.productService.getAllProducts().subscribe({
      next: data => this.processProductResponse(data),
      error: e => console.log(e)
    })
  }

  processProductResponse(response: any) {
    const dataProduct: ProductElement[] = [];
    if (response.metadata[0].code == "00") {
      let listProducts = response.productResponse.products;
      console.log(listProducts);
      listProducts.forEach((element: ProductElement) => {
        // element.category = element.category.name;
        element.photo = 'data:image/jpeg;base64,' + element.photo;
        dataProduct.push(element);
      });
      this.dataSource = new MatTableDataSource<ProductElement>(dataProduct);
      this.dataSource.paginator = this.paginator;
    }
  }

  openProductDialog() {
    const dialogRef = this.dialog.open(NewProductComponent, {
      width: '450px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if( result == 1 ) {
        this.openSnackBar('Producto agregada', 'Exitosa');
        this.getAllProducts();
      } else if( result == 2 ) {
        this.openSnackBar('Se produjo un error al guardar el producto', 'Error' )
      }
    });
  }
  openSnackBar( menssage: string, action: string ) : MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(menssage,action, {
      duration: 2000
    })
  }
  edit(id:number, name: string, price: number, quantity: number, category: any){
    const dialogRef = this.dialog.open(NewProductComponent, {
      width: '450px',
      data: { id:id, name:name, price:price, quantity:quantity, category:category }
    });
    dialogRef.afterClosed().subscribe({
      next: (result: any) => {
        if ( result == 1 ){
          this.openSnackBar('Producto editado', 'Exitosa');
          this.getAllProducts();
        } else if ( result == 2 ){
          this.openSnackBar('Se produjo un error al editar el producto', 'Error');
        }
      }
    });
  }
  delete( id:any ){
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '450px',
      data: { id:id, module:'product' }
    });
    dialogRef.afterClosed().subscribe({
      next: (result: any) => {
        if ( result == 1 ){
          this.openSnackBar('Producto eliminado', 'Exitosa');
          this.getAllProducts();
        } else if ( result == 2 ){
          this.openSnackBar('Se produjo un error al eliminar el producto', 'Error');
        }
      }
    })
  }
  findProduct( productName: any ){
    if ( productName.length === 0 ){
      return this.getAllProducts();
    }
    this.productService.getProductByName( productName )
      .subscribe({
        next: ( resp:any ) => this.processProductResponse( resp )
      })
  }
  exportExcel(){
    this.productService.exportProducts().subscribe({
      next: (data: any) => {
        let file = new Blob([data],{type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        let fileUrl = URL.createObjectURL(file);
        let anchor = document.createElement('a');
        anchor.download = 'products.xlsx';
        anchor.href = fileUrl;
        anchor.click();

        this.openSnackBar('Archivo exportado correctamente', 'Exitosa');
      },
      error: () => this.openSnackBar('No se pudo exportar el archivo', 'Error')
    })
  }
}
export interface ProductElement {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category: any;
  photo: any;
}
