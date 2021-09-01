export default class Additional {
  _order: number;
  _description: string;
  _price: number;
  _additionals: Additional[];

  static parse(obj: any): Additional {
    const additonal = new Additional();
    additonal.order = obj.order;
    additonal.description = obj.description;
    additonal.price = obj.price;
    additonal.additionals = obj.additionals
      ? obj.additionals.map((additional: any) => Additional.parse(additional))
      : null;
    return additonal;
  }

  static getSimpleObject(obj: Additional): any {
    const additional: any = {};
    additional.order = obj.order;
    additional.description = obj.description;
    obj.price ? (additional.price = obj.price) : delete additional.price;
    obj.additionals && obj.additionals.length > 0
      ? (additional.additionals = obj.additionals.map((val) =>
          Additional.getSimpleObject(val)
        ))
      : delete additional.additionals;
    return additional;
  }

  clone(): Additional {
    const additional = new Additional();
    additional.order = this.order;
    additional.description = this.description;
    additional.price = this.price;
    additional.additionals = this.additionals;
    return additional;
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
