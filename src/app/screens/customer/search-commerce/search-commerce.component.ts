import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AppState } from 'src/app/models/app/app-state';
import Commerce from 'src/app/models/db/commerce';
import Order from 'src/app/models/db/order/order';
import { CustomerStoreService } from 'src/app/services/customer-store.service';
import { StoreService } from 'src/app/services/store.service';
import { pathRoute } from 'src/app/utils/commons.function';
import { ROUTES } from 'src/app/utils/routes';

@Component({
  selector: 'eu-search-commerce',
  templateUrl: './search-commerce.component.html',
  styleUrls: ['./search-commerce.component.scss'],
})
export class SearchCommerceComponent implements OnInit, OnDestroy {
  appState: Observable<AppState> = this.store._appState.asObservable();
  commerces: Commerce[] = this.store.appState.commerces;
  commercesFiltred: Commerce[] = this.store.appState.commerces;
  searchCommerce = new FormControl(null);
  subscriptions: Subscription[] = [];

  constructor(
    private cd: ChangeDetectorRef,
    private customerStore: CustomerStoreService,
    private route: Router,
    private store: StoreService
  ) {}

  ngOnInit(): void {
    console.log(this.commerces);
    this.customerStore.commerceSelected = null;
    this.customerStore.order = new Order();
    this.customerStore.products = [];
    this.subscriptions.push(
      this.searchCommerce.valueChanges.subscribe((search: string) => {
        if (!search || search.trim() === '' || this.commerces.length === 0) {
          this.commercesFiltred = [...this.commerces];
          search = '';
          this.cd.detectChanges();
          return;
        }
        this.commercesFiltred = this.commerces.filter(
          (c) =>
            c.name.toLowerCase().includes(search.trim().toLowerCase()) ||
            c.categories?.some((cat: string) =>
              cat.toLowerCase().includes(search.trim().toLowerCase())
            ) ||
            c.sections?.some((sec: string) =>
              sec.toLowerCase().includes(search.trim().toLowerCase())
            )
        );
        this.cd.detectChanges();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((elements) => elements.unsubscribe());
  }

  handlerClickCard(commerce: Commerce): void {
    this.customerStore.commerceSelected = commerce;
    this.route.navigate([
      pathRoute([ROUTES.customer.listProducts], {
        commerceUrl: commerce.url,
      }),
    ]);
  }
}
