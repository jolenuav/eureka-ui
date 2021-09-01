import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import Additional from 'src/app/models/db/additional';
import Commerce from 'src/app/models/db/commerce';
import ItemOrder from 'src/app/models/db/order/item-order';
import Product from 'src/app/models/db/product';
import Stock from 'src/app/models/db/stock/stock';
import { StockService } from 'src/app/services/firestore/stock.service';
import { CustomerStoreService } from 'src/app/services/store/customer-store.service';
import { pathRoute } from 'src/app/utils/commons.function';
import { ROUTES } from 'src/app/utils/routes';

@Component({
  selector: 'eu-load-order',
  templateUrl: './load-order.component.html',
  styleUrls: ['./load-order.component.scss'],
})
export class LoadOrderComponent implements OnInit {
  amount = 0;
  commerce: Commerce = this.customerStore.commerceSelected;
  counter = 1;
  maxOrder = 20;
  minOrder = 1;
  observation = '';
  product: Product = this.customerStore.productToOrder;
  selectedAdditionals: Additional[] = [];
  selectedIngredients: string[] = [];
  stock: Stock;

  constructor(
    private customerStore: CustomerStoreService,
    public matDialog: MatDialog,
    private router: Router,
    private stockService: StockService
  ) {}

  async ngOnInit(): Promise<void> {
    this.amount = this.product.price * this.counter;

    this.stock = await this.stockService.findByProductId(this.product.id);
    if (
      this.stock &&
      this.stock.total > 0 &&
      this.stock.total < this.maxOrder
    ) {
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
    this.calculateAmount();
  }

  addOrder(): void {
    const item: ItemOrder = new ItemOrder();
    item.productId = this.product.id;
    item.product = this.product;
    item.unit = this.counter;
    item.amountTotal = this.amount;
    item.observation = this.observation;
    item.skipIngredients = this.selectedIngredients;
    item.additionals = this.selectedAdditionals;
    this.customerStore.loadProductOrder(item);
    this.goBack();
  }

  calculateAmount(): void {
    this.amount = 0;
    this.selectedAdditionals.forEach((additional) => {
      this.amount += additional.price;
    });
    const productAmount = this.counter * this.product.price;
    this.amount += productAmount;
  }
}
