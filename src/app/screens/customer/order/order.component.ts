import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Commerce from 'src/app/models/db/commerce';
import { CustomerStoreService } from 'src/app/services/customer-store.service';
import { CommerceService } from 'src/app/services/firestore/commerce.service';
import { ProductService } from 'src/app/services/firestore/product.service';
import { StoreService } from 'src/app/services/store.service';
import { pathRoute } from 'src/app/utils/commons.function';
import { CONSTANTS } from 'src/app/utils/constants';
import { ROUTES } from 'src/app/utils/routes';

@Component({
  selector: 'eu-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {
  headerStyle = {
    opacity: 1,
    height: '10rem',
    'max-height': '10rem',
    'background-color': 'white',
  };
  titleStyle = {
    opacity: 1,
    top: '3rem',
    left: '1.5rem',
    'font-size': '18px',
  };

  commerce: Commerce = this.activedRoute.snapshot.data.commerce;
  editEnable = false;
  deliveryMin = this.store.appState.deliveryFees.sort((a, b) =>
    a.priceMin > b.priceMin ? 1 : b.priceMin > a.priceMin ? -1 : 0
  )[0].priceMin;
  order = this.customerStore.order;
  selectedsByDelete: number[] = [];
  topSize = '10rem';

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
        top: '0.8rem',
        left: '3.5rem',
        'font-size': '14px',
      };
      this.topSize = '8rem';
      this.headerStyle = {
        opacity: 1,
        height: this.topSize,
        'max-height': '8rem',
        'background-color': 'white',
      };
    } else {
      this.titleStyle = {
        opacity: 1,
        top: '3rem',
        left: '1.5rem',
        'font-size': '18px',
      };
      this.topSize = '10rem';
      this.headerStyle = {
        opacity: 1,
        height: this.topSize,
        'max-height': '10rem',
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
      pathRoute(
        [
          ROUTES.customer.listProducts,
          ROUTES.customer.paymentMethod,
        ],
        { commerceUrl: this.commerce.url }
      ),
    ]);
  }
}
