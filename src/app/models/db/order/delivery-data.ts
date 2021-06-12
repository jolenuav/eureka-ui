export default class DeliveryData {
  _name: string;
  _phone: number;
  _email: string;
  _address: string;

  static parse(obj: any): DeliveryData {
    const deliveryData = new DeliveryData();
    deliveryData.name = obj.name;
    deliveryData.phone = obj.phone;
    deliveryData.email = obj.email;
    deliveryData.address = obj.address;
    return deliveryData;
  }

  clone(): DeliveryData {
    const deliveryData = new DeliveryData();
    deliveryData.name = this.name;
    deliveryData.phone = this.phone;
    deliveryData.email = this.email;
    deliveryData.address = this.address;
    return deliveryData;
  }

  getSimpleObject(): any {
    const obj: any = {};
    this.name ? (obj.name = this.name) : delete obj.name;
    this.phone ? (obj.phone = this.phone) : delete obj.phone;
    this.email ? (obj.email = this.email) : delete obj.email;
    this.address ? (obj.address = this.address) : delete obj.address;
    return obj;
  }

  get name(): string {
    return this._name;
  }
  set name(name: string) {
    this._name = name;
  }

  get phone(): number {
    return this._phone;
  }
  set phone(phone: number) {
    this._phone = phone;
  }

  get email(): string {
    return this._email;
  }
  set email(email: string) {
    this._email = email;
  }

  get address(): string {
    return this._address;
  }
  set address(address: string) {
    this._address = address;
  }
}
