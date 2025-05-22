import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { SnackbarService } from './snackbar.service';
import jwt_decode from 'jwt-decode';
import { GlobalConstants } from '../shared/global-constants';


@Injectable({
  providedIn: 'root'
})
export class RouteGuardService {

  constructor(public _auth: AuthService,
    public _router: Router,
    private snackBar: SnackbarService) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    let expectedRoleArray = route.data;
    expectedRoleArray = expectedRoleArray.expectedRole;

    const token: any = localStorage.getItem('token');
    let tokenPlayload: any;
    try {
      tokenPlayload = jwt_decode(token);
    }
    catch (err) {
      localStorage.clear();
      this._router.navigate(['/']);
    }

    let checkRole = false;

    for (let i = 0; i < expectedRoleArray.length; i++) {
      if (expectedRoleArray[i] == tokenPlayload.role) {
        checkRole = true;
      }
    }

    if (tokenPlayload.role == 'user' || tokenPlayload.role == 'admin') {
      if (this._auth.isAuthenticated() && checkRole) {
        return true;
      }
      this.snackBar.openSnackBar(GlobalConstants.unauthroized, GlobalConstants.error)
      this._router.navigate(['/cafe/dashboard']);
      return false;
    }
    else {
      this._router.navigate(['/']);
      localStorage.clear();
      return false;
    }
  }

}
