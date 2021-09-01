import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import Category from 'src/app/models/db/category';
import Product from 'src/app/models/db/product';
import { CustomerStoreService } from 'src/app/services/store/customer-store.service';
import { quitQuoteText } from 'src/app/utils/commons.function';

@Component({
  selector: 'eu-category-catalog',
  templateUrl: './category-catalog.component.html',
  styleUrls: ['./category-catalog.component.scss'],
})
export class CategoryCatalogComponent implements OnInit {
  categories: Category[] = this.customerStore.categories;
  products: Product[] = this.customerStore.products;

  @Output() clickEvent = new EventEmitter();

  constructor(private customerStore: CustomerStoreService) {}

  ngOnInit(): void {}

  showCard(category: Category): boolean {
    const arr = this.products.filter(
      (prod) => prod.category?.id === category.id
    );
    return arr.length > 0 ? true : false;
  }

  filter(value: string): void {
    if (!value || value.trim() === '') {
      this.categories = this.customerStore.categories;
      return;
    }
    value = quitQuoteText(value.trim()).toUpperCase();
    const productFiltered = this.products.filter(
      (prod) =>
        prod.enabled &&
        (quitQuoteText(prod.name).toUpperCase().includes(value) ||
          (prod.tags &&
            prod.tags.length > 0 &&
            prod.tags.some((tag) =>
              quitQuoteText(tag).toUpperCase().includes(value)
            )) ||
          quitQuoteText(prod.category.description)
            .toUpperCase()
            .includes(value) ||
          (prod.category.subCategories &&
            prod.category.subCategories.length > 0 &&
            prod.category.subCategories.some((sub) =>
              quitQuoteText(sub.description).toUpperCase().includes(value)
            )))
    );
    this.categories = this.customerStore.categories.filter((cat) =>
      productFiltered.some((prod) => prod.category.id === cat.id)
    );
  }
}
