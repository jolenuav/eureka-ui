import Additional from '../additional';
import Product from '../product';

export default class ItemOrder {
  _amountTotal: number;
  _additionals: Additional[];
  _observation: string;
  _productId: string;
  _skipIngredients: string[];
  _unit: number;

  product: Product;

  static parse(obj: any): ItemOrder {
    const itemOrder = new ItemOrder();
    itemOrder.amountTotal = obj.amountTotal;
    itemOrder.additionals = obj.additionals
      ? obj.additionals.map((value) => Additional.parse(value))
      : null;
    itemOrder.observation = obj.observation;
    itemOrder.productId = obj.productId;
    itemOrder.skipIngredients = obj.skipIngredients;
    itemOrder.unit = obj.unit;
    return itemOrder;
  }

  clone(): ItemOrder {
    const itemOrder = new ItemOrder();
    itemOrder.amountTotal = this.amountTotal;
    itemOrder.additionals = this.additionals
      ? this.additionals.map((value) => value.clone())
      : null;
    itemOrder.observation = this.observation;
    itemOrder.productId = this.productId;
    itemOrder.skipIngredients = this.skipIngredients;
    itemOrder.unit = this.unit;
    return itemOrder;
  }

  getSimpleObject(): any {
    const obj: any = {};
    this.additionals && this.additionals.length > 0
      ? (obj.additionals = this.additionals.map((additional) =>
          additional.getSimpleObject()
        ))
      : delete obj.additionals;
    this.observation
      ? (obj.observation = this.observation)
      : delete obj.observation;
    this.skipIngredients && this.skipIngredients.length > 0
      ? (obj.skipIngredients = this.skipIngredients)
      : delete obj.skipIngredients;
    obj.productId = this.productId;
    obj.unit = this.unit;
    return obj;
  }

  constructor() {}

  get amountTotal(): number {
    return this._amountTotal;
  }
  set amountTotal(amountTotal: number) {
    this._amountTotal = amountTotal;
  }

  get productId(): string {
    return this._productId;
  }
  set productId(productId: string) {
    this._productId = productId;
  }

  get unit(): number {
    return this._unit;
  }
  set unit(unit: number) {
    this._unit = unit;
  }

  get observation(): string {
    return this._observation;
  }
  set observation(observation: string) {
    this._observation = observation;
  }

  get additionals(): Additional[] {
    return this._additionals;
  }
  set additionals(additionals: Additional[]) {
    this._additionals = additionals;
  }

  get skipIngredients(): string[] {
    return this._skipIngredients;
  }
  set skipIngredients(skipIngredients: string[]) {
    this._skipIngredients = skipIngredients;
  }
}
