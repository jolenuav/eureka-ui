import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import Commerce from 'src/app/models/db/commerce';
import Product from 'src/app/models/db/product';
import { UserTypeEnum } from 'src/app/models/enums/user-type.enum';
import { ProductService } from 'src/app/services/firestore/product.service';
import { StoreService } from 'src/app/services/store.service';
import { VendorStoreService } from 'src/app/services/vendor-store.service';
import { CONSTANTS } from 'src/app/utils/constants';

@Component({
  selector: 'eu-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit {
  commerce: Commerce = this.vendorStore.commerce;
  formGroup = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    price: new FormControl(null, [Validators.required]),
    section: new FormControl(null, [Validators.required]),
    description: new FormControl(null),
  });
  product: Product = this.activateRoute.snapshot.data.adminProduct.product;
  showInputCommerce = false;
  user = this.vendorStore.user;

  constructor(
    private activateRoute: ActivatedRoute,
    private productService: ProductService,
    private store: StoreService,
    private vendorStore: VendorStoreService
  ) {
  }

  ngOnInit(): void {
    if (
      this.user.type === UserTypeEnum.admin &&
      this.user.roles.some((r) => r === CONSTANTS.roles.all)
    ) {
      this.showInputCommerce = true;
    }
    if (this.product) {
      this.formGroup.controls.name.setValue(this.product.name);
      this.formGroup.controls.price.setValue(this.product.price);
      this.formGroup.controls.section.setValue(this.product.section);
      this.formGroup.controls.description.setValue(this.product.description);
    }
  }

  async onSaveOrUpdate(): Promise<void> {
    this.store.startLoader();
    const products = await this.productService.findByCommerceId(
      this.commerce.id
    );
    const secuency = products.length + 1;
    const id = `${this.commerce.id}-${secuency
      .toString()
      .padStart(6, '0')}`;
    const product = new Product();
    product.id = this.product ? this.product.id : id;
    product.commerce = this.commerce.id;
    product.name = this.formGroup.controls.name.value;
    product.price = this.formGroup.controls.price.value;
    product.section = this.formGroup.controls.section.value;
    product.description = this.formGroup.controls.description.value;
    if (this.product) {
      await this.productService.update(product);
    } else {
      await this.productService.save(product);
    }
    this.store.endLoader();
  }
}
