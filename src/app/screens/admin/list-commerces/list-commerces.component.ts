import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StoreService } from 'src/app/services/store/store.service';
import { pathRoute } from 'src/app/utils/commons.function';
import { ROUTES } from 'src/app/utils/routes';

@Component({
  selector: 'eu-list-commerces',
  templateUrl: './list-commerces.component.html',
  styleUrls: ['./list-commerces.component.scss'],
})
export class ListCommercesComponent implements OnInit {
  commerces = this.store.appState.commerces;

  constructor(private store: StoreService, private router: Router) {}

  ngOnInit(): void {}

  editCommerce(commerceId: string): void {
    this.router.navigate(
      [pathRoute([ROUTES.partner.main, ROUTES.partner.adminCommerce])],
      {
        queryParams: {
          commerce: commerceId,
        },
      }
    );
  }
}
