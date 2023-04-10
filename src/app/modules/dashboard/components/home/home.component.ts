import {Component, OnInit} from '@angular/core';
import {ProductElement} from "../../../product/product/product.component";
import {ProductService} from "../../../shared/services/product.service";
import {Chart} from "chart.js";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  chartBar: any;
  chartDoughnut: any;

  constructor(private productService: ProductService) {
  }

  ngOnInit() {
    this.getAllProducts();
  }

  getAllProducts() {
    this.productService.getAllProducts().subscribe({
      next: data => this.processProductResponse(data),
      error: e => console.log(e)
    })
  }

  processProductResponse(response: any) {
    const nameProduct: string[] = [];
    const quantity: number[] = [];
    if (response.metadata[0].code == "00") {
      let listProducts = response.productResponse.products;
      console.log(listProducts);
      listProducts.forEach((element: ProductElement) => {
        nameProduct.push(element.name);
        quantity.push(element.quantity);
      });
      // grafico de barras
      this.chartBar = new Chart('canvas-bar', {
        type: 'bar',
        data: {
          labels: nameProduct,
          datasets: [
            { label: 'Productos', data: quantity}
          ]
        }
      })
      // grafico de doughnut
      this.chartDoughnut = new Chart('canvas-doughnut', {
        type: 'doughnut',
        data: {
          labels: nameProduct,
          datasets: [
            { label: 'Productos', data: quantity}
          ]
        }
      })
    }
  }

}
