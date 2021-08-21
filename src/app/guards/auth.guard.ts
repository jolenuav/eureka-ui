import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { UserTypeEnum } from '../models/enums/user-type.enum';
import { AuthService } from '../services/authenticate.service';
import { VendorStoreService } from '../services/store/vendor-store.service';
import { CONSTANTS } from '../utils/constants';

export abstract class AuthGuard implements CanActivate {
  constructor(
    public _router: Router,
    public _vendorStore: VendorStoreService,
    public _authService: AuthService
  ) {}

  abstract canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean;

  _redirectToAccessDenied(path: string): void {
    this._router.navigate([path]);
  }

  hasAcces(): boolean {
    if (
      this._vendorStore.user &&
      this._vendorStore.user.type === UserTypeEnum.admin &&
      this._vendorStore.user.roles.some((r) => r === CONSTANTS.roles.all)
    ) {
      return true;
    }
    return false;
  }
}
