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
export class LoginAuthGuard extends AuthGuard {
  constructor(router: Router) {
    super(router);
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this._tokenValid()) {
      this._redirectToAccessDenied(
        pathRoute([
          CONSTANTS.routes.partner.main,
          CONSTANTS.routes.partner.orderList,
        ])
      );
      return false;
    }
    return true;
  }

}
