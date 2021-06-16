import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import * as moment from 'moment';
import SessionToken from '../models/db/session-token';

export abstract class AuthGuard implements CanActivate {
  constructor(private _router: Router) {}

  abstract canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean;

  _redirectToAccessDenied(path: string): void {
    this._router.navigate([path]);
  }

  _tokenValid(): boolean {
    const obj = JSON.parse(sessionStorage.getItem('sessionToken'));
    if (!obj) {
      return false;
    }
    const sessionToken = SessionToken.parse(obj);
    const tokenDate = moment(sessionToken.expireToken);
    const currentDate = moment();
    if (tokenDate.diff(currentDate, 'minutes') > 0) {
      return true;
    }
    return false;
  }
}
