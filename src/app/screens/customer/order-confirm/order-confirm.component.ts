import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import Additional from 'src/app/models/db/additional';
import Commerce from 'src/app/models/db/commerce';
import Order from 'src/app/models/db/order/order';
import PayOrder from 'src/app/models/db/order/pay-order';
import PaymentMethod from 'src/app/models/db/payment-method';
import StockMovement from 'src/app/models/db/stock/stock-movement';
import { MovementStock } from 'src/app/models/enums/movement-stock.enum';
import { OrderService } from 'src/app/services/firestore/order.service';
import { StockService } from 'src/app/services/firestore/stock.service';
import { CustomerStoreService } from 'src/app/services/store/customer-store.service';
import { StoreService } from 'src/app/services/store/store.service';
import { generateOrderID, pathRoute } from 'src/app/utils/commons.function';
import { PATTERN } from 'src/app/utils/pattern';
import { ROUTES } from 'src/app/utils/routes';

@Component({
  selector: 'eu-order-confirm',
  templateUrl: './order-confirm.component.html',
  styleUrls: ['./order-confirm.component.scss'],
})
export class OrderConfirmComponent implements OnInit, OnDestroy {
  headerStyle = {
    'opacity': 1,
    'height': '96px',
    'max-height': '96px',
    'background-color': 'white',
  };
  titleStyle = {
    'opacity': 1,
    'top': '48px',
    'left': '24px',
    'font-size': '18px',
  };
  topSize = '96px';

  commerce: Commerce = this.customerStore.commerceSelected;
  deliveryMin = this.store.appState.deliveryFees.sort((a, b) =>
    a.price > b.price ? 1 : b.price > a.price ? -1 : 0
  )[0].price;
  deliveryOption = 'Retirar en local';
  total = this.customerStore.order.totalAmount;
  docTypes = this.store.appState.documentTypes;
  formGroup = new FormGroup({
    address: new FormControl(null, [Validators.required]),
    deliveryPrice: new FormControl('A'),
    name: new FormControl(null, [Validators.required]),
    mail: new FormControl(null, [Validators.pattern(PATTERN.mail)]),
    phone: new FormControl(null, [Validators.required]),
  });
  order = this.customerStore.order;
  orderID = generateOrderID();
  subscriptions: Subscription[] = [];
  constructor(
    private activedRoute: ActivatedRoute,
    private customerStore: CustomerStoreService,
    private orderService: OrderService,
    private router: Router,
    private store: StoreService,
    private stockService: StockService
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
    this._subscriptions();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((element) => element.unsubscribe());
  }

  _subscriptions(): void {
    this.subscriptions = [
      this.formGroup.controls.deliveryPrice.valueChanges.subscribe((value) => {
        if (value === 'A') {
          this.total = this.order.totalAmount;
          this.deliveryOption = 'Retirar en local';
        } else {
          this.total = this.deliveryMin + this.order.totalAmount;
          this.deliveryOption = 'Entrega inmdediata';
        }
      }),
    ];
  }

  goBack(): void {
    this.router.navigate([
      pathRoute([ROUTES.customer.listProducts, ROUTES.customer.paymentMethod], {
        commerceUrl: this.commerce.url,
      }),
    ]);
  }

  async confirmOrder(): Promise<void> {
    const phoneDelivery = 584125937999;
    this.order.id = this.orderID;
    this.order.date = new Date();
    this.order.deliveryData.name = this.formGroup.controls.name.value;
    this.order.deliveryData.phone = this.formGroup.controls.phone.value;
    this.order.deliveryData.email = this.formGroup.controls.mail.value;
    this.order.deliveryData.address = this.formGroup.controls.address.value;
    let additionals: Additional[] = [];
    this.order.products.forEach((prod) => {
      prod.additionals?.forEach((add) => {
        const additional = Additional.parse(add);
        additionals.push(additional);
      });
      prod.additionals = [...additionals];
      additionals = [];
    });

    await this.saveOrder();
    window.open(
      `whatsapp://send?phone=${
        this.formGroup.controls.deliveryPrice.value === 'A'
          ? this.commerce.phone
          : phoneDelivery
      }&text=${this.getMessage()}`,
      '_blank'
    );
    this.customerStore.loadPaymentMathodToOrder(new PayOrder());
    this.customerStore.order = new Order();
    this.customerStore.commerceSelected = null;
    this.router.navigate([pathRoute([ROUTES.commerces])]);
  }

  async saveOrder(): Promise<void> {
    for await (const item of this.order.products) {
      if (item.product.stock) {
        const stock = await this.stockService.findByProductId(item.product.id);
        if (stock.total >= item.unit) {
          const movement = new StockMovement();
          movement.date = new Date();
          movement.quantity = item.unit;
          movement.type = MovementStock.REDUCE;
          movement.user = 'Eureka!';
          stock.total -= item.unit;
          stock.movements.push(movement);
          this.stockService.update(stock);
        }
      }
    }
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
      products += `- ${item.unit} ${
        item.product.name
      } *$${item.product.price.toFixed(2)}*%0A`;
      if (item.additionals && item.additionals.length > 0) {
        products += `%09*Adicionales*%0A`;
        item.additionals.forEach((additional) => {
          products += `%09%09_${additional.description} *$${additional.price}*_%0A`;
        });
      }
      if (item.skipIngredients && item.skipIngredients.length > 0) {
        products += `%09*Sin ingredientes*%0A`;
        item.skipIngredients.forEach((ingredient) => {
          products += `%09%09_${ingredient}_%0A`;
        });
      }
      if (item.observation !== '') {
        products += `%09%09_${item.observation}_%0A`;
      }
    });

    let text = `*${orderID}*%0AHola *${
      this.formGroup.controls.deliveryPrice.value === 'A'
        ? this.commerce.name
        : 'Eureka!'
    }*, `;
    text += `Soy ${this.formGroup.controls.name.value} `;
    text += `y quiero hacer el siguiente pedido:%0A${products}`;
    text += `Total orden *$${this.order.totalAmount.toFixed(2)}*%0A%0A`;
    text += `*La direccion es:*%0A_${this.formGroup.controls.address.value}_%0A%0A`;
    text += `*Forma de pago:* _${paymentType.description}_%0A`;
    text += `${paymentMethod}%0A`;
    text += `*Forma de envío:* _${this.deliveryOption}_%0A`;
    text = text.replace(/,/g, '%2C');
    text = text.replace(/ /g, '%20');
    return text;
  }

  @HostListener('document:scroll', ['$event'])
  onScroll(): void {
    if (document.documentElement.scrollTop > 1) {
      this.titleStyle = {
        'opacity': 1,
        'top': '13px',
        'left': '56px',
        'font-size': '14px',
      };
      this.topSize = '48px';
      this.headerStyle = {
        'opacity': 1,
        'height': this.topSize,
        'max-height': this.topSize,
        'background-color': 'white',
      };
    } else {
      this.titleStyle = {
        'opacity': 1,
        'top': '48px',
        'left': '24px',
        'font-size': '18px',
      };
      this.topSize = '96px';
      this.headerStyle = {
        'opacity': 1,
        'height': this.topSize,
        'max-height': this.topSize,
        'background-color': 'white',
      };
    }
  }
}
