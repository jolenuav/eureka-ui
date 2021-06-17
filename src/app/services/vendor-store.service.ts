import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import User from '../models/db/user';

@Injectable({
  providedIn: 'root',
})
export class VendorStoreService {
  _user = new BehaviorSubject<User>(null);
  _loginStatus = new BehaviorSubject<string>('online');

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
