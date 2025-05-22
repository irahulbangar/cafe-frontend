import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import {  NgxSpinnerService } from 'ngx-spinner';
import { SnackbarService } from '../services/snackbar.service';
import { UserService } from '../services/user.service';
import { GlobalConstants } from '../shared/global-constants';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordForm: any = FormGroup;
  responseMessage: any;

  constructor(private formBuilder: FormBuilder,
    private _user: UserService,
    private _dialog: MatDialogRef<ForgotPasswordComponent>,
    private _snackbar: SnackbarService,
    private NgxService:NgxSpinnerService) { }

  ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]]
    });
  }

  handleSubmit() {
    this.NgxService.show();
    var formData = this.forgotPasswordForm.value;
    var data = {
      email: formData.email
    }
    this._user.forgotPassword(data).subscribe((response: any) => {
      this.NgxService.hide();
      this.responseMessage = response?.message;
      this._dialog.close();
      this._snackbar.openSnackBar(this.responseMessage, "");
    }, (error) => {
      this.NgxService.hide();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this._snackbar.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

}
