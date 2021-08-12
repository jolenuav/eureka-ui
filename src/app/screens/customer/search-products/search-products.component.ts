import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import Commerce from 'src/app/models/db/commerce';
import Order from 'src/app/models/db/order/order';
import Product from 'src/app/models/db/product';
import { CustomerStoreService } from 'src/app/services/customer-store.service';
import { StockService } from 'src/app/services/firestore/stock.service';
import { StoreService } from 'src/app/services/store.service';
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
  subscriptions: Subscription[] = [];

  constructor(
    private activedRoute: ActivatedRoute,
    private customerStore: CustomerStoreService,
    private router: Router,
    private stockService: StockService,
    private store: StoreService
  ) {}

  ngOnDestroy(): void {
    this.subscriptions.forEach((element) => element.unsubscribe());
  }

  async ngOnInit(): Promise<void> {
    this.headerStyle = {
      opacity: 1,
      height: '240px',
      color: '#e9ecef',
      'max-height': '240px',
      'background-image': `linear-gradient(rgba(62, 62, 62, 0), rgba(62, 62, 62, 1) 95%), url("${this.commerce.image}")`,
    };
    this.order.commerce = this.commerce.id;
    this.order.commerceName = this.commerce.name;
    this.initialSubscription();
  }

  initialSubscription(): void {
    this.subscriptions.push(
      this.searchProduct.valueChanges.subscribe((search: string) => {
        if (!search || search.trim() === '') {
          this.productsBySectionFiltered = this.productsBySection;
          search = '';
          return;
        }
        this.productsBySectionFiltered = this.filterProducts(search);
      })
    );
  }

  filterProducts(search: string): Map<string, Product[]> {
    const products = new Map(
      [...this.productsBySection.entries()]
        .filter((entry) =>
          entry[1].some(
            (prod) =>
              quitQuoteText(prod.name)
                .toUpperCase()
                .includes(quitQuoteText(search).toUpperCase()) ||
              (prod.tags &&
                prod.tags !== [] &&
                prod.tags.some((tag) =>
                  quitQuoteText(tag)
                    .toUpperCase()
                    .includes(quitQuoteText(search).toUpperCase())
                ))
          )
        )
        .map((obj) => [
          obj[0],
          obj[1].filter(
            (prod) =>
              quitQuoteText(prod.name)
                .toUpperCase()
                .includes(quitQuoteText(search).toUpperCase()) ||
              (prod.tags &&
                prod.tags !== [] &&
                prod.tags.some((tag) =>
                  quitQuoteText(tag)
                    .toUpperCase()
                    .includes(quitQuoteText(search).toUpperCase())
                ))
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

  @HostListener('document:scroll', ['$event'])
  onScroll(): void {
    if (document.documentElement.scrollTop > 1) {
      this.hideHeaderImage();
    } else {
      this.showHeaderImage();
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

  focus(): void {
    this.hideHeaderImage();
  }

  blur(): void {
    this.showHeaderImage();
  }

  showHeaderImage(): void {
    this.showSections = false;
    this.headerStyle = {
      opacity: 1,
      height: '240px',
      color: '#e9ecef',
      'max-height': '240px',
      'background-image': `linear-gradient(rgba(62, 62, 62, 0), rgba(62, 62, 62, 1) 95%), url("${this.commerce.image}")`,
    };
    this.txtColor = '#e9ecef';
  }
  hideHeaderImage(): void {
    this.showSections = true;
    this.headerStyle = {
      opacity: 1,
      height: '200px',
      color: '#6c757d',
      'max-height': '200px',
      'background-color': 'white',
    };
    this.txtColor = '#6c757d';
  }
}
