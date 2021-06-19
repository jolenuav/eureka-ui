export default class Address {
  _beetweenStreets: string;
  _city: string;
  _country: string;
  _province: string;
  _state: string;
  _street?: string;

  static parse(obj: any): Address {
    const address = new Address();
    address.beetweenStreets = obj.beetweenStreets;
    address.city = obj.city;
    address.country = obj.country;
    address.province = obj.province;
    address.state = obj.state;
    address.street = obj.street;
    return address;
  }

  clone(): Address {
    const address = new Address();
    address.beetweenStreets = this.beetweenStreets;
    address.city = this.city;
    address.country = this.country;
    address.province = this.province;
    address.state = this.state;
    address.street = this.street;
    return address;
  }

  getSimpleObject(): any {
    const obj: any = {};
    this.beetweenStreets
      ? (obj.beetweenStreets = this.beetweenStreets)
      : delete obj.beetweenStreets;
    this.city ? (obj.city = this.city) : delete obj.city;
    this.country ? (obj.country = this.country) : delete obj.country;
    this.province ? (obj.province = this.province) : delete obj.province;
    this.state ? (obj.state = this.state) : delete obj.state;
    this.street ? (obj.street = this.street) : delete obj.street;
    return obj;
  }

  constructor() {}

  get beetweenStreets(): string {
    return this._beetweenStreets;
  }
  set beetweenStreets(beetweenStreets: string) {
    this._beetweenStreets = beetweenStreets;
  }

  get city(): string {
    return this._city;
  }
  set city(city: string) {
    this._city = city;
  }

  get country(): string {
    return this._country;
  }
  set country(country: string) {
    this._country = country;
  }

  get province(): string {
    return this._province;
  }
  set province(province: string) {
    this._province = province;
  }

  get state(): string {
    return this._state;
  }
  set state(state: string) {
    this._state = state;
  }

  get street(): string {
    return this._street;
  }
  set street(street: string) {
    this._street = street;
  }
}
