import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CustomerResolver } from './customer.resolver';
@Injectable()
export class LoadOrderResolver extends CustomerResolver {
  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<any> {
    this.store.startLoader();
    const commerceUrl = route.params.commerceUrl;
    const productId = route.params.productId;
    const resp = {
      commerce: await this.getCommerSelected(commerceUrl), // Heredado
      product: await this.getProductToOrder(productId), // Heredado
    };
    this.store.endLoader();
    return resp;
  }
}
