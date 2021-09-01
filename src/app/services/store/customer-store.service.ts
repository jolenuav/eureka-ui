import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import Category from 'src/app/models/db/categories/category';
import Commerce from 'src/app/models/db/commerce';
import ItemOrder from 'src/app/models/db/order/item-order';
import Order from 'src/app/models/db/order/order';
import PayOrder from 'src/app/models/db/order/pay-order';
import Product from 'src/app/models/db/product';

@Injectable({
  providedIn: 'root',
})
export class CustomerStoreService {
  _categories = new BehaviorSubject<Category[]>([]);
  _commerceSelected = new BehaviorSubject<Commerce>(null);
  _products = new BehaviorSubject<Product[]>([]);
  _productToOrder = new BehaviorSubject<Product>(null);
  _order = new BehaviorSubject<Order>(new Order());

  constructor() {}

  get products(): Product[] {
    return this._products.value;
  }
  set products(products: Product[]) {
    this._products.next(products);
  }

  get categories(): Category[] {
    return this._categories.value;
  }
  set categories(categories: Category[]) {
    this._categories.next(categories);
  }

  get commerceSelected(): Commerce {
    return this._commerceSelected.value;
  }
  set commerceSelected(commerce: Commerce) {
    this._commerceSelected.next(commerce);
  }

  get productToOrder(): Product {
    return this._productToOrder.value;
  }
  set productToOrder(product: Product) {
    this._productToOrder.next(product);
  }

  get order(): Order {
    return this._order.value;
  }
  set order(order: Order) {
    this._order.next(order);
  }

  loadProductOrder(item: ItemOrder): void {
    this.order.products.push(item);
    let totalAmount = 0;
    this.order.products.forEach((itemProd) => {
      totalAmount += itemProd.amountTotal;
    });
    this.order.totalAmount = totalAmount;
  }

  loadPaymentMathodToOrder(payOrder: PayOrder): void {
    this.order.payOrder = payOrder;
  }

  clearInCatalog(): void {
    this.commerceSelected = null;
    this.order = new Order();
    this.products = [];
  }
}
