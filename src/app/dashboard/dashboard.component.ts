import { Component, AfterViewInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { DashboardService } from '../services/dashboard.service';
import { SnackbarService } from '../services/snackbar.service';
import { GlobalConstants } from '../shared/global-constants';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {

	responseMessage: any;
	data: any;

	ngAfterViewInit() { }

	constructor(private _dashBoard: DashboardService,
		private NgxService: NgxSpinnerService,
		private snackBar: SnackbarService) {
		this.NgxService.show();
		this.dashboardData();
	}

	dashboardData() {
		this._dashBoard.getDetails().subscribe((response: any) => {
			this.NgxService.hide();
			this.data = response;
		}, (error: any) => {
			this.NgxService.hide();
			console.log(error);
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
