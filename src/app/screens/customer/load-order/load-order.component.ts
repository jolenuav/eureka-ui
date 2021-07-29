import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Commerce from 'src/app/models/db/commerce';
import ItemOrder from 'src/app/models/db/order/item-order';
import Product from 'src/app/models/db/product';
import Stock from 'src/app/models/db/stock/stock';
import { CustomerStoreService } from 'src/app/services/customer-store.service';
import { StockService } from 'src/app/services/firestore/stock.service';
import { pathRoute } from 'src/app/utils/commons.function';
import { ROUTES } from 'src/app/utils/routes';

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
  stock: Stock;

  constructor(
    private activedRoute: ActivatedRoute,
    private customerStore: CustomerStoreService,
    private router: Router,
    private stockService: StockService
  ) {}

  async ngOnInit(): Promise<void> {
    this.headerStyle = {
      opacity: 1,
      height: '15rem',
      color: '#f1f1f3',
      'max-height': '15rem',
      'background-image': `linear-gradient(rgba(62, 62, 62, 0), rgba(62, 62, 62, 1) 95%), url("${
        this.product.image ? this.product.image : this.commerce.image
      }")`,
    };
    this.amount = this.product.price * this.counter;

    this.stock = await this.stockService.findByProductId(this.product.id);
    if (this.stock.total > 0 && this.stock.total < this.maxOrder) {
      this.maxOrder = this.stock.total;
    }
  }

  goBack(): void {
    this.customerStore.productToOrder = null;
    this.router.navigate([
      pathRoute([ROUTES.customer.listProducts], {
        commerceUrl: this.commerce.url,
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
