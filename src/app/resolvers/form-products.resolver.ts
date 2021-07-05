import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { VendorResolver } from './vendor.resolver';
@Injectable()
export class FormProductsResolver extends VendorResolver {
  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<any> {
    this.store.startLoader();
    const resp: any = {};
    if (route.queryParams.product) {
      resp.product = await this.getProductById(route.queryParams.product); // Heredado
      resp.commerce = await this.getCommerSelected(resp.product.commerce); // Heredado
    }
    this.store.endLoader();
    return resp;
  }
}
