export default class SessionToken {
  _id: string;
  _username: string;
  _expireToken: Date;

  static parse(obj: any): SessionToken {
    const sessionToken = new SessionToken();
    sessionToken.id = obj.id;
    sessionToken.username = obj.username;
    sessionToken.expireToken = obj.expireToken;
    return sessionToken;
  }

  clone(): SessionToken {
    const sessionToken = new SessionToken();
    sessionToken.id = this._id;
    sessionToken.username = this._username;
    sessionToken.expireToken = this._expireToken;
    return sessionToken;
  }

  getSimpleObject(): any {
    const obj: any = {};
    this.id ? (obj.id = this.id) : delete obj.id;
    this.username ? (obj.username = this.username) : delete obj.username;
    this.expireToken
      ? (obj.expireToken = this.expireToken)
      : delete obj.expireToken;
    return obj;
  }

  constructor() {}

  get id(): string {
    return this._id;
  }
  set id(id: string) {
    this._id = id;
  }

  get username(): string {
    return this._username;
  }
  set username(username: string) {
    this._username = username;
  }

  get expireToken(): Date {
    return this._expireToken;
  }
  set expireToken(expireToken: Date) {
    this._expireToken = expireToken;
  }
}
