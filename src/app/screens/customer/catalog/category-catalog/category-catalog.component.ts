import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import Category from 'src/app/models/db/categories/category';
import Product from 'src/app/models/db/product';
import { CustomerStoreService } from 'src/app/services/store/customer-store.service';

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
}
