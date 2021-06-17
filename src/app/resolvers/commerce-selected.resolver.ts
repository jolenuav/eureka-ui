import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CustomerResolver } from './customer.resolver';
@Injectable()
export class CommerceSelectedResolver extends CustomerResolver {
  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<any> {
    this.store.startLoader();
    const commerceUrl = route.params.commerceUrl;
    const resp = await this.getCommerSelected(commerceUrl); // Heredado
    this.store.endLoader();
    return resp;
  }
}
