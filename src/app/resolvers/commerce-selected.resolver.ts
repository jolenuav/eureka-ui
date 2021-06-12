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
    const commerceId = route.params.commerceId;
    const resp = await this.getCommerSelected(commerceId); // Heredado
    this.store.endLoader();
    return resp;
  }
}
