import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import PaymentMethod from '../models/db/payment-method';
import Product from '../models/db/product';
import SessionToken from '../models/db/session-token';
import User from '../models/db/user';
import { UserService } from '../services/firestore/user.service';
import { StoreService } from '../services/store.service';
import { VendorStoreService } from '../services/vendor-store.service';

@Injectable()
export abstract class VendorResolver implements Resolve<any> {
  constructor(
    private userService: UserService,
    public vendorStore: VendorStoreService,
    public store: StoreService
  ) {}

  abstract resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): any;

  async getUsserLogged(): Promise<User> {
    const sessionToken = SessionToken.parse(
      JSON.parse(sessionStorage.getItem('sessionToken'))
    );
    if (!this.vendorStore.user) {
      console.log(sessionToken);
      this.vendorStore.user = await this.userService.findById(sessionToken.userId);
    }
    return this.vendorStore.user;
  }
}
