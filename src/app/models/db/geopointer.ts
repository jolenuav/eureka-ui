export default class GeoPointer {
  _latitude: number;
  _longitude: number;

  static parse(obj: any): GeoPointer {
    const geopoint = new GeoPointer();
    geopoint.latitude = obj.latitude;
    geopoint.longitude = obj.longitude;
    return geopoint;
  }

  clone(): GeoPointer {
    const geopoint = new GeoPointer();
    geopoint.latitude = this.latitude;
    geopoint.longitude = this.longitude;
    return geopoint;
  }

  getSimpleObject(): any {
    const obj: any = {};
    this.latitude ? (obj.latitude = this.latitude) : delete obj.latitude;
    this.longitude ? (obj.longitude = this.longitude) : delete obj.longitude;
    return obj;
  }

  constructor() {}

  get latitude(): number {
    return this._latitude;
  }
  set latitude(latitude: number) {
    this._latitude = latitude;
  }

  get longitude(): number {
    return this._longitude;
  }
  set longitude(longitude: number) {
    this._longitude = longitude;
  }
}
