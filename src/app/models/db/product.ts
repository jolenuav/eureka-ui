import Additional from './additional';
import Category from './category';

export default class Product {
  _id: string;
  _additionals: Additional[];
  _category: Category;
  _commerce: string;
  _description: string;
  _enabled: boolean;
  _ingredients: string[];
  _image: string;
  _isAdditional: boolean;
  _name: string;
  _price: number;
  _stock: boolean;
  _subCategory: Category;
  _tags: string[];

  static parse(obj: any): Product {
    const product = new Product();
    product.id = obj.id;
    product.additionals = obj.additionals;
    product.category = obj.category;
    product.commerce = obj.commerce;
    product.description = obj.description;
    product.enabled = obj.enabled;
    product.ingredients = obj.ingredients;
    product.image = obj.image;
    product.isAdditional = obj.isAdditional;
    product.name = obj.name;
    product.price = obj.price;
    product.subCategory = obj.subCategory;
    product.stock = obj.stock;
    product.tags = obj.tags;
    return product;
  }

  clone(): Product {
    const product = new Product();
    product.id = this.id;
    product.additionals = this.additionals;
    product.category = this.category;
    product.commerce = this.commerce;
    product.description = this.description;
    product.enabled = this.enabled;
    product.ingredients = this.ingredients;
    product.image = this.image;
    product.isAdditional = this.isAdditional;
    product.name = this.name;
    product.price = this.price;
    product.subCategory = this.subCategory;
    product.stock = this.stock;
    product.tags = this.tags;
    return product;
  }

  getSimpleObject(): any {
    const obj: any = {};
    this.id ? (obj.id = this.id) : delete obj.id;
    this.additionals.length > 0
      ? (obj.additionals = this.additionals.map((additional) =>
          Additional.getSimpleObject(additional)
        ))
      : delete obj.additionals;
    this.commerce ? (obj.commerce = this.commerce) : delete obj.commerce;
    this.category
      ? (obj.category = Category.getSimpleObject(this.category))
      : delete obj.category;
    this.description
      ? (obj.description = this.description)
      : delete obj.description;
    this.ingredients.length > 0
      ? (obj.ingredients = this.ingredients)
      : delete obj.ingredients;
    this.image ? (obj.image = this.image) : delete obj.image;
    obj.isAdditional = this.isAdditional;
    obj.enabled = this.enabled;
    this.name ? (obj.name = this.name) : delete obj.name;
    this.price ? (obj.price = this.price) : delete obj.price;
    this.subCategory
      ? (obj.subCategory = Category.getSimpleObject(this.subCategory))
      : delete obj.subCategory;
    obj.stock = this.stock;
    this.tags && this.tags.length > 0
      ? (obj.tags = this.tags)
      : delete obj.tags;
    return obj;
  }

  constructor() {}

  get id(): string {
    return this._id;
  }
  set id(id: string) {
    this._id = id;
  }

  get additionals(): Additional[] {
    return this._additionals;
  }
  set additionals(additionals: Additional[]) {
    this._additionals = additionals;
  }

  get category(): Category {
    return this._category;
  }
  set category(category: Category) {
    this._category = category;
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

  get ingredients(): string[] {
    return this._ingredients;
  }
  set ingredients(ingredients: string[]) {
    this._ingredients = ingredients;
  }

  get image(): string {
    return this._image;
  }
  set image(image: string) {
    this._image = image;
  }

  get isAdditional(): boolean {
    return this._isAdditional;
  }
  set isAdditional(isAdditional: boolean) {
    this._isAdditional = isAdditional;
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

  get subCategory(): Category {
    return this._subCategory;
  }
  set subCategory(subCategory: Category) {
    this._subCategory = subCategory;
  }

  get stock(): boolean {
    return this._stock;
  }
  set stock(stock: boolean) {
    this._stock = stock;
  }

  get tags(): string[] {
    return this._tags;
  }
  set tags(tags: string[]) {
    this._tags = tags;
  }
}
