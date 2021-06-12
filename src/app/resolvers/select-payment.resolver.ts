import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CustomerResolver } from './customer.resolver';
@Injectable()
export class SelectPaymentResolver extends CustomerResolver {
  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<any> {
    this.store.startLoader();
    const commerceId = route.params.commerceId;
    const resp = {
      commerce: await this.getCommerSelected(commerceId), // Heredado
      paymentMethods: await this.getPaymentMethodByCommerceSelected(commerceId), // Heredado
    };
    this.store.endLoader();
    return resp;
  }
}
