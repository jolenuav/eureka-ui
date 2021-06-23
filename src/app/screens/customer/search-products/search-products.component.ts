import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import Commerce from 'src/app/models/db/commerce';
import Order from 'src/app/models/db/order/order';
import Product from 'src/app/models/db/product';
import { CustomerStoreService } from 'src/app/services/customer-store.service';
import { pathRoute, quitQuoteText } from 'src/app/utils/commons.function';
import { ROUTES } from 'src/app/utils/routes';

@Component({
  selector: 'eu-search-products',
  templateUrl: './search-products.component.html',
  styleUrls: ['./search-products.component.scss'],
})
export class SearchProductsComponent implements OnInit, OnDestroy {
  commerce: Commerce = this.activedRoute.snapshot.data.searchProduct.commerce;
  headerStyle;
  order: Order = this.customerStore.order;
  products: Product[] = this.activedRoute.snapshot.data.searchProduct.products;
  productsBySection: Map<string, Product[]> =
    this.activedRoute.snapshot.data.searchProduct.productsBySection;
  productsBySectionFiltered: Map<string, Product[]> =
    this.activedRoute.snapshot.data.searchProduct.productsBySection;
  sectionActived: string;
  showSections = false;
  txtColor = '#e9ecef';
  searchProduct = new FormControl(null);
  subscription: Subscription;

  constructor(
    private activedRoute: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private customerStore: CustomerStoreService,
    private router: Router
  ) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async ngOnInit(): Promise<void> {
    this.headerStyle = {
      opacity: 1,
      height: '15rem',
      color: '#e9ecef',
      'max-height': '15rem',
      'background-image': `linear-gradient(rgba(62, 62, 62, 0), rgba(62, 62, 62, 1) 95%), url("${this.commerce.image}")`,
    };
    this.order.commerce = this.commerce.id;
    this.order.commerceName = this.commerce.name;

    this.searchProduct.valueChanges.subscribe((search: string) => {
      if (!search || search.trim() === '') {
        this.productsBySectionFiltered = this.productsBySection;
        search = '';
        this.cd.detectChanges();
        return;
      }
      this.productsBySectionFiltered = this.filterProducts(search);
      this.cd.detectChanges();
    });
  }

  filterProducts(search: string): Map<string, Product[]> {
    const products = new Map(
      [...this.productsBySection.entries()]
        .filter((entry) =>
          entry[1].some((prod) =>
            quitQuoteText(prod.name)
              .toUpperCase()
              .includes(quitQuoteText(search).toUpperCase())
          )
        )
        .map((obj) => [
          obj[0],
          obj[1].filter((prod) =>
            quitQuoteText(prod.name)
              .toUpperCase()
              .includes(quitQuoteText(search).toUpperCase())
          ),
        ])
    );
    return products;
  }

  handlerClickCard(product: Product): void {
    this.customerStore.productToOrder = product;
    this.router.navigate([
      pathRoute([ROUTES.customer.listProducts, ROUTES.customer.loadOrder], {
        commerceUrl: this.commerce.url,
        productId: product.id,
      }),
    ]);
  }

  onScroll(): void {
    const average = document.getElementById('listProducts').scrollHeight * 0.05;
    if (document.getElementById('listProducts').scrollTop > average) {
      this.showSections = true;
      this.headerStyle = {
        opacity: 1,
        height: '12.5rem',
        color: '#6c757d',
        'max-height': '12.5rem',
        'background-color': 'white',
      };
      this.txtColor = '#6c757d';
    } else {
      this.showSections = false;
      this.headerStyle = {
        opacity: 1,
        height: '15rem',
        color: '#e9ecef',
        'max-height': '15rem',
        'background-image': `linear-gradient(rgba(62, 62, 62, 0), rgba(62, 62, 62, 1) 95%), url("${this.commerce.image}")`,
      };
      this.txtColor = '#e9ecef';
    }
  }

  scrollTo(section): void {
    document.querySelector('#' + section).scrollIntoView();
    const scrollTop = document.getElementById('listProducts').scrollTop;
    const scrollOffset = document.getElementById('listProducts').offsetHeight;
    document.getElementById('listProducts').scrollTo(0, scrollTop - 240);
  }

  goBack(): void {
    this.customerStore.commerceSelected = null;
    this.customerStore.order = new Order();
    this.customerStore.products = [];
    this.router.navigate([
      pathRoute([ROUTES.commerces], { commerceId: this.commerce.id }),
    ]);
  }

  showOrder(): void {
    this.router.navigate([
      pathRoute([ROUTES.customer.listProducts, ROUTES.customer.order], {
        commerceUrl: this.commerce.url,
      }),
    ]);
  }
}
