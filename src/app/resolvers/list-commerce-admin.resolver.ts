import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import Commerce from '../models/db/commerce';
import { CustomerResolver } from './customer.resolver';
import { VendorResolver } from './vendor.resolver';
@Injectable()
export class ListCommercesAdminResolver extends VendorResolver {
  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<any> {
    this.store.startLoader();
    const resp: Commerce[] = await this.commerceService.findAlls();
    this.store.endLoader();
    return resp;
  }
}
