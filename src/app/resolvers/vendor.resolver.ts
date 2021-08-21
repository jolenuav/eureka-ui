import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import Commerce from '../models/db/commerce';
import Product from '../models/db/product';
import { CommerceService } from '../services/firestore/commerce.service';
import { ProductService } from '../services/firestore/product.service';
import { UserService } from '../services/firestore/user.service';
import { StoreService } from '../services/store/store.service';
import { VendorStoreService } from '../services/store/vendor-store.service';

@Injectable()
export abstract class VendorResolver implements Resolve<any> {
  constructor(
    public commerceService: CommerceService,
    public productService: ProductService,
    public store: StoreService,
    public userService: UserService,
    public vendorStore: VendorStoreService
  ) {}

  abstract resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): any;

  async getCommerSelected(commerceId: string): Promise<Commerce> {
    let commerce = this.vendorStore.commerce;
    if (!commerce) {
      commerce = await this.commerceService.findById(commerceId);
      this.vendorStore.commerce = commerce;
    }
    return commerce;
  }

  async getProductById(productId: string): Promise<Product> {
    return await this.productService.findById(productId);
  }
}
