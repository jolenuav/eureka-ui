import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import Category from 'src/app/models/db/categories/category';
import Commerce from 'src/app/models/db/commerce';
import Order from 'src/app/models/db/order/order';
import Product from 'src/app/models/db/product';
import { CustomerStoreService } from 'src/app/services/store/customer-store.service';
import { SessionStoreService } from 'src/app/services/store/session-store.service';
import { pathRoute } from 'src/app/utils/commons.function';
import { ROUTES } from 'src/app/utils/routes';

@Component({
  selector: 'eu-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss'],
})
export class CatalogComponent implements OnInit {
  categories: Category[] = this.customerStore.categories;
  commerce: Commerce = this.customerStore.commerceSelected;
  products: Product[] = this.customerStore.products;
  order: Order = this.customerStore.order;

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

  isSubCategory = false;
  searchProduct = new FormControl(null);
  selectedCategory: Category = null;
  showCategory = true;

  constructor(
    private customerStore: CustomerStoreService,
    private router: Router,
    private sessionStore: SessionStoreService
  ) {}

  ngOnInit(): void {
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

  goBack(): void {
    if (!this.showCategory) {
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
    if (this.showCategory) {
      this.headerStyle = {
        'opacity': 1,
        'height': '100px',
        'color': '#e9ecef',
        'background-image': `linear-gradient(rgba(62, 62, 62, 0), rgba(62, 62, 62, 1) 95%), url("${this.commerce.image}")`,
      };
    }
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
      'color': '#6c757d',
      'background-color': '#f8f9fa',
    };
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
    const scrollTop = document.getElementById('listProducts').scrollTop;
    const scrollOffset = document.getElementById('listProducts').offsetHeight;
    document.getElementById('listProducts').scrollTo(0, scrollTop - 240);
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
        prod.subCategory?.id === this.selectedCategory.subCategories[index].id
    );
  }
}
