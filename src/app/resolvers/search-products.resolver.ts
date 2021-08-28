import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import Product from '../models/db/product';
import { CustomerResolver } from './customer.resolver';
@Injectable()
export class SearchProductsResolver extends CustomerResolver {
  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<any> {
    this.store.startLoader();
    const commerceUrl = route.params.commerceUrl;
    const commerce = await this.getCommerSelected(commerceUrl); // Heredado
    const products: Product[] = await this.getProductByCommerceId(commerce.id); // Heredado
    const productsEnabled = await this.cleanProducts(products);
    const resp = {
      commerce,
      products: productsEnabled,
      productsBySection: await this.getProductsBySections(productsEnabled),
    };
    this.store.endLoader();
    return resp;
  }

  async getProductsBySections(
    products: Product[]
  ): Promise<Map<string, Product[]>> {
    const map = new Map<string, Product[]>();
    for await (const prod of products) {
      if (map.has(prod.category.description)) {
        const p = map.get(prod.category.description);
        p.push(prod);
        map.set(prod.category.description, p);
      } else {
        map.set(prod.category.description, [prod]);
      }
    }
    return map;
  }
}
