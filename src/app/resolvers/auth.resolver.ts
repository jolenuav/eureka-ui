import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { VendorResolver } from './vendor.resolver';
@Injectable()
export class AuthResolver extends VendorResolver {
  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<any> {
    this.store.startLoader();
    const resp: any = {};
    resp.user = await this.getUsserLogged();
    this.store.endLoader();
    return resp;
  }
}
