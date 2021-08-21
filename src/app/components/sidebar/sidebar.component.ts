import { Component, OnInit } from '@angular/core';
import { VendorStoreService } from 'src/app/services/store/vendor-store.service';

@Component({
  selector: 'eu-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  commerceCollapsed = false;
  productCollapsed = false;
  user = this.vendorStore.user;
  loginStatus$ = this.vendorStore.loginStatus$;

  constructor(private vendorStore: VendorStoreService) {}

  ngOnInit(): void {
    const body = document.querySelector('body');

    // add class 'hover-open' to sidebar navitem while hover in sidebar-icon-only menu
    document.querySelectorAll('.sidebar .nav-item').forEach((el) => {
      el.addEventListener('mouseover', () => {
        if (body.classList.contains('sidebar-icon-only')) {
          el.classList.add('hover-open');
        }
      });
      el.addEventListener('mouseout', () => {
        if (body.classList.contains('sidebar-icon-only')) {
          el.classList.remove('hover-open');
        }
      });
    });
  }
}
