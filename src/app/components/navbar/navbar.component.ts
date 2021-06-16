import { Component, OnInit } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'eu-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [NgbDropdownConfig],
})
export class NavbarComponent implements OnInit {
  public iconOnlyToggled = false;
  public sidebarToggled = false;

  constructor(config: NgbDropdownConfig) {
    config.placement = 'bottom-right';
  }

  ngOnInit(): void {}

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
}
