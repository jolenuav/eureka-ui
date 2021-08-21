import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit
} from '@angular/core';
import { version } from 'package.json';
import { StoreService } from './services/store/store.service';
import { VendorStoreService } from './services/store/vendor-store.service';

@Component({
  selector: 'eu-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewChecked {
  fullPage = true;
  mouseEvent: MouseEvent;
  mouseLastEvent: MouseEvent;
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
    });
    const segByOffline = 300;
    const segByBusy = 60;
    let counter = 0;
    setInterval(() => {
      if (this.mouseLastEvent !== this.mouseEvent) {
        counter = 0;
        this.mouseLastEvent = this.mouseEvent;
      } else {
        counter > 300 ? (counter = counter) : counter++;
      }
      if (counter > segByOffline) {
        this.vendorStore.loginStatus = 'offline';
      } else if (counter > segByBusy) {
        this.vendorStore.loginStatus = 'busy';
      } else {
        this.vendorStore.loginStatus = 'online';
      }
    }, 1000);
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

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    this.mouseEvent = e;
  }
}
