import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import Commerce from '../models/db/commerce';
import PaymentMethod from '../models/db/payment-method';
import Product from '../models/db/product';
import { CustomerStoreService } from '../services/customer-store.service';
import { CommerceService } from '../services/firestore/commerce.service';
import { PaymentMethodsService } from '../services/firestore/paymenth-methods.service';
import { ProductService } from '../services/firestore/product.service';
import { StockService } from '../services/firestore/stock.service';
import { StoreService } from '../services/store.service';

@Injectable()
export abstract class CustomerResolver implements Resolve<any> {
  constructor(
    public commerceService: CommerceService,
    public customerStore: CustomerStoreService,
    public paymentMethodService: PaymentMethodsService,
    public productService: ProductService,
    public stockService: StockService,
    public store: StoreService
  ) {}

  abstract resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): any;

  async getCommerSelected(commerceUrl: string): Promise<Commerce> {
    let commerce = this.customerStore.commerceSelected;
    if (!commerce) {
      commerce = await this.commerceService.findByUrl(commerceUrl);
      this.customerStore.commerceSelected = commerce;
    }
    return commerce;
  }

  async getCommerById(commerceId: string): Promise<Commerce> {
    return await this.commerceService.findById(commerceId);
  }

  async getProductByCommerceId(commerceId: string): Promise<Product[]> {
    let products: Product[] = this.customerStore.products;
    if (products.length === 0) {
      products = await this.productService.findByCommerceIdAndEnabled(commerceId);
      const productsEnabled = await this.cleanProducts(products);
      this.customerStore.products = productsEnabled;
    }
    return products;
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

  async getProductToOrder(productId: string): Promise<Product> {
    let product = this.customerStore.productToOrder;
    if (!product) {
      product = await this.productService.findById(productId);
      this.customerStore.productToOrder = product;
    }
    return product;
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
