import GenericModel from '../app/generic-model';

export default class PaymentMethod {
  static TRANSFER = 1;
  static MOBILE = 2;
  static CASH = 3;
  static LIST = [
    GenericModel.parse({
      id: PaymentMethod.CASH,
      description: 'Efectivo',
    }),
    GenericModel.parse({
      id: PaymentMethod.MOBILE,
      description: 'Pago Móvil',
    }),
    GenericModel.parse({
      id: PaymentMethod.TRANSFER,
      description: 'Transferencia',
    }),
  ];

  _id: string;
  _accountName: string;
  _accountNumber: number;
  _commerce: string;
  _ownerDocType: string;
  _ownerDocument: number;
  _ownerName: string;
  _type: number;

  static parse(obj: any): PaymentMethod {
    const paymentMethod = new PaymentMethod();
    paymentMethod.id = obj.id;
    paymentMethod.accountName = obj.accountName;
    paymentMethod.accountNumber = obj.accountNumber;
    paymentMethod.commerce = obj.commerce;
    paymentMethod.ownerDocType = obj.ownerDocType;
    paymentMethod.ownerDocument = obj.ownerDocument;
    paymentMethod.ownerName = obj.ownerName;
    paymentMethod.type = obj.type;
    return paymentMethod;
  }

  clone(): PaymentMethod {
    const paymentMethod = new PaymentMethod();
    paymentMethod.id = this.id;
    paymentMethod.accountName = this.accountName;
    paymentMethod.accountNumber = this.accountNumber;
    paymentMethod.commerce = this.commerce;
    paymentMethod.ownerDocType = this.ownerDocType;
    paymentMethod.ownerDocument = this.ownerDocument;
    paymentMethod.ownerName = this.ownerName;
    paymentMethod.type = this.type;
    return paymentMethod;
  }

  getSimpleObject(): any {
    const obj: any = {};
    this.id ? obj.id = this.id : delete obj.id;
    this.accountName ? obj.accountName = this.accountName : delete obj.accountName;
    this.accountNumber ? obj.accountNumber = this.accountNumber : delete obj.accountNumber;
    this.commerce ? obj.commerce = this.commerce : delete obj.commerce;
    this.ownerDocType ? obj.ownerDocType = this.ownerDocType : delete obj.ownerDocType;
    this.ownerDocument ? obj.ownerDocument = this.ownerDocument : delete obj.ownerDocument;
    this.ownerName ? obj.ownerName = this.ownerName : delete obj.ownerName;
    this.type ? obj.type = this.type : delete obj.type;
    return obj;
  }

  constructor() {}

  get id(): any {
    return this._id;
  }

  set id(id: any) {
    this._id = id;
  }

  get accountName(): string {
    return this._accountName;
  }

  set accountName(accountName: string) {
    this._accountName = accountName;
  }

  get accountNumber(): number {
    return this._accountNumber;
  }

  set accountNumber(accountNumber: number) {
    this._accountNumber = accountNumber;
  }

  get commerce(): string {
    return this._commerce;
  }

  set commerce(commerce: string) {
    this._commerce = commerce;
  }

  get ownerDocType(): string {
    return this._ownerDocType;
  }

  set ownerDocType(ownerDocType: string) {
    this._ownerDocType = ownerDocType;
  }

  get ownerDocument(): number {
    return this._ownerDocument;
  }

  set ownerDocument(ownerDocument: number) {
    this._ownerDocument = ownerDocument;
  }

  get ownerName(): string {
    return this._ownerName;
  }

  set ownerName(ownerName: string) {
    this._ownerName = ownerName;
  }

  get type(): number {
    return this._type;
  }

  set type(type: number) {
    this._type = type;
  }
}
