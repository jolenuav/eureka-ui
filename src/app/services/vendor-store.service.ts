import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import Commerce from '../models/db/commerce';
import User from '../models/db/user';

@Injectable({
  providedIn: 'root',
})
export class VendorStoreService {
  _commerce = new BehaviorSubject<Commerce>(null);
  _loginStatus = new BehaviorSubject<string>('online');
  _user = new BehaviorSubject<User>(null);

  constructor() {}

  get user$(): Observable<User> {
    return this._user.asObservable();
  }
  get user(): User {
    return this._user.value;
  }
  set user(user: User) {
    this._user.next(user);
  }

  get commerce$(): Observable<Commerce> {
    return this._commerce.asObservable();
  }
  get commerce(): Commerce {
    return this._commerce.value;
  }
  set commerce(commerce: Commerce) {
    this._commerce.next(commerce);
  }

  get loginStatus$(): Observable<string> {
    return this._loginStatus.asObservable();
  }
  get loginStatus(): string {
    return this._loginStatus.value;
  }
  set loginStatus(status: string) {
    this._loginStatus.next(status);
  }
}
