import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { pathRoute } from '../utils/commons.function';
import { ROUTES } from '../utils/routes';
import { CustomerResolver } from './customer.resolver';

@Injectable()
export class SearchProductsResolver extends CustomerResolver {
  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<void> {
    this.store.startLoader();
    const commerceUrl = route.params.commerceUrl;
    // Se cargan los datos en el servico de CustomerStore
    await this.getCommerSelected(commerceUrl);
    await this.getCatalogByCommerceId(this.customerStore.commerceSelected.id);
    await this.getProductByCommerceId(this.customerStore.commerceSelected.id);
    this.store.endLoader();
  }
}
