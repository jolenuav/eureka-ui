import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from 'src/app/services/authenticate.service';
import { VendorStoreService } from 'src/app/services/vendor-store.service';
import { pathRoute } from 'src/app/utils/commons.function';
import { ROUTES } from 'src/app/utils/routes';
import { AuthGuard } from '../auth.guard';

@Injectable()
export class AdminAccessAuthGuard extends AuthGuard {
  constructor(
    public _router: Router,
    public _vendorStore: VendorStoreService,
    public _authService: AuthService
  ) {
    super(_router, _vendorStore, _authService);
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this._authService.tokenValid() && this.hasAcces()) {
      return true;
    }
    this._redirectToAccessDenied(
      pathRoute([ROUTES.partner.main, ROUTES.partner.login])
    );
    return false;
  }
}
