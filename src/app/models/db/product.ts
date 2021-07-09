export default class Product {
  _id: string;
  _commerce: string;
  _description: string;
  _enabled: boolean;
  _image: string;
  _name: string;
  _price: number;
  _section: string;
  _stock: boolean;

  static parse(obj: any): Product {
    const product = new Product();
    product.id = obj.id;
    product.commerce = obj.commerce;
    product.description = obj.description;
    product.enabled = obj.enabled;
    product.image = obj.image;
    product.name = obj.name;
    product.price = obj.price;
    product.section = obj.section;
    product.stock = obj.stock;
    return product;
  }

  clone(): Product {
    const product = new Product();
    product.id = this.id;
    product.commerce = this.commerce;
    product.description = this.description;
    product.enabled = this.enabled;
    product.image = this.image;
    product.name = this.name;
    product.price = this.price;
    product.section = this.section;
    product.stock = this.stock;
    return product;
  }

  getSimpleObject(): any {
    const obj: any = {};
    this.id ? (obj.id = this.id) : delete obj.id;
    this.commerce ? (obj.commerce = this.commerce) : delete obj.commerce;
    this.description
      ? (obj.description = this.description)
      : delete obj.description;
    this.image ? (obj.image = this.image) : delete obj.image;
    obj.enabled = this.enabled;
    this.name ? (obj.name = this.name) : delete obj.name;
    this.price ? (obj.price = this.price) : delete obj.price;
    this.section ? (obj.section = this.section) : delete obj.section;
    this.stock ? (obj.stock = this.stock) : delete obj.stock;
    return obj;
  }

  constructor() {}

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

  get description(): string {
    return this._description;
  }
  set description(description: string) {
    this._description = description;
  }

  get enabled(): boolean {
    return this._enabled;
  }
  set enabled(enabled: boolean) {
    this._enabled = enabled;
  }

  get image(): string {
    return this._image;
  }
  set image(image: string) {
    this._image = image;
  }

  get name(): string {
    return this._name;
  }
  set name(name: string) {
    this._name = name;
  }

  get price(): number {
    return this._price;
  }
  set price(price: number) {
    this._price = price;
  }

  get section(): string {
    return this._section;
  }
  set section(section: string) {
    this._section = section;
  }

  get stock(): boolean {
    return this._stock;
  }
  set stock(stock: boolean) {
    this._stock = stock;
  }
}
