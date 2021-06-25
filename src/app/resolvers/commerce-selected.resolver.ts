import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import Commerce from '../models/db/commerce';
import { CustomerResolver } from './customer.resolver';
@Injectable()
export class CommerceSelectedResolver extends CustomerResolver {
  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<any> {
    this.store.startLoader();
    let resp: Commerce;
    if (route.params.commerceUrl) {
      const commerceUrl = route.params.commerceUrl;
      resp = await this.getCommerSelected(commerceUrl); // Heredado
    }
    if (route.queryParams.commerce) {
      const commerceId = route.queryParams.commerce;
      resp = await this.getCommerById(commerceId); // Heredado
    }
    this.store.endLoader();
    return resp;
  }
}
