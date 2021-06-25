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
    const commerceParam = route.params.commerceUrl
      ? route.params.commerceUrl
      : route.queryParams.commerce;
    let resp: any = {
      commerce: null,
      paymentMethods: [],
    };
    if (route.params.commerceUrl) {
      const commerce = await this.getCommerSelected(commerceParam); // Heredado
      resp = {
        commerce,
        paymentMethods: await this.getPaymentMethodByCommerceSelected(
          commerce.id
        ), // Heredado
      };
    }
    if (route.queryParams.commerce) {
      const commerce = await this.getCommerById(commerceParam); // Heredado
      const paymentMethods = await this.getPaymentMethodByCommerceSelected(
        commerce.id
      ); // Heredado
      resp = {
        commerce,
        paymentMethods,
      };
    }
    this.store.endLoader();
    return resp;
  }
}
