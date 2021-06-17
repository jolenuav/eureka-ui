import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/authenticate.service';
import { StoreService } from 'src/app/services/store.service';
import { VendorStoreService } from 'src/app/services/vendor-store.service';
import { pathRoute } from 'src/app/utils/commons.function';
import { CONSTANTS } from 'src/app/utils/constants';

@Component({
  selector: 'eu-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [NgbDropdownConfig],
})
export class NavbarComponent implements OnInit {
  iconOnlyToggled = false;
  loginStatus$ = this.vendorStore.loginStatus$;
  sidebarToggled = false;
  user = this.vendorStore.user;

  constructor(
    private authService: AuthService,
    private config: NgbDropdownConfig,
    private router: Router,
    private store: StoreService,
    private vendorStore: VendorStoreService
  ) {
    this.config.placement = 'bottom-right';
  }

  ngOnInit(): void {
  }

  toggleOffcanvas(): void {
    document.querySelector('.sidebar-offcanvas').classList.toggle('active');
  }

  // toggle sidebar
  toggleSidebar(): void {
    const body = document.querySelector('body');
    if (
      !body.classList.contains('sidebar-toggle-display') &&
      !body.classList.contains('sidebar-absolute')
    ) {
      this.iconOnlyToggled = !this.iconOnlyToggled;
      if (this.iconOnlyToggled) {
        body.classList.add('sidebar-icon-only');
      } else {
        body.classList.remove('sidebar-icon-only');
      }
    } else {
      this.sidebarToggled = !this.sidebarToggled;
      if (this.sidebarToggled) {
        body.classList.add('sidebar-hidden');
      } else {
        body.classList.remove('sidebar-hidden');
      }
    }
  }

  async signOut(): Promise<void> {
    this.store.startLoader();
    await this.authService.signOut();
    this.router.navigate([
      pathRoute([
        CONSTANTS.routes.partner.main,
        CONSTANTS.routes.partner.login,
      ]),
    ]);
    this.store.endLoader();
  }
}
