import Product from '../product';

export default class ItemOrder {
  _product: Product;
  _qty: number;
  _observation: string;

  static parse(obj: any): ItemOrder {
    const itemOrder = new ItemOrder();
    itemOrder.product = obj.product ? Product.parse(obj.product) : null;
    itemOrder.qty = obj.qty;
    itemOrder.observation = obj.observation;
    return itemOrder;
  }

  clone(): ItemOrder {
    const itemOrder = new ItemOrder();
    itemOrder.product = this.product;
    itemOrder.qty = this.qty;
    itemOrder.observation = this.observation;
    return itemOrder;
  }

  getSimpleObject(): any {
    const obj: any = {};
    this.product
      ? (obj.product = this.product.getSimpleObject())
      : delete obj.product;
    this.qty ? (obj.qty = this.qty) : delete obj.qty;
    this.observation
      ? (obj.observation = this.observation)
      : delete obj.observation;
    return obj;
  }

  constructor() {}

  get product(): Product {
    return this._product;
  }

  set product(prod: Product) {
    this._product = prod;
  }

  get qty(): number {
    return this._qty;
  }

  set qty(qty: number) {
    this._qty = qty;
  }

  get observation(): string {
    return this._observation;
  }

  set observation(obs: string) {
    this._observation = obs;
  }
}
