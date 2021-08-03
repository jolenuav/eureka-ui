import GeoPoint from './geopointer';

export default class Commerce {
  _id: string;
  _geolacation: GeoPoint;
  _categories: string[];
  _duration: string;
  _documentNo: string;
  _enabled: boolean;
  _image: string;
  _name: string;
  _mail: string;
  _phone: number;
  _rate: number;
  _sections: string[];
  _url: string;

  static parse(obj: any): Commerce {
    const commerce = new Commerce();
    commerce.id = obj.id;
    commerce.geolacation = obj.geolacation
      ? GeoPoint.parse(obj.geolacation)
      : null;
    commerce.categories = obj.categories;
    commerce.duration = obj.duration;
    commerce.documentNo = obj.documentNo;
    commerce.enabled = obj.enabled;
    commerce.image = obj.image;
    commerce.name = obj.name;
    commerce.mail = obj.mail;
    commerce.phone = obj.phone;
    commerce.rate = obj.rate;
    commerce.sections = obj.sections;
    commerce.url = obj.url;
    return commerce;
  }

  clone(): Commerce {
    const commerce = new Commerce();
    commerce.id = this.id;
    commerce.geolacation = this.geolacation ? this.geolacation.clone() : null;
    commerce.categories = this.categories;
    commerce.duration = this.duration;
    commerce.documentNo = this.documentNo;
    commerce.enabled = this.enabled;
    commerce.image = this.image;
    commerce.name = this.name;
    commerce.mail = this.mail;
    commerce.phone = this.phone;
    commerce.rate = this.rate;
    commerce.sections = this.sections;
    commerce.url = this.url;
    return commerce;
  }

  getSimpleObject(): any {
    const obj: any = {};
    this.id ? (obj.id = this.id) : delete obj.id;
    this.geolacation
      ? (obj.geolacation = this.geolacation.getSimpleObject())
      : delete obj.geolacation;
    this.categories
      ? (obj.categories = this.categories)
      : delete obj.categories;
    this.duration ? (obj.duration = this.duration) : delete obj.duration;
    this.documentNo
      ? (obj.documentNo = this.documentNo)
      : delete obj.documentNo;
    obj.enabled = this.enabled;
    this.image ? (obj.image = this.image) : delete obj.image;
    this.name ? (obj.name = this.name) : delete obj.name;
    this.mail ? (obj.mail = this.mail) : delete obj.mail;
    this.phone ? (obj.phone = this.phone) : delete obj.phone;
    this.rate ? (obj.rate = this.rate) : delete obj.rate;
    this.sections && this.sections !== [] ? (obj.sections = this.sections) : delete obj.sections;
    this.url ? (obj.url = this.url) : delete obj.url;
    return obj;
  }

  constructor() {}

  get id(): string {
    return this._id;
  }
  set id(id: string) {
    this._id = id;
  }

  get geolacation(): GeoPoint {
    return this._geolacation;
  }
  set geolacation(geolacation: GeoPoint) {
    this._geolacation = geolacation;
  }

  get categories(): string[] {
    return this._categories;
  }
  set categories(categories: string[]) {
    this._categories = categories;
  }

  get duration(): string {
    return this._duration;
  }
  set duration(duration: string) {
    this._duration = duration;
  }

  get enabled(): boolean {
    return this._enabled;
  }
  set enabled(enabled: boolean) {
    this._enabled = enabled;
  }

  get image(): string {
    return this._image;
  }
  set image(image: string) {
    this._image = image;
  }

  get name(): string {
    return this._name;
  }
  set name(name: string) {
    this._name = name;
  }

  get rate(): number {
    return this._rate;
  }
  set rate(rate: number) {
    this._rate = rate;
  }

  get sections(): string[] {
    return this._sections;
  }
  set sections(sections: string[]) {
    this._sections = sections;
  }

  get url(): string {
    return this._url;
  }
  set url(url: string) {
    this._url = url;
  }

  get documentNo(): string {
    return this._documentNo;
  }
  set documentNo(documentNo: string) {
    this._documentNo = documentNo;
  }

  get mail(): string {
    return this._mail;
  }
  set mail(mail: string) {
    this._mail = mail;
  }

  get phone(): number {
    return this._phone;
  }
  set phone(phone: number) {
    this._phone = phone;
  }
}
