import PaymentMethod from '../payment-method';

export default class PayOrder {
  _paymentType?: number;
  _paymentMethod?: PaymentMethod;
  _payment?: number;

  static parse(obj: any): PayOrder {
    const payOrder = new PayOrder();
    payOrder.paymentType = obj.paymentType;
    payOrder.paymentMethod = obj.paymentMethod ? PaymentMethod.parse(obj.paymentMethod) : null;
    payOrder.payment = obj.payment;
    return payOrder;
  }

  clone(): PayOrder {
    const payOrder = new PayOrder();
    payOrder.paymentType = this.paymentType;
    payOrder.paymentMethod = this.paymentMethod;
    payOrder.payment = this.payment;
    return payOrder;
  }

  getSimpleObject(): any {
    const obj: any = {};
    this.paymentType ? obj.paymentType = this.paymentType : delete obj.paymentType;
    this.paymentMethod ? obj.paymentMethod = this.paymentMethod.getSimpleObject() : delete obj.paymentMethod;
    this.payment ? obj.payment = this.payment : delete obj.payment;
    return obj;
  }

  constructor() {}

  get paymentType(): number {
    return this._paymentType;
  }
  set paymentType(paymentType: number) {
    this._paymentType = paymentType;
  }

  get paymentMethod(): PaymentMethod {
    return this._paymentMethod;
  }
  set paymentMethod(paymentMethod: PaymentMethod) {
    this._paymentMethod = paymentMethod;
  }

  get payment(): number {
    return this._payment;
  }
  set payment(payment: number) {
    this._payment = payment;
  }
}
