import { Component, OnInit } from '@angular/core';
import { VendorStoreService } from 'src/app/services/vendor-store.service';

@Component({
  selector: 'eu-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  user = this.vendorStore.user;

  constructor(private vendorStore: VendorStoreService) {}

  ngOnInit(): void {}
}
