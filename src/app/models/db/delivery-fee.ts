export default class DeliveryFee {
  _id: string;
  _price;
  _distance: number;

  static parse(obj: any): DeliveryFee {
    const deliveryFee = new DeliveryFee();
    deliveryFee.id = obj.id;
    deliveryFee.price = obj.price;
    deliveryFee.distance = obj.distance;
    return deliveryFee;
  }

  clone(): DeliveryFee {
    const deliveryFee = new DeliveryFee();
    deliveryFee.id = this.id;
    deliveryFee.price = this.price;
    deliveryFee.distance = this.distance;
    return deliveryFee;
  }

  constructor() {}

  get id(): string {
    return this._id;
  }
  set id(id: string) {
    this._id = id;
  }

  get price(): number {
    return this._price;
  }
  set price(price: number) {
    this._price = price;
  }

  get distance(): number {
    return this._distance;
  }
  set distance(distance: number) {
    this._distance = distance;
  }
}
