import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Commerce from 'src/app/models/db/commerce';
import { CustomerStoreService } from 'src/app/services/customer-store.service';
import { StoreService } from 'src/app/services/store.service';
import { pathRoute } from 'src/app/utils/commons.function';
import { ROUTES } from 'src/app/utils/routes';

@Component({
  selector: 'eu-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {
  headerStyle = {
    opacity: 1,
    height: '160px',
    'max-height': '160px',
    'background-color': 'white',
  };
  titleStyle = {
    opacity: 1,
    top: '48px',
    left: '24px',
    'font-size': '18px',
  };

  commerce: Commerce = this.activedRoute.snapshot.data.commerce;
  editEnable = false;
  deliveryMin = this.store.appState.deliveryFees.sort((a, b) =>
    a.price > b.price ? 1 : b.price > a.price ? -1 : 0
  )[0].price;
  order = this.customerStore.order;
  selectedsByDelete: number[] = [];
  topSize = '160px';

  constructor(
    private activedRoute: ActivatedRoute,
    private customerStore: CustomerStoreService,
    private router: Router,
    private store: StoreService
  ) {}

  async ngOnInit(): Promise<void> {
    if (this.order.products.length === 0) {
      this.goBack();
      return;
    }
  }

  @HostListener('document:scroll', ['$event'])
  onScroll(): void {
    if (document.documentElement.scrollTop > 1) {
      this.titleStyle = {
        opacity: 1,
        top: '13px',
        left: '56px',
        'font-size': '14px',
      };
      this.topSize = '128px';
      this.headerStyle = {
        opacity: 1,
        height: this.topSize,
        'max-height': '128px',
        'background-color': 'white',
      };
    } else {
      this.titleStyle = {
        opacity: 1,
        top: '48px',
        left: '24px',
        'font-size': '18px',
      };
      this.topSize = '160px';
      this.headerStyle = {
        opacity: 1,
        height: this.topSize,
        'max-height': '160px',
        'background-color': 'white',
      };
    }
  }

  goBack(): void {
    this.router.navigate([
      pathRoute([ROUTES.customer.listProducts], {
        commerceUrl: this.commerce.url,
      }),
    ]);
  }

  selectProduct(index: number, value: any): void {
    if (value.target.checked) {
      this.selectedsByDelete.push(index);
    } else {
      const i = this.selectedsByDelete.indexOf(index);
      this.selectedsByDelete.slice(i, 1);
    }
  }

  delete(): void {
    this.selectedsByDelete.sort().reverse();
    let amount = 0;
    this.selectedsByDelete.forEach((indexValue) => {
      amount += this.order.products[indexValue].product.price;
      this.order.products.splice(indexValue, 1);
    });
    this.order.totalAmount -= amount;
    this.customerStore.order = this.order;
    if (this.order.products.length === 0) {
      this.goBack();
    }
    this.selectedsByDelete = [];
  }

  goPayment(): void {
    this.router.navigate([
      pathRoute([ROUTES.customer.listProducts, ROUTES.customer.paymentMethod], {
        commerceUrl: this.commerce.url,
      }),
    ]);
  }
}
