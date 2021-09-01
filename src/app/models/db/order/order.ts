import { CONSTANTS } from 'src/app/utils/constants';
import DeliveryData from './delivery-data';
import ItemOrder from './item-order';
import PayOrder from './pay-order';

export default class Order {
  _id: string;
  _commerce: string;
  _commerceName: string;
  _date: Date;
  _deliveryData: DeliveryData;
  _payOrder: PayOrder;
  _products: ItemOrder[];
  _status: string;
  _totalAmount: number;

  static parse(obj: any): Order {
    const order = new Order();
    order.id = obj.id;
    order.date = obj.date;
    order.commerce = obj.commerce;
    order.commerceName = obj.commerceName;
    order.deliveryData = obj.deliveryData
      ? DeliveryData.parse(obj.deliveryData)
      : null;
    order.payOrder = obj.payOrder ? PayOrder.parse(obj.payOrder) : null;
    order.products =
      obj.products && obj.products.length > 0
        ? obj.products.map((item) => {
            return ItemOrder.parse(item);
          })
        : [];
    order.status = obj.status;
    order.totalAmount = obj.totalAmount;
    return order;
  }

  clone(): Order {
    const order = new Order();
    order.id = this.id;
    order.date = this.date;
    order.commerce = this.commerce;
    order.commerceName = this.commerceName;
    order.deliveryData = this.deliveryData;
    order.payOrder = this.payOrder;
    order.products = this.products;
    order.status = this.status;
    order.totalAmount = this.totalAmount;
    return order;
  }

  getSimpleObject(): any {
    const obj: any = {};
    this.id ? (obj.id = this.id) : delete obj.id;
    this.date ? (obj.date = this.date) : delete obj.date;
    this.commerce ? (obj.commerce = this.commerce) : delete obj.commerce;
    this.commerceName
      ? (obj.commerceName = this.commerceName)
      : delete obj.commerceName;
    this.deliveryData
      ? (obj.deliveryData = this.deliveryData.getSimpleObject())
      : delete obj.deliveryData;
    this.payOrder
      ? (obj.payOrder = this.payOrder.getSimpleObject())
      : delete obj.payOrder;
    this.products.length > 0
      ? (obj.products = this.products.map((p) => p.getSimpleObject()))
      : delete obj.products;
    this.status ? (obj.status = this.status) : delete obj.status;
    this.totalAmount
      ? (obj.totalAmount = this.totalAmount)
      : delete obj.totalAmount;
    return obj;
  }

  constructor() {
    this.id = null;
    this.commerce = null;
    this.commerceName = null;
    this.deliveryData = new DeliveryData();
    this.products = [];
    this.totalAmount = 0;
    this.status = CONSTANTS.status.diff.id;
    this.payOrder = new PayOrder();
  }

  get id(): string {
    return this._id;
  }
  set id(id: string) {
    this._id = id;
  }

  get commerce(): string {
    return this._commerce;
  }
  set commerce(commerce: string) {
    this._commerce = commerce;
  }

  get commerceName(): string {
    return this._commerceName;
  }
  set commerceName(commerceName: string) {
    this._commerceName = commerceName;
  }

  get date(): Date {
    return this._date;
  }
  set date(date: Date) {
    this._date = date;
  }

  get deliveryData(): DeliveryData {
    return this._deliveryData;
  }
  set deliveryData(deliveryData: DeliveryData) {
    this._deliveryData = deliveryData;
  }

  get payOrder(): PayOrder {
    return this._payOrder;
  }
  set payOrder(prods: PayOrder) {
    this._payOrder = prods;
  }

  get products(): ItemOrder[] {
    return this._products;
  }
  set products(products: ItemOrder[]) {
    this._products = products;
  }

  get status(): string {
    return this._status;
  }
  set status(status: string) {
    this._status = status;
  }

  get totalAmount(): number {
    return this._totalAmount;
  }
  set totalAmount(amount: number) {
    this._totalAmount = amount;
  }
}
