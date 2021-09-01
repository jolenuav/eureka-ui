import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import Category from 'src/app/models/db/category';
import Product from 'src/app/models/db/product';
import { CustomerStoreService } from 'src/app/services/store/customer-store.service';
import { quitQuoteText } from 'src/app/utils/commons.function';

export class CategoryProductsModel {
  category: Category;
  products: Product[];
}

@Component({
  selector: 'eu-product-catalog',
  templateUrl: './product-catalog.component.html',
  styleUrls: ['./product-catalog.component.scss'],
})
export class ProductCatalogComponent implements OnInit, OnChanges {
  products: Product[] = this.customerStore.products;

  @Input() categoryParent: Category;
  @Input() categories: Category[];
  @Input() hasSubCategories = false;
  @Output() clickEvent = new EventEmitter();

  categoryActived: string;
  listClean: CategoryProductsModel[] = [];
  list: CategoryProductsModel[] = [];
  constructor(private customerStore: CustomerStoreService) {}

  ngOnInit(): void {
    if (!this.categoryParent) {
      this.loadProductsCategories();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.categoryParent && this.categoryParent) {
      this.list = [];
      if (this.categories && this.categories.length > 0) {
        this.loadProductsCategories();
      } else {
        this.loadProductsWithoutSubCategory();
      }
    }
  }

  loadProductsCategories(): void {
    this.categories.forEach((category) => {
      if (
        !this.hasSubCategories &&
        this.products.some((prod) => prod.category?.id === category.id)
      ) {
        this.list.push({
          category,
          products: this.getProductByCategory(category),
        });
        this.listClean.push({
          category,
          products: this.getProductByCategory(category),
        });
      }
      if (
        this.hasSubCategories &&
        this.products.some(
          (prod) =>
            prod.category?.id === this.categoryParent.id &&
            prod.subCategory?.order === category.order
        )
      ) {
        this.list.push({
          category,
          products: this.getProductByCategory(category),
        });
        this.listClean.push({
          category,
          products: this.getProductByCategory(category),
        });
      }
    });
    if (this.categoryParent) {
      this.loadProductsWithoutSubCategory();
    }
  }

  loadProductsWithoutSubCategory(): void {
    const obj: CategoryProductsModel = {
      category: this.categoryParent.clone(),
      products: this.products.filter(
        (product) =>
          product.enabled &&
          product.category?.id === this.categoryParent.id &&
          !product.subCategory
      ),
    };
    if (obj.products.length > 0) {
      this.list.push(obj);
      this.listClean.push(obj);
    }
  }

  getProductByCategory(category: Category): Product[] {
    {
      const prods = this.products.filter((product) => {
        if (
          product.enabled &&
          !this.hasSubCategories &&
          product.category?.id === category.id
        ) {
          return product;
        } else if (
          product.enabled &&
          this.categoryParent?.id === product.category?.id &&
          product.subCategory?.id === category.id
        ) {
          return product;
        }
      });
      return prods;
    }
  }

  filter(value: string): void {
    this.list = [];
    if (!value || value.trim() === '') {
      this.list = [...this.listClean];
      return;
    }

    value = quitQuoteText(value.trim()).toUpperCase();

    this.listClean.forEach((item) => {
      if (
        item.products.some(
          (prod) =>
            quitQuoteText(prod.name).toUpperCase().includes(value) ||
            prod.tags?.some((tag) =>
              quitQuoteText(tag).toUpperCase().includes(value)
            ) ||
            (this.hasSubCategories &&
              quitQuoteText(prod.subCategory.description)
                .toUpperCase()
                .includes(value)) ||
            (!this.hasSubCategories &&
              quitQuoteText(prod.category.description)
                .toUpperCase()
                .includes(value))
        )
      ) {
        this.list.push({ ...item });
      }
    });
    this.list.forEach((item) => {
      item.products = item.products.filter(
        (prod) =>
          quitQuoteText(prod.name).toUpperCase().includes(value) ||
          prod.tags?.some((tag) =>
            quitQuoteText(tag).toUpperCase().includes(value)
          ) ||
          (this.hasSubCategories &&
            quitQuoteText(prod.subCategory.description)
              .toUpperCase()
              .includes(value)) ||
          (!this.hasSubCategories &&
            quitQuoteText(prod.category.description)
              .toUpperCase()
              .includes(value))
      );
    });
  }

  orderByAlphabetAsc(): void {
    this.list.forEach((item) => {
      item.products = item.products.sort((prodA, pordB) =>
        prodA.name > pordB.name ? 1 : -1
      );
    });
  }

  orderByAlphabetDesc(): void {
    this.list.forEach((item) => {
      item.products = item.products.sort((prodA, pordB) =>
        prodA.name < pordB.name ? 1 : -1
      );
    });
  }

  orderByPriceAsc(): void {
    this.list.forEach((item) => {
      item.products = item.products.sort((prodA, pordB) =>
        prodA.price > pordB.price ? 1 : -1
      );
    });
  }

  orderByPriceDesc(): void {
    this.list.forEach((item) => {
      item.products = item.products.sort((prodA, pordB) =>
        prodA.price < pordB.price ? 1 : -1
      );
    });
  }
}
