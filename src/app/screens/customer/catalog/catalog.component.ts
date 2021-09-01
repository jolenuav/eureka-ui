import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import Category from 'src/app/models/db/category';
import Commerce from 'src/app/models/db/commerce';
import Order from 'src/app/models/db/order/order';
import Product from 'src/app/models/db/product';
import { CustomerStoreService } from 'src/app/services/store/customer-store.service';
import { SessionStoreService } from 'src/app/services/store/session-store.service';
import { pathRoute } from 'src/app/utils/commons.function';
import { ROUTES } from 'src/app/utils/routes';
import { CategoryCatalogComponent } from './category-catalog/category-catalog.component';
import { ProductCatalogComponent } from './product-catalog/product-catalog.component';

@Component({
  selector: 'eu-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss'],
})
export class CatalogComponent implements OnInit, OnDestroy {
  categories: Category[] = this.customerStore.categories;
  commerce: Commerce = this.customerStore.commerceSelected;
  isSubCategory = false;
  order: Order = this.customerStore.order;
  products: Product[] = this.customerStore.products;
  searchProduct = new FormControl(null);
  selectedCategory: Category = null;
  selectedOrder: number;
  showCategory = true;
  subscription: Subscription;

  headerStyle: any = {
    'opacity': 1,
    'height': '100px',
    'color': '#e9ecef',
    'background-image': `linear-gradient(rgba(62, 62, 62, 0), rgba(62, 62, 62, 1) 95%), url("${this.commerce.image}")`,
  };
  titleCommerce = {
    opacity: 1,
  };
  zIndex = 3;

  @ViewChild('categoryCatalog') categoryCatalog: CategoryCatalogComponent;
  @ViewChild('productCatalog') productCatalog: ProductCatalogComponent;

  constructor(
    private customerStore: CustomerStoreService,
    private router: Router,
    private sessionStore: SessionStoreService
  ) {}

  ngOnInit(): void {
    this.subscribeInputSeacrh();
    this.selectedCategory = null;
    if (this.sessionStore.selectedCategory) {
      this.onClickCategory(
        this.categories.find(
          (cat) => cat.id === this.sessionStore.selectedCategory._id
        )
      );
      return;
    }
    // Muestra la vista de categorías si algun producto posee subcategorías
    this.showCategory = this.categories.some((category) => {
      if (
        this.products.some(
          (product) =>
            product.category?.id === category.id && product.subCategory
        )
      ) {
        return true;
      }
      return false;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  subscribeInputSeacrh(): void {
    this.subscription = this.searchProduct.valueChanges.subscribe((value) => {
      if (this.showCategory) {
        this.categoryCatalog.filter(value);
      } else {
        this.productCatalog.filter(value);
      }
    });
  }

  goBack(): void {
    if (!this.showCategory && this.selectedCategory) {
      this.selectedCategory = null;
      this.showCategory = true;
      return;
    }
    this.sessionStore.clearInCatalog();
    this.customerStore.clearInCatalog();
    this.router.navigate([
      pathRoute([ROUTES.commerces], { commerceId: this.commerce.id }),
    ]);
  }

  focus(): void {
    this.hideHeaderImage();
  }

  blur(): void {
    this.showHeaderImage();
  }

  @HostListener('document:scroll', ['$event'])
  onScroll(): void {
    if (document.documentElement.scrollTop > 20) {
      this.hideHeaderImage();
    } else {
      this.showHeaderImage();
    }
  }

  showHeaderImage(): void {
    // if (this.showCategory) {
    this.headerStyle = {
      'opacity': 1,
      'height': '100px',
      'color': '#e9ecef',
      'background-image': `linear-gradient(rgba(62, 62, 62, 0), rgba(62, 62, 62, 1) 95%), url("${this.commerce.image}")`,
    };
    // }
    this.titleCommerce = {
      opacity: 1,
    };
    this.zIndex = 3;
  }

  hideHeaderImage(): void {
    this.headerStyle = {
      'opacity': 1,
      'color': '#6c757d',
      'background-color': '#f8f9fa',
    };
    this.titleCommerce = {
      opacity: 0,
    };
    this.zIndex = 1;
  }

  onClickCategory(category: Category): void {
    if (category) {
      this.selectedCategory = category;
    }
    this.showCategory = false;
    this.hideHeaderImage();
    this.headerStyle = {
      'opacity': 1,
      'height': '100px',
      'color': '#e9ecef',
      'background-image': `linear-gradient(rgba(62, 62, 62, 0), rgba(62, 62, 62, 1) 95%), url("${this.commerce.image}")`,
    };
    this.zIndex = 3;
    this.titleCommerce = {
      opacity: 1,
    };
    this.isSubCategory =
      this.selectedCategory.subCategories &&
      this.selectedCategory.subCategories.length > 0
        ? true
        : false;
    this.sessionStore.showCategory = this.showCategory;
    this.sessionStore.selectedCategory = this.selectedCategory;
    this.sessionStore.isSubCategory = this.isSubCategory;
  }

  scrollTo(subCategory): void {
    document.querySelector('#' + subCategory).scrollIntoView();
    const scrollTop = document.documentElement.scrollTop;
    if (scrollTop < 300) {
      document.documentElement.scrollTo(0, 0);
    } else {
      document.documentElement.scrollTo(0, scrollTop - 100);
    }
  }

  onClickProduct(product: Product): void {
    this.customerStore.productToOrder = product;
    this.router.navigate([
      pathRoute([ROUTES.customer.listProducts, ROUTES.customer.loadOrder], {
        commerceUrl: this.commerce.url,
        productId: product.id,
      }),
    ]);
  }

  showOrder(): void {
    this.router.navigate([
      pathRoute([ROUTES.customer.listProducts, ROUTES.customer.order], {
        commerceUrl: this.commerce.url,
      }),
    ]);
  }

  showSubCategory(index: number): boolean {
    return this.products.some(
      (prod) =>
        (this.selectedCategory &&
          prod.subCategory?.id ===
            this.selectedCategory.subCategories[index].id) ||
        (!this.selectedCategory &&
          prod.category?.id === this.categories[index].id)
    );
  }

  orderProducts(): void {
    switch (this.selectedOrder) {
      case 1:
        this.productCatalog.orderByAlphabetAsc();
        break;
      case 2:
        this.productCatalog.orderByAlphabetDesc();
        break;
      case 3:
        this.productCatalog.orderByPriceAsc();
        break;
      case 4:
        this.productCatalog.orderByPriceDesc();
        break;
    }
  }
}
