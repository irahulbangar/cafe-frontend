import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  onAddCategory = new EventEmitter();
  onEditCategory = new EventEmitter();
  categoryForm: any = FormGroup;
  dialogAction: any = "Add";
  action: any = "Add";
  responseMessage: any;

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
    private formBuilder: FormBuilder,
    private _category: CategoryService,
    public _dialog: MatDialogRef<CategoryComponent>,
    private snackBar: SnackbarService) { }

  ngOnInit(): void {
    this.categoryForm = this.formBuilder.group({
      name: [null, [Validators.required]]
    });
    if (this.dialogData.action === "Edit") {
      this.dialogAction = "Edit";
      this.action = "Update";
      this.categoryForm.patchValue(this.dialogData.data);
    }
  }

  handleSubmit() {
    if (this.dialogAction === "Edit") {
      this.edit();
    }
    else {
      this.add();
    }
  }

  add() {
    let formData = this.categoryForm.value;
    let data = {
      name: formData.name
    }
    this._category.add(data).subscribe((response: any) => {
      this._dialog.close();
      this.onAddCategory.emit();
      this.responseMessage = response.message;
      this.snackBar.openSnackBar(this.responseMessage, "success");
    }, (error: any) => {
      this._dialog.close();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackBar.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

  edit() {
    let formData = this.categoryForm.value;
    let data = {
      id: this.dialogData.data.id,
      name: formData.name
    }
    this._category.update(data).subscribe((response: any) => {
      this._dialog.close();
      this.onEditCategory.emit();
      this.responseMessage = response.message;
      this.snackBar.openSnackBar(this.responseMessage, "success");
    }, (error: any) => {
      this._dialog.close();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackBar.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

}
