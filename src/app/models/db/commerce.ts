import Address from './address';

export default class Commerce {
  _id?: string;
  _address?: Address;
  _categories?: string[];
  _duration?: string;
  _enabled?: boolean;
  _image?: string;
  _name?: string;
  _rate?: number;
  _sections?: string[];

  static parse(obj: any): Commerce {
    const commerce = new Commerce();
    commerce.id = obj.id;
    commerce.address = obj.address ? Address.parse(obj.address) : null;
    commerce.categories = obj.categories;
    commerce.duration = obj.duration;
    commerce.enabled = obj.enabled;
    commerce.image = obj.image;
    commerce.name = obj.name;
    commerce.rate = obj.rate;
    commerce.sections = obj.sections;
    return commerce;
  }

  clone(): Commerce {
    const commerce = new Commerce();
    commerce.id = this.id;
    commerce.address = this.address;
    commerce.categories = this.categories;
    commerce.duration = this.duration;
    commerce.enabled = this.enabled;
    commerce.image = this.image;
    commerce.name = this.name;
    commerce.rate = this.rate;
    commerce.sections = this.sections;
    return commerce;
  }

  constructor() {}

  get id(): string {
    return this._id;
  }
  set id(id: string) {
    this._id = id;
  }

  get address(): Address {
    return this._address;
  }
  set address(address: Address) {
    this._address = address;
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
}
