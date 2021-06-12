import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import ItemOrder from 'src/app/models/db/order/item-order';
import Commerce from 'src/app/models/db/commerce';
import Product from 'src/app/models/db/product';
import { CustomerStoreService } from 'src/app/services/customer-store.service';
import { pathRoute } from 'src/app/utils/commons.function';
import { CONSTANTS } from 'src/app/utils/constants';

@Component({
  selector: 'eu-load-order',
  templateUrl: './load-order.component.html',
  styleUrls: ['./load-order.component.scss'],
})
export class LoadOrderComponent implements OnInit {
  amount = 0;
  commerce: Commerce = this.activedRoute.snapshot.data.loadOrder.commerce;
  counter = 1;
  headerStyle;
  maxOrder = 20;
  minOrder = 1;
  observation = '';
  product: Product = this.activedRoute.snapshot.data.loadOrder.product;

  constructor(
    private activedRoute: ActivatedRoute,
    private customerStore: CustomerStoreService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.headerStyle = {
      opacity: 1,
      height: '15rem',
      color: '#f1f1f3',
      'max-height': '15rem',
      'background-image': `linear-gradient(rgba(62, 62, 62, 0), rgba(62, 62, 62, 1) 95%), url("${this.commerce.image}")`,
    };
    this.amount = this.product.price * this.counter;
  }

  goBack(): void {
    this.customerStore.productToOrder = null;
    this.router.navigate([
      pathRoute([CONSTANTS.routes.customer.listProducts], {
        commerceId: this.commerce.id,
      }),
    ]);
  }

  counterHandler(add: boolean): void {
    if (add && this.counter < this.maxOrder) {
      this.counter++;
    }
    if (!add && this.counter > this.minOrder) {
      this.counter--;
    }
    this.amount = this.product.price * this.counter;
  }

  addOrder(): void {
    const item: ItemOrder = new ItemOrder();
    item.product = this.product;
    item.qty = this.counter;
    item.observation = this.observation;
    this.customerStore.loadProductOrder(item);
    this.goBack();
  }
}
