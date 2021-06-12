import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

export abstract class AuthGuard implements CanActivate {
  constructor(private _router: Router) {}

  abstract canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean;

  _redirectToAccessDenied(path: string): void {
    this._router.navigate([path]);
  }
}
