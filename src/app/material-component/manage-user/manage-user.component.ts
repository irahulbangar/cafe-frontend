import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss']
})
export class ManageUserComponent implements OnInit {

  displayedColumns: string[] = ['name', 'email', 'contactNumber', 'status'];
  dataSource: any;
  responseMessage: any;

  constructor(private NgxService: NgxSpinnerService,
    private _user: UserService,
    private snackBar: SnackbarService) { }

  ngOnInit(): void {
    this.NgxService.show();
    this.tableData();
  }

  tableData() {
    this._user.getUsers().subscribe((response: any) => {
      this.NgxService.hide();
      this.dataSource = new MatTableDataSource(response);
    }, (error: any) => {
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  handleChangeAction(status: any, id: any) {
    this.NgxService.show();
    var data = {
      status: status.toString(),
      id: id
    }
    this._user.update(data).subscribe((response: any) => {
      this.NgxService.hide();
      this.responseMessage = response?.message;
      this.snackBar.openSnackBar(this.responseMessage, "success");
    }, (error: any) => {
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
