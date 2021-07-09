import StockMovement from './stock-movement';

export default class Stock {
  _id: string;
  _commerce: string;
  _movements: StockMovement[];
  _product: string;
  _productName: string;
  _productSection: string;
  _total: number;

  static parse(obj: any): Stock {
    const stock = new Stock();
    stock.id = obj.id;
    stock.commerce = obj.commerce;
    stock.movements = obj.movements.map((m) => StockMovement.parse(m));
    stock.product = obj.product;
    stock.productName = obj.productName;
    stock.productSection = obj.productSection;
    stock.total = obj.total;
    return stock;
  }

  clone(): Stock {
    const stock = new Stock();
    stock.id = this.id;
    stock.commerce = this.commerce;
    stock.movements = this.movements;
    stock.product = this.product;
    stock.productName = this.productName;
    stock.productSection = this.productSection;
    stock.total = this.total;
    return stock;
  }

  getSimpleObject(): any {
    const obj: any = {};
    this.id ? (obj.id = this.id) : delete obj.id;
    this.commerce ? (obj.commerce = this.commerce) : delete obj.commerce;
    this.movements
      ? (obj.movements = this.movements.map((m) => m.getSimpleObject()))
      : delete obj.movements;
    this.product ? (obj.product = this.product) : delete obj.product;
    this.productName
      ? (obj.productName = this.productName)
      : delete obj.productName;
    this.productSection
      ? (obj.productSection = this.productSection)
      : delete obj.productSection;
    this.total ? (obj.total = this.total) : delete obj.total;
    return obj;
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

  get movements(): StockMovement[] {
    return this._movements;
  }
  set movements(movements: StockMovement[]) {
    this._movements = movements;
  }

  get product(): string {
    return this._product;
  }
  set product(product: string) {
    this._product = product;
  }

  get productName(): string {
    return this._productName;
  }
  set productName(productName: string) {
    this._productName = productName;
  }

  get productSection(): string {
    return this._productSection;
  }
  set productSection(productSection: string) {
    this._productSection = productSection;
  }

  get total(): number {
    return this._total;
  }
  set total(total: number) {
    this._total = total;
  }
}
