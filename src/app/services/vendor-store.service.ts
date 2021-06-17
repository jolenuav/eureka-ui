import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import User from '../models/db/user';

@Injectable({
  providedIn: 'root',
})
export class VendorStoreService {
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
}
