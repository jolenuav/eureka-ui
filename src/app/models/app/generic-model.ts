export default class GenericModel {
  _id: any;
  _description: string;
  _prefix: string;

  static parse(obj: any): GenericModel {
    const genericModel = new GenericModel();
    genericModel.id = obj.id;
    genericModel.description = obj.description;
    genericModel.prefix = obj.prefix;
    return genericModel;
  }

  clone(): GenericModel {
    const genericModel = new GenericModel();
    genericModel.id = this.id;
    genericModel.description = this.description;
    genericModel.prefix = this.prefix;
    return genericModel;
  }

  constructor() {}

  get id(): any {
    return this._id;
  }

  set id(id: any) {
    this._id = id;
  }

  get description(): string {
    return this._description;
  }

  set description(description: string) {
    this._description = description;
  }

  get prefix(): string {
    return this._prefix;
  }

  set prefix(prefix: string) {
    this._prefix = prefix;
  }
}
