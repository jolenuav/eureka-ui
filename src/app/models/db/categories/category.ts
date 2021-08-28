export default class Category {
  _order: number;
  _description: string;
  _subCategories: Category[];

  static parse(obj: any): Category {
    const category = new Category();
    category.order = obj.order;
    category.description = obj.description;
    category.subCategories = obj.subCategories
      ? obj.subCategories.map((subCategory) => Category.parse(subCategory))
      : null;
    return category;
  }

  clone(): Category {
    const category = new Category();
    category.order = this.order;
    category.description = this.description;
    category.subCategories = this.subCategories;
    return category;
  }

  getSimpleObject(): any {
    const obj: any = {};
    obj.order = this.order;
    this.description
      ? (obj.description = this.description)
      : delete obj.description;
    this.subCategories && this.subCategories.length > 0
      ? (obj.subCategories = this.subCategories.map((subCategory) =>
          subCategory.getSimpleObject()
        ))
      : delete obj.subCategories;
    return obj;
  }

  get order(): number {
    return this._order;
  }
  set order(order: number) {
    this._order = order;
  }

  get description(): string {
    return this._description;
  }
  set description(description: string) {
    this._description = description;
  }

  get subCategories(): Category[] {
    return this._subCategories;
  }
  set subCategories(subCategories: Category[]) {
    this._subCategories = subCategories;
  }
}
