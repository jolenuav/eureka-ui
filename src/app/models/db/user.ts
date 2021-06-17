export default class User {
  _id: string;
  _image: string;
  _name: string;
  _roles: string[];
  _type: number;
  _username: string;

  static parse(obj: any): User {
    const user = new User();
    user.id = obj.id;
    user.image = obj.image;
    user.name = obj.name;
    user.roles = obj.roles;
    user.type = obj.type;
    user.username = obj.username;
    return user;
  }

  clone(): User {
    const user = new User();
    user.id = this.id;
    user.image = this.image;
    user.name = this.name;
    user.roles = this.roles;
    user.type = this.type;
    user.username = this.username;
    return user;
  }

  getSimpleObject(): any {
    const obj: any = {};
    this.id ? (obj.id = this.id) : delete obj.id;
    this.image ? (obj.image = this.image) : delete obj.image;
    this.name ? (obj.name = this.name) : delete obj.name;
    this.roles ? (obj.roles = this.roles) : delete obj.roles;
    this.type ? (obj.type = this.type) : delete obj.type;
    this.username ? (obj.username = this.username) : delete obj.username;
    return obj;
  }

  constructor() {}

  get id(): string {
    return this._id;
  }
  set id(id: string) {
    this._id = id;
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

  get roles(): string[] {
    return this._roles;
  }
  set roles(roles: string[]) {
    this._roles = roles;
  }

  get type(): number {
    return this._type;
  }
  set type(type: number) {
    this._type = type;
  }

  get username(): string {
    return this._username;
  }
  set username(username: string) {
    this._username = username;
  }
}
