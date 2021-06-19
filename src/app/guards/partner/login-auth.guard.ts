import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { AuthService } from 'src/app/services/authenticate.service';
import { pathRoute } from 'src/app/utils/commons.function';
import { ROUTES } from 'src/app/utils/routes';
import { AuthGuard } from '../auth.guard';

@Injectable()
export class LoginAuthGuard extends AuthGuard {
  constructor(public _router: Router, public _authService: AuthService) {
    super(_router, null, _authService);
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this._authService.tokenValid()) {
      this._redirectToAccessDenied(
        pathRoute([
          ROUTES.partner.main,
          ROUTES.partner.orderList,
        ])
      );
      return false;
    }
    return true;
  }
}
