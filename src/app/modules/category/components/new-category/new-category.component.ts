import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CategoryService} from "../../../shared/services/category.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-new-category',
  templateUrl: './new-category.component.html',
  styleUrls: ['./new-category.component.css']
})
export class NewCategoryComponent {

  public categoryForm: FormGroup;
  estadoFormulario: string = '';

  constructor( private formBuild: FormBuilder,
               private categoryService: CategoryService,
               private dialogRef: MatDialogRef<NewCategoryComponent>,
               @Inject(MAT_DIALOG_DATA) public data: any ) {

    console.log(data);
    this.estadoFormulario = "Agregar nueva";

    this.categoryForm = formBuild.group({
      name: [ '', Validators.required ],
      description: [ '', Validators.required]
    });

    if ( data != null ) {
      this.updateForm(data);
      this.estadoFormulario = 'Actualizar';
    }
  }

  onSave() {
    let data = {
      name: this.categoryForm.get('name') ?.value,
      description: this.categoryForm.get('description') ?.value
    }
    if ( this.data!=null ) {
      this.categoryService.updateCategory(data, this.data.id)
        .subscribe( data => {
          this.dialogRef.close(1)
        }, error => {
          this.dialogRef.close(2)
        } )
    } else {
      this.categoryService.saveCategory(data)
        .subscribe( data => {
          console.log(data)
          this.dialogRef.close(1)
        }, error => {
          this.dialogRef.close(2)
        })
    }
  }

  onCancel() {
    this.dialogRef.close(3)
  }

  updateForm( data: any ) {
    this.categoryForm = this.formBuild.group({
      name: [ data.name, Validators.required ],
      description: [ data.description, Validators.required]
    });
  }

}
