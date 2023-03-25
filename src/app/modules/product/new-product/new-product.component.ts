import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CategoryService} from "../../shared/services/category.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ProductService} from "../../shared/services/product.service";

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css']
})
export class NewProductComponent implements OnInit{

  public  productForm: FormGroup;
  estadoFormulario: string = '';
  categories: Category[] = [];
  selectedFile: any;
  nameImage: string = "";
  constructor(private formBuilder: FormBuilder,
              private categoryService: CategoryService,
              private productService: ProductService,
              private dialogRef: MatDialogRef<NewProductComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {

    this.estadoFormulario = "Agregar nuevo";
    this.productForm = this.formBuilder.group({
      name: [ '', Validators.required ],
      price: [ '', Validators.required ],
      quantity: [ '', Validators.required ],
      category: [ '', Validators.required ],
      photo: [ '', Validators.required ]
    })
    if ( data != null ){
      this.updateForm(data);
      this.estadoFormulario = 'Actualizar';
    }
  }
  ngOnInit() {
    this.getCategories()
  }
  onSave(){

    let data = {
      name: this.productForm.get('name')?.value,
      price: this.productForm.get('price')?.value,
      quantity: this.productForm.get('quantity')?.value,
      category: this.productForm.get('category')?.value,
      photo: this.selectedFile
    }

    const uploadImageData = new FormData();
    uploadImageData.append('photo', data.photo, data.photo.name );
    uploadImageData.append('name', data.name);
    uploadImageData.append('price', data.price);
    uploadImageData.append('quantity', data.quantity);
    uploadImageData.append('categoryId', data.category);

    if ( this.data != null ){
      this.productService.updateProduct( uploadImageData, this.data.id )
        .subscribe({
          next: () => this.dialogRef.close(1),
          error: () => this.dialogRef.close(2)
        })
    }
    else {
      this.productService.saveProduct(uploadImageData).subscribe({
        next: () => this.dialogRef.close(1),
        error: () => this.dialogRef.close(2)
      })
    }
  }
  onCancel(){
    this.dialogRef.close(3)
  }
  getCategories(){
    this.categoryService.getCategories().subscribe({
      next: (data: any) => this.categories = data.categoryResponse.categories,
      error: err => console.log('error al consultar las categorías', err)
    })
  }
  onFileChanged( event: any ){
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);
    this.nameImage = event.target.files[0].name;
  }
  updateForm( data: any ){
    this.productForm = this.formBuilder.group({
      name: [ data.name, Validators.required ],
      price: [ data.price, Validators.required ],
      quantity: [ data.quantity, Validators.required ],
      category: [ data.category.id, Validators.required ],
      photo: [ '', Validators.required ]
    })
  }
}

export interface Category {
  description: string;
  id: number;
  name: string;
}
