import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import Commerce from 'src/app/models/db/commerce';
import Product from 'src/app/models/db/product';
import { UserTypeEnum } from 'src/app/models/enums/user-type.enum';
import { ProductService } from 'src/app/services/firestore/product.service';
import { VendorStoreService } from 'src/app/services/store/vendor-store.service';
import { pathRoute } from 'src/app/utils/commons.function';
import { CONSTANTS } from 'src/app/utils/constants';
import { ROUTES } from 'src/app/utils/routes';

@Component({
  selector: 'eu-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.scss'],
})
export class ListProductsComponent implements OnInit, OnDestroy {
  commerce: Commerce;
  productsSubject = new BehaviorSubject<Product[]>([]);
  products$ = this.productsSubject.asObservable();
  showInputCommerce = false;
  user = this.vendorStore.user;
  subscribeProductService: Subscription;

  constructor(
    private productService: ProductService,
    private router: Router,
    private vendorStore: VendorStoreService
  ) {}

  ngOnInit(): void {
    if (
      this.user.type === UserTypeEnum.admin &&
      this.user.roles.some((r) => r === CONSTANTS.roles.all)
    ) {
      this.showInputCommerce = true;
    }
    this.getSnapshotProducts();
  }

  ngOnDestroy(): void {
    this.subscribeProductService?.unsubscribe();
  }

  getSnapshotProducts(): void {
    if (this.commerce) {
      this.subscribeProductService = this.productService
        .findByCommerceIdSnapshot(this.commerce.id)
        .subscribe((products) => {
          this.productsSubject.next(products);
        });
    }
  }

  changeCommerce(commerce: Commerce): void {
    this.subscribeProductService?.unsubscribe();
    this.commerce = commerce;
    this.getSnapshotProducts();
  }

  editProduct(productId: string): void {
    this.router.navigate(
      [pathRoute([ROUTES.partner.main, ROUTES.partner.adminProduct])],
      {
        queryParams: {
          product: productId,
        },
      }
    );
  }
}
