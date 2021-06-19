import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import PayOrder from 'src/app/models/db/order/pay-order';
import Commerce from 'src/app/models/db/commerce';
import PaymentMethod from 'src/app/models/db/payment-method';
import { CustomerStoreService } from 'src/app/services/customer-store.service';
import { StoreService } from 'src/app/services/store.service';
import { pathRoute } from 'src/app/utils/commons.function';
import { CONSTANTS } from 'src/app/utils/constants';
import DeliveryData from 'src/app/models/db/order/delivery-data';
import { ROUTES } from 'src/app/utils/routes';

@Component({
  selector: 'eu-select-payment',
  templateUrl: './select-payment.component.html',
  styleUrls: ['./select-payment.component.scss'],
})
export class SelectPaymentComponent implements OnInit {
  headerStyle = {
    opacity: 1,
    height: '6rem',
    'max-height': '6rem',
    'background-color': 'white',
  };
  titleStyle = {
    opacity: 1,
    top: '3rem',
    left: '1.5rem',
    'font-size': '18px',
  };
  cashCheck = true;
  cashIsCollapsed = true;
  commerce: Commerce = this.activedRoute.snapshot.data.selectPayment.commerce;
  deliveryMin = this.store.appState.deliveryFees.sort((a, b) =>
    a.priceMin > b.priceMin ? 1 : b.priceMin > a.priceMin ? -1 : 0
  )[0].priceMin;
  order = this.customerStore.order;
  payMobileData: PaymentMethod[] = [];
  paymentMethodSelected: PaymentMethod;
  paymentMethods: PaymentMethod[] =
    this.activedRoute.snapshot.data.selectPayment.paymentMethods;
  paymentMethodsId: string;
  payMobileCheck = false;
  payMobileIsCollapsed = true;
  payOrder = this.customerStore.order.payOrder;
  topSize = '6rem';
  transferCheck = false;
  transferIsCollapsed = true;
  transferData: PaymentMethod[] = [];

  constructor(
    private activedRoute: ActivatedRoute,
    private customerStore: CustomerStoreService,
    private router: Router,
    private store: StoreService
  ) {}

  async ngOnInit(): Promise<void> {
    if (!this.order || this.order?.products.length === 0) {
      this.router.navigate([
        pathRoute([ROUTES.customer.listProducts], {
          commerceUrl: this.commerce.url,
        }),
      ]);
      return;
    }
    await this.orderPaymentMethods();
    await this.loadDataSaved();
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
      this.topSize = '3rem';
      this.headerStyle = {
        opacity: 1,
        height: this.topSize,
        'max-height': this.topSize,
        'background-color': 'white',
      };
    } else {
      this.titleStyle = {
        opacity: 1,
        top: '3rem',
        left: '1.5rem',
        'font-size': '18px',
      };
      this.topSize = '6rem';
      this.headerStyle = {
        opacity: 1,
        height: this.topSize,
        'max-height': this.topSize,
        'background-color': 'white',
      };
    }
  }

  goBack(): void {
    this.customerStore.loadPaymentMathodToOrder(new PayOrder());
    this.router.navigate([
      pathRoute(
        [
          ROUTES.customer.listProducts,
          ROUTES.customer.order,
        ],
        { commerceUrl: this.commerce.url, }
      ),
    ]);
  }

  goNext(): void {
    this.customerStore.order.deliveryData = new DeliveryData();
    this.router.navigate([
      pathRoute(
        [
          ROUTES.customer.listProducts,
          ROUTES.customer.orderConfirm,
        ],
        { commerceUrl: this.commerce.url, }
      ),
    ]);
  }

  skip(): void {
    const payOrder = new PayOrder();
    payOrder.paymentType = PaymentMethod.CASH;
    payOrder.payment = null;
    this.customerStore.loadPaymentMathodToOrder(payOrder);
    this.goNext();
  }

  confirmPayment(): void {
    this.customerStore.loadPaymentMathodToOrder(this.payOrder);
    this.goNext();
  }

  changeCheckbox(): void {
    this.paymentMethodsId = null;
    this.payOrder.paymentMethod = null;
    if (this.transferCheck) {
      this.payOrder.paymentType = PaymentMethod.TRANSFER;
    } else if (this.payMobileCheck) {
      this.payOrder.paymentType = PaymentMethod.MOBILE;
    } else if (this.cashCheck) {
      this.payOrder.paymentType = PaymentMethod.CASH;
    } else if (!this.payOrder.paymentMethod) {
      this.cashIsCollapsed = true;
    }
    this.payOrder.paymentMethod = null;
    this.payOrder.payment = null;
  }

  paymentMethodChange(): void {
    this.payOrder.paymentMethod = this.paymentMethods.find(
      (item) => item.id === this.paymentMethodsId
    );
  }

  async orderPaymentMethods(): Promise<void> {
    for await (const item of this.paymentMethods) {
      if (item.type === PaymentMethod.TRANSFER) {
        this.transferData.push(item);
      }
      if (item.type === PaymentMethod.MOBILE) {
        this.payMobileData.push(item);
      }
    }
  }

  async loadDataSaved(): Promise<void> {
    this.paymentMethodsId = this.payOrder.paymentMethod?.id;
    switch (this.payOrder.paymentType) {
      case PaymentMethod.TRANSFER:
        this.transferCheck = true;
        this.transferIsCollapsed = false;
        this.cashCheck = false;
        break;
      case PaymentMethod.MOBILE:
        this.payMobileCheck = true;
        this.payMobileIsCollapsed = false;
        this.cashCheck = false;
        break;
      case PaymentMethod.CASH:
        this.cashCheck = true;
        if (this.payOrder.payment) {
          this.cashIsCollapsed = false;
        }
        break;
      default:
        this.cashCheck = true;
        if (this.payOrder.payment) {
          this.cashIsCollapsed = false;
        }
        this.payOrder.paymentType = PaymentMethod.CASH;
        break;
    }
  }

  disableNext(): boolean {
    if (
      (this.payOrder.paymentType === PaymentMethod.TRANSFER ||
        this.payOrder.paymentType === PaymentMethod.MOBILE) &&
      !this.payOrder.paymentMethod
    ) {
      return true;
    }
  }
}
