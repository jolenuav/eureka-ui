export default class DeliveryFee {
  _id: string;
  _priceMin: number;
  _priceMax: number;
  _distance: number;

  static parse(obj: any): DeliveryFee {
    const deliveryFee = new DeliveryFee();
    deliveryFee.id = obj.id;
    deliveryFee.priceMin = obj.priceMin;
    deliveryFee.priceMax = obj.priceMax;
    deliveryFee.distance = obj.distance;
    return deliveryFee;
  }

  clone(): DeliveryFee {
    const deliveryFee = new DeliveryFee();
    deliveryFee.id = this.id;
    deliveryFee.priceMin = this.priceMin;
    deliveryFee.priceMax = this.priceMax;
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

  get priceMin(): number {
    return this._priceMin;
  }
  set priceMin(priceMin: number) {
    this._priceMin = priceMin;
  }

  get priceMax(): number {
    return this._priceMax;
  }
  set priceMax(priceMax: number) {
    this._priceMax = priceMax;
  }

  get distance(): number {
    return this._distance;
  }
  set distance(distance: number) {
    this._distance = distance;
  }
}
