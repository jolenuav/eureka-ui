export default class StockMovement {
  _date: Date;
  _quantity: number;
  _type: number;
  _user: string;

  static parse(obj: any): StockMovement {
    const stockMovement = new StockMovement();
    stockMovement.date = obj.date.toDate();
    stockMovement.quantity = obj.quantity;
    stockMovement.type = obj.type;
    stockMovement.user = obj.user;
    return stockMovement;
  }

  clone(): StockMovement {
    const stockMovement = new StockMovement();
    stockMovement.date = this.date;
    stockMovement.quantity = this.quantity;
    stockMovement.type = this.type;
    stockMovement.user = this.user;
    return stockMovement;
  }

  getSimpleObject(): any {
    const obj: any = {};
    this.date ? (obj.date = this.date) : delete obj.date;
    this.quantity ? (obj.quantity = this.quantity) : delete obj.quantity;
    this.type ? (obj.type = this.type) : delete obj.type;
    this.user ? (obj.user = this.user) : delete obj.user;
    return obj;
  }
  get date(): Date {
    return this._date;
  }
  set date(date: Date) {
    this._date = date;
  }

  get quantity(): number {
    return this._quantity;
  }
  set quantity(quantity: number) {
    this._quantity = quantity;
  }

  get type(): number {
    return this._type;
  }
  set type(type: number) {
    this._type = type;
  }

  get user(): string {
    return this._user;
  }
  set user(user: string) {
    this._user = user;
  }
}
