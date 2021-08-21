import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import Commerce from 'src/app/models/db/commerce';
import ItemOrder from 'src/app/models/db/order/item-order';
import Order from 'src/app/models/db/order/order';
import PayOrder from 'src/app/models/db/order/pay-order';
import Product from 'src/app/models/db/product';

@Injectable({
  providedIn: 'root',
})
export class CustomerStoreService {
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
    const prods = this.order.products;
    prods.push(item);
    let totalAmount = 0;
    prods.forEach((prod) => {
      const amount = prod.product.price * prod.qty;
      totalAmount += amount;
    });
    this.order.products = prods;
    this.order.totalAmount = totalAmount;
  }

  loadPaymentMathodToOrder(payOrder: PayOrder): void {
    this.order.payOrder = payOrder;
  }
}
