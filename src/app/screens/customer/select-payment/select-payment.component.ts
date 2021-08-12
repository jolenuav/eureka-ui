import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Commerce from 'src/app/models/db/commerce';
import DeliveryData from 'src/app/models/db/order/delivery-data';
import PayOrder from 'src/app/models/db/order/pay-order';
import PaymentMethod from 'src/app/models/db/payment-method';
import { CustomerStoreService } from 'src/app/services/customer-store.service';
import { StoreService } from 'src/app/services/store.service';
import { pathRoute } from 'src/app/utils/commons.function';
import { ROUTES } from 'src/app/utils/routes';

@Component({
  selector: 'eu-select-payment',
  templateUrl: './select-payment.component.html',
  styleUrls: ['./select-payment.component.scss'],
})
export class SelectPaymentComponent implements OnInit {
  headerStyle = {
    opacity: 1,
    height: '112px',
    'max-height': '112px',
    'background-color': 'white',
  };
  titleStyle = {
    opacity: 1,
    top: '48px',
    left: '24px',
    'font-size': '18px',
  };
  cashCheck = true;
  cashIsCollapsed = true;
  commerce: Commerce = this.activedRoute.snapshot.data.selectPayment.commerce;
  delivery = this.store.appState.deliveryFees.sort((a, b) =>
    a.price > b.price ? 1 : b.price > a.price ? -1 : 0
  )[0].price;
  order = this.customerStore.order;
  payMobileData: PaymentMethod[] = [];
  paymentMethodSelected: PaymentMethod;
  paymentMethods: PaymentMethod[] =
    this.activedRoute.snapshot.data.selectPayment.paymentMethods;
  paymentMethodsId: string;
  payMobileCheck = false;
  payMobileIsCollapsed = true;
  payOrder = this.customerStore.order.payOrder;
  topSize = '112px';
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
        top: '13px',
        left: '56px',
        'font-size': '14px',
      };
      this.topSize = '80px';
      this.headerStyle = {
        opacity: 1,
        height: this.topSize,
        'max-height': this.topSize,
        'background-color': 'white',
      };
    } else {
      this.titleStyle = {
        opacity: 1,
        top: '48px',
        left: '24px',
        'font-size': '18px',
      };
      this.topSize = '112px';
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
      pathRoute([ROUTES.customer.listProducts, ROUTES.customer.order], {
        commerceUrl: this.commerce.url,
      }),
    ]);
  }

  goNext(): void {
    this.customerStore.order.deliveryData = new DeliveryData();
    this.router.navigate([
      pathRoute([ROUTES.customer.listProducts, ROUTES.customer.orderConfirm], {
        commerceUrl: this.commerce.url,
      }),
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
