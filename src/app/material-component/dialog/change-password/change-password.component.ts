import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  changePasswordForm: any = FormGroup;
  responseMessage: any

  constructor(private formBulider: FormBuilder,
    private _user: UserService,
    public dialog: MatDialogRef<ChangePasswordComponent>,
    private NgxService: NgxSpinnerService,
    private snackBar: SnackbarService) { }

  ngOnInit(): void {
    this.changePasswordForm = this.formBulider.group({
      oldPassword: [null, [Validators.required]],
      newPassword: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required]]
    })
  }

  validateSubmit() {
    if (this.changePasswordForm.controls['newPassword'].value != this.changePasswordForm.controls['confirmPassword'].value) {
      return true;
    }
    else {
      return false;
    }
  }

  handelChangePasswordSubmit() {
    this.NgxService.show();
    let formData = this.changePasswordForm.value;
    let data = {
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword
    }
    this._user.changePassword(data).subscribe((response: any) => {
      this.NgxService.hide();
      this.responseMessage = response?.message;
      this.dialog.close();
      this.snackBar.openSnackBar(this.responseMessage, "success")
    }, (error) => {
      console.log(error);
      this.NgxService.hide();
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
