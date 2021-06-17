import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { version } from 'package.json';
import { StoreService } from './services/store.service';
import { VendorStoreService } from './services/vendor-store.service';

@Component({
  selector: 'eu-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewChecked {
  fullPage = true;
  showLoader = this.storeService.showLoader.asObservable();
  title = 'eureka-web';
  userLoggeg$ = this.vendorStore.user$;
  version = version;

  constructor(
    private cd: ChangeDetectorRef,
    private storeService: StoreService,
    private vendorStore: VendorStoreService
  ) {}

  ngOnInit(): void {
    this.userLoggeg$.subscribe((user) => {
      user ? (this.fullPage = false) : (this.fullPage = true);
      console.log(this.fullPage);
    });
  }

  ngAfterViewChecked(): void {
    this.cd.detectChanges();
  }

  deleteAllCookies(): void {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  }
}
