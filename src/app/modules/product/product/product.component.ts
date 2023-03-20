import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {ProductService} from "../../shared/services/product.service";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  constructor( private productService: ProductService ) {
  }
  ngOnInit(): void {
    this.getAllProducts();
  }

  displayedColumns: string[] = ['id','name','price','quantity','category','photo','actions'];
  dataSource = new MatTableDataSource<ProductElement>();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  getAllProducts(){
    this.productService.getAllProducts().subscribe({
      next: data => this.processProductResponse(data),
      error: e => console.log(e)
    })
  }

  processProductResponse( response: any ){
    const dataProduct: ProductElement[] = [];
    if ( response.metadata[0].code == "00"){
      let listProducts = response.productResponse.products;
      console.log(listProducts);
      listProducts.forEach(( element: ProductElement ) => {
        element.category = element.category.name;
        element.photo = 'data:image/jpeg;base64,' + element.photo;
        dataProduct.push(element);
      });
      this.dataSource = new MatTableDataSource<ProductElement>( dataProduct );
      this.dataSource.paginator = this.paginator;
    }
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
