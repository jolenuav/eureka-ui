export default class Additional {
  _order: number;
  _description: string;
  _price: number;
  _additionals: Additional[];

  static parse(obj: any): Additional {
    const objAdditional = new Additional();
    objAdditional.order = obj.order;
    objAdditional.description = obj.description;
    objAdditional.price = obj.price;
    objAdditional.additionals = obj.additionals
      ? obj.additionals.map((additional: any) => Additional.parse(additional))
      : null;
    return objAdditional;
  }

  clone(): Additional {
    const additional = new Additional();
    additional.order = this.order;
    additional.description = this.description;
    additional.price = this.price;
    additional.additionals = this.additionals;
    return additional;
  }

  getSimpleObject(): any {
    const obj: any = {};
    obj.order = this.order;
    this.description
      ? (obj.description = this.description)
      : delete obj.description;
    this.price ? (obj.price = this.price) : delete obj.price;
    this.additionals && this.additionals.length > 0
      ? (obj.additionals = this.additionals.map((additional) =>
          additional.getSimpleObject()
        ))
      : delete obj.additionals;
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

  get price(): number {
    return this._price;
  }
  set price(price: number) {
    this._price = price;
  }

  get additionals(): Additional[] {
    return this._additionals;
  }
  set additionals(additionals: Additional[]) {
    this._additionals = additionals;
  }
}
