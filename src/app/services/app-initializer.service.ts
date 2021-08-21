import { Injectable } from '@angular/core';
import * as moment from 'moment';
import SessionToken from '../models/db/session-token';
import { AuthService } from './authenticate.service';
import { StoreService } from './store/store.service';
import { VendorStoreService } from './store/vendor-store.service';

@Injectable()
export class AppInitializerService {
  constructor(
    private store: StoreService,
    private vendorStore: VendorStoreService,
    private authService: AuthService
  ) {}

  async load(): Promise<void> {
    await this.store.initialApp();
    const obj = JSON.parse(sessionStorage.getItem('sessionToken'));
    if (!obj) {
      this.vendorStore.user = null;
      return;
    }
    const sessionToken = SessionToken.parse(obj);
    const tokenDate = moment(sessionToken.expireToken);
    const currentDate = moment();
    if (tokenDate.diff(currentDate, 'minutes') > 0) {
      this.vendorStore.user = await this.authService.getUsserLogged();
    } else {
      this.vendorStore.user = null;
      sessionStorage.clear();
    }
  }
}
