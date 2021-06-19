import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Commerce from 'src/app/models/db/commerce';
import Order from 'src/app/models/db/order/order';
import PayOrder from 'src/app/models/db/order/pay-order';
import PaymentMethod from 'src/app/models/db/payment-method';
import { CustomerStoreService } from 'src/app/services/customer-store.service';
import { OrderService } from 'src/app/services/firestore/order.service';
import { StoreService } from 'src/app/services/store.service';
import { generateOrderID, pathRoute } from 'src/app/utils/commons.function';
import { CONSTANTS } from 'src/app/utils/constants';
import { PATTERN } from 'src/app/utils/pattern';

@Component({
  selector: 'eu-order-confirm',
  templateUrl: './order-confirm.component.html',
  styleUrls: ['./order-confirm.component.scss'],
})
export class OrderConfirmComponent implements OnInit {
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
  topSize = '6rem';

  commerce: Commerce = this.activedRoute.snapshot.data.commerce;
  deliveryMin = this.store.appState.deliveryFees.sort((a, b) =>
    a.priceMin > b.priceMin ? 1 : b.priceMin > a.priceMin ? -1 : 0
  )[0].priceMin;
  total = this.deliveryMin + this.customerStore.order.totalAmount;
  docTypes = this.store.appState.documentTypes;
  formGroup = new FormGroup({
    address: new FormControl(null, [Validators.required]),
    name: new FormControl(null, [Validators.required]),
    mail: new FormControl(null, [Validators.pattern(PATTERN.mail)]),
    phone: new FormControl(null, [Validators.required]),
  });
  order = this.customerStore.order;
  orderID = generateOrderID();
  constructor(
    private activedRoute: ActivatedRoute,
    private customerStore: CustomerStoreService,
    private orderService: OrderService,
    private router: Router,
    private store: StoreService
  ) {}

  async ngOnInit(): Promise<void> {
    if (!this.order || this.order?.products.length === 0) {
      this.router.navigate([
        pathRoute([CONSTANTS.routes.customer.listProducts], {
          commerceUrl: this.commerce.url,
        }),
      ]);
      return;
    }
  }

  goBack(): void {
    this.router.navigate([
      pathRoute(
        [
          CONSTANTS.routes.customer.listProducts,
          CONSTANTS.routes.customer.paymentMethod,
        ],
        { commerceUrl: this.commerce.url }
      ),
    ]);
  }

  async confirmOrder(): Promise<void> {
    this.order.id = this.orderID;
    this.order.date = new Date();
    this.order.deliveryData.name = this.formGroup.controls.name.value;
    this.order.deliveryData.phone = this.formGroup.controls.phone.value;
    this.order.deliveryData.email = this.formGroup.controls.mail.value;
    this.order.deliveryData.address = this.formGroup.controls.address.value;

    await this.saveOrder();
    window.open(
      `whatsapp://send?phone=584125937999&text=${this.getMessage()}`,
      '_blank'
    );
    this.customerStore.loadPaymentMathodToOrder(new PayOrder());
    this.customerStore.order = new Order();
    this.customerStore.commerceSelected = null;
    this.router.navigate([pathRoute([CONSTANTS.routes.commerces])]);
  }

  async saveOrder(): Promise<void> {
    await this.orderService.save(this.order);
  }

  getMessage(): string {
    const orderID = `%23${this.orderID}`;
    let products = '';
    let paymentMethod = '';

    const paymentType = PaymentMethod.LIST.find(
      (item) => item.id === this.order.payOrder.paymentType
    );

    if (paymentType.id === PaymentMethod.CASH && this.order.payOrder.payment) {
      paymentMethod += `Voy a pagar con *$${this.order.payOrder.payment}*`;
    }

    if (paymentType.id !== PaymentMethod.CASH) {
      paymentMethod += `- ${this.order.payOrder.paymentMethod.accountName}%0A`;
      paymentMethod += `- ${this.order.payOrder.paymentMethod.accountNumber}%0A`;
      paymentMethod += `- ${this.order.payOrder.paymentMethod.ownerName}%0A`;
      const docType = this.docTypes.find(
        (item) => item.id === this.order.payOrder.paymentMethod.ownerDocType
      );
      paymentMethod += `- ${docType.prefix} ${this.order.payOrder.paymentMethod.ownerDocument}`;
    }

    this.order.products.forEach((item) => {
      products += `- ${item.qty} ${
        item.product.name
      } ($${item.product.price.toFixed(1)})%0A`;
      if (item.observation !== '') {
        products += `%09%09_${item.observation}_%0A`;
      }
    });
    let text = `*${orderID}*%0AHola *Eureka!*, `;
    text += `Soy ${this.formGroup.controls.name.value} `;
    text += `y quiero hacer el siguiente pedido:%0A${products}`;
    text += `Total orden *$${this.order.totalAmount.toFixed(1)}*%0A%0A`;
    text += `*La direccion es:*%0A_${this.formGroup.controls.address.value}_%0A%0A`;
    text += `*Forma de pago:* _${paymentType.description}_%0A`;
    text += `${paymentMethod}`;
    text = text.replace(',', '%2C').replace(' ', '%20');
    return text;
  }
}
