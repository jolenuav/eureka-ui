export default class Category {
  _commerceId: string;
  _description: string;
  _id: string;
  _image: string;
  _imageFile: File; // Solo se usa para modelar la vista
  _imagePreview: any; // Solo se usa para modelar la vista
  _order: number;
  _subCategories: Category[];

  static parse(obj: any): Category {
    const category = new Category();
    category.id = obj.id;
    category.commerceId = obj.commerceId;
    category.order = obj.order;
    category.description = obj.description;
    category.image = obj.image;
    category.subCategories = obj.subCategories
      ? obj.subCategories.map((subCategory) => Category.parse(subCategory))
      : null;
    return category;
  }

  static getSimpleObject(obj: Category): any {
    const category: any = {};
    category.id = obj.id;
    category.commerceId = obj.commerceId;
    category.order = obj.order;
    category.description = obj.description;
    obj.image ? (category.image = obj.image) : delete category.image;
    obj.subCategories && obj.subCategories.length > 0
      ? (category.subCategories = obj.subCategories.map((val) =>
          Category.getSimpleObject(val)
        ))
      : delete category.subCategories;
    return category;
  }

  clone(): Category {
    const category = new Category();
    category.id = this.id;
    category.commerceId = this.commerceId;
    category.order = this.order;
    category.description = this.description;
    category.image = this.image;
    category.subCategories = this.subCategories;
    return category;
  }

  get commerceId(): string {
    return this._commerceId;
  }
  set commerceId(commerceId: string) {
    this._commerceId = commerceId;
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

  get id(): string {
    return this._id;
  }
  set id(id: string) {
    this._id = id;
  }

  get image(): string {
    return this._image;
  }
  set image(image: string) {
    this._image = image;
  }

  get subCategories(): Category[] {
    return this._subCategories;
  }
  set subCategories(subCategories: Category[]) {
    this._subCategories = subCategories;
  }
}
