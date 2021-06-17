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
    const commerceUrl = route.params.commerceUrl;
    const commerce = await this.getCommerSelected(commerceUrl); // Heredado
    const resp = {
      commerce,
      paymentMethods: await this.getPaymentMethodByCommerceSelected(
        commerce.id
      ), // Heredado
    };
    this.store.endLoader();
    return resp;
  }
}
