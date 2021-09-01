import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import Commerce from '../models/db/commerce';
import PaymentMethod from '../models/db/payment-method';
import Product from '../models/db/product';
import { CategoryService } from '../services/firestore/category.service';
import { CommerceService } from '../services/firestore/commerce.service';
import { PaymentMethodsService } from '../services/firestore/paymenth-methods.service';
import { ProductService } from '../services/firestore/product.service';
import { StockService } from '../services/firestore/stock.service';
import { CustomerStoreService } from '../services/store/customer-store.service';
import { StoreService } from '../services/store/store.service';

@Injectable()
export abstract class CustomerResolver implements Resolve<any> {
  constructor(
    public categoryService: CategoryService,
    public commerceService: CommerceService,
    public customerStore: CustomerStoreService,
    public paymentMethodService: PaymentMethodsService,
    public productService: ProductService,
    public router: Router,
    public stockService: StockService,
    public store: StoreService
  ) {}

  abstract resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): any;

  async getCommerSelected(commerceUrl: string): Promise<void> {
    if (!this.customerStore.commerceSelected) {
      this.customerStore.commerceSelected =
        await this.commerceService.findByUrl(commerceUrl);
    }
  }

  async getCommerById(commerceId: string): Promise<Commerce> {
    return await this.commerceService.findById(commerceId);
  }

  async getProductByCommerceId(commerceId: string): Promise<void> {
    if (this.customerStore.products.length === 0) {
      this.customerStore.products = await this.productService.findByCommerceId(
        commerceId
      );
    }
  }

  async cleanProducts(productsState): Promise<Product[]> {
    const products: Product[] = [];
    for await (const product of productsState) {
      if (product.stock) {
        const stock = await this.stockService.findByProductId(product.id);
        if (stock && stock.total > 0) {
          products.push(product.clone());
        }
      } else {
        products.push(product.clone());
      }
    }
    return products;
  }

  async getCatalogByCommerceId(commeceId: string): Promise<void> {
    if (this.customerStore.categories.length === 0) {
      const categories = await this.categoryService.findByCommerceId(commeceId);
      categories.forEach((category) =>
        category.subCategories?.sort(
          (subCategoryA, subCategoryB) =>
            subCategoryA.order - subCategoryB.order
        )
      );
      categories.sort(
        (categoryA, categoryB) => categoryA.order - categoryB.order
      );
      this.customerStore.categories = categories;
    }
  }

  async getProductToOrder(productId: string): Promise<void> {
    if (!this.customerStore.productToOrder) {
      this.customerStore.productToOrder = await this.productService.findById(
        productId
      );
    }
  }

  async getPaymentMethodByCommerceSelected(
    commerceId: string
  ): Promise<PaymentMethod[]> {
    const paymentMethods = await this.paymentMethodService.findByCommerceId(
      commerceId
    );
    return paymentMethods;
  }
}
