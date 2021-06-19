import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
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

}
