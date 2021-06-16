import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { version } from 'package.json';
import { AuthService } from './services/authenticate.service';
import { StoreService } from './services/store.service';

@Component({
  selector: 'eu-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewChecked {
  title = 'eureka-web';
  version = version;
  showLoader = this.storeService.showLoader.asObservable();
  userLoggeg$ = this.authService.userLogged.asObservable();

  constructor(
    private authService: AuthService,
    private cd: ChangeDetectorRef,
    private storeService: StoreService
  ) {}

  ngOnInit(): void {
    this.userLoggeg$.subscribe(item => console.log('logged = ', item));
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
