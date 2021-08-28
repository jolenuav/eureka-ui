import Category from './category';

export default class Categories {
  _id: string;
  _categories: Category[];

  static parse(obj: any): Categories {
    const categories = new Categories();
    categories.id = obj.id;
    categories.categories = obj.categories.map((category) =>
      Category.parse(category)
    );
    return categories;
  }

  clone(): Categories {
    const categories = new Categories();
    categories.id = this.id;
    categories.categories = this.categories;
    return categories;
  }

  getSimpleObject(): any {
    const obj: any = {};
    this.id ? (obj.id = this.id) : delete obj.id;
    this.categories && this.categories.length > 0
      ? (obj.categories = this.categories.map((category) =>
          category.getSimpleObject()
        ))
      : delete obj.categories;
    return obj;
  }

  get id(): string {
    return this._id;
  }
  set id(id: string) {
    this._id = id;
  }

  get categories(): Category[] {
    return this._categories;
  }
  set categories(categories: Category[]) {
    this._categories = categories;
  }
}
