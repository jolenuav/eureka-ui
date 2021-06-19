import { Injectable } from '@angular/core';
import * as moment from 'moment';
import SessionToken from '../models/db/session-token';
import User from '../models/db/user';
import { generateID } from '../utils/commons.function';
import { SessionTokenService } from './firestore/sessionToken.service';
import { UserService } from './firestore/user.service';
import { VendorStoreService } from './vendor-store.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private sessionTokenService: SessionTokenService,
    private vendorStore: VendorStoreService
  ) {}

  async signIn(username: string, password: string): Promise<boolean> {
    const resp = await this.userService.signIn(username, password);
    if (resp) {
      const sessionToken = new SessionToken();
      sessionToken.id = generateID();
      sessionToken.username = username;
      sessionToken.userId = resp.id;
      sessionToken.expireToken = this.calculateExpireDate();
      sessionStorage.setItem(
        'sessionToken',
        JSON.stringify(sessionToken.getSimpleObject())
      );
      await this.sessionTokenService.deleteByUsername(sessionToken);
      await this.sessionTokenService.save(sessionToken);
    }
    this.vendorStore.user = resp;
    return resp ? true : false;
  }

  async signOut(): Promise<void> {
    const sessionToken = SessionToken.parse(
      JSON.parse(sessionStorage.getItem('sessionToken'))
    );
    await this.sessionTokenService.delete(sessionToken.id);
    sessionStorage.clear();
    this.vendorStore.user = null;
  }

  calculateExpireDate(): Date {
    const currentMoment = moment().add(1, 'hours');
    return currentMoment.toDate();
  }

  tokenValid(): boolean {
    const obj = JSON.parse(sessionStorage.getItem('sessionToken'));
    if (!obj) {
      return false;
    }
    const sessionToken = SessionToken.parse(obj);
    const tokenDate = moment(sessionToken.expireToken);
    const currentDate = moment();
    if (tokenDate.diff(currentDate, 'minutes') > 0) {
      return true;
    }
    return false;
  }

  async getUsserLogged(): Promise<User> {
    const obj = JSON.parse(sessionStorage.getItem('sessionToken'));
    if (!obj) {
      return null;
    }
    const sessionToken = SessionToken.parse(obj);
    if (!this.vendorStore.user) {
      this.vendorStore.user = await this.userService.findById(
        sessionToken.userId
      );
    }
    return this.vendorStore.user;
  }
}
