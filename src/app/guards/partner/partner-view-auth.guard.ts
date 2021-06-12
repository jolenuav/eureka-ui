import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import * as moment from 'moment';
import SessionToken from 'src/app/models/db/session-token';
import { pathRoute } from 'src/app/utils/commons.function';
import { CONSTANTS } from 'src/app/utils/constants';
import { AuthGuard } from '../auth.guard';

@Injectable()
export class PartnerViewAuthGuard extends AuthGuard {
  constructor(router: Router) {
    super(router);
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (!this.tokenValid()) {
      this._redirectToAccessDenied(
        pathRoute([
          CONSTANTS.routes.partner.main,
          CONSTANTS.routes.partner.login,
        ])
      );
      return false;
    }
    return true;
  }

  tokenValid(): boolean {
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
