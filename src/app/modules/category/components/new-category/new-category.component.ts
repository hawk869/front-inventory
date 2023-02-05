import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CategoryService} from "../../../shared/services/category.service";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-new-category',
  templateUrl: './new-category.component.html',
  styleUrls: ['./new-category.component.css']
})
export class NewCategoryComponent {

  public categoryForm: FormGroup;

  constructor( private formBuild: FormBuilder,
               private categoryService: CategoryService,
               private dialogRef: MatDialogRef<NewCategoryComponent> ) {

    this.categoryForm = formBuild.group({
      name: [ '', Validators.required ],
      description: [ '', Validators.required]
    });
  }

  onSave() {
    let data = {
      name: this.categoryForm.get('name') ?.value,
      description: this.categoryForm.get('description') ?.value
    }
    this.categoryService.saveCategory(data)
      .subscribe( data => {
        console.log(data)
        this.dialogRef.close(1)
      }, error => {
        this.dialogRef.close(2)
      })
  }

  onCancel() {
    this.dialogRef.close(3)
  }

}
