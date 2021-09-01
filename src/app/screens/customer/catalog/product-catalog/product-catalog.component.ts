import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import Category from 'src/app/models/db/categories/category';
import Product from 'src/app/models/db/product';
import { CustomerStoreService } from 'src/app/services/store/customer-store.service';

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
  @Input() isSubCategories = false;
  @Output() clickEvent = new EventEmitter();

  categoryActived: string;
  list: CategoryProductsModel[] = [];
  constructor(private customerStore: CustomerStoreService) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.categoryParent) {
      this.list = [];
      if (this.categories && this.categories.length > 0) {
        this.loadProductsWithSubCategory();
      } else {
        this.loadProductsWithoutSubCategory();
      }
    }
  }

  loadProductsWithSubCategory(): void {
    this.categories.forEach((category) => {
      if (
        !this.isSubCategories &&
        this.products.some((prod) => prod.category?.id === category.id)
      ) {
        this.list.push({
          category,
          products: this.getProductByCategory(category),
        });
      }
      if (
        this.isSubCategories &&
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
      }
    });
    this.loadProductsWithoutSubCategory();
  }

  loadProductsWithoutSubCategory(): void {
    const obj: CategoryProductsModel = {
      category: this.categoryParent.clone(),
      products: this.products.filter(
        (product) =>
          product.category?.id === this.categoryParent.id &&
          !product.subCategory
      ),
    };
    if (obj.products.length > 0) {
      this.list.push(obj);
    }
  }

  getProductByCategory(category: Category): Product[] {
    {
      const prods = this.products.filter((product) => {
        if (
          product.enabled &&
          !this.isSubCategories &&
          product.category?.id === category.id
        ) {
          return product;
        } else if (
          product.enabled &&
          this.categoryParent.id === product.category?.id &&
          product.subCategory.order === category.order
        ) {
          return product;
        }
      });
      return prods;
    }
  }
}
