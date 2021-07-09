import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import Commerce from 'src/app/models/db/commerce';
import Product from 'src/app/models/db/product';
import Stock from 'src/app/models/db/stock/stock';
import StockMovement from 'src/app/models/db/stock/stock-movement';
import { MovementStock } from 'src/app/models/enums/movement-stock.enum';
import { UserTypeEnum } from 'src/app/models/enums/user-type.enum';
import { ProductService } from 'src/app/services/firestore/product.service';
import { StockService } from 'src/app/services/firestore/stock.service';
import { StoreService } from 'src/app/services/store.service';
import { VendorStoreService } from 'src/app/services/vendor-store.service';
import { generateID } from 'src/app/utils/commons.function';
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
    enabled: new FormControl(true, [Validators.required]),
    inStock: new FormControl(false),
    stock: new FormControl({ value: null, disabled: true }),
  });
  product: Product = this.activateRoute.snapshot.data.adminProduct.product;
  showInputCommerce = false;
  subscription: Subscription;
  user = this.vendorStore.user;

  constructor(
    private activateRoute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private productService: ProductService,
    private stockService: StockService,
    private store: StoreService,
    private vendorStore: VendorStoreService
  ) {}

  ngOnInit(): void {
    this._subscription();
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
      this.formGroup.controls.enabled.setValue(this.product.enabled);
      this.formGroup.controls.inStock.setValue(this.product.stock);
    }
  }

  _subscription(): void {
    this.subscription = this.formGroup.controls.inStock.valueChanges.subscribe(
      (value) => {
        if (value) {
          this.formGroup.controls.stock.enable();
          this.formGroup.controls.stock.setValidators(Validators.required);
        } else {
          this.formGroup.controls.stock.setValidators(null);
          this.formGroup.controls.stock.disable();
        }
      }
    );
  }

  async onSaveOrUpdate(): Promise<void> {
    this.store.startLoader();
    const products = await this.productService.findByCommerceId(
      this.commerce.id
    );
    const secuency = products.length + 1;
    const id = `${this.commerce.id}-${secuency.toString().padStart(6, '0')}`;
    const product = new Product();
    product.id = this.product ? this.product.id : id;
    product.commerce = this.commerce.id;
    product.name = this.formGroup.controls.name.value;
    product.price = this.formGroup.controls.price.value;
    product.section = this.formGroup.controls.section.value;
    product.description = this.formGroup.controls.description.value;
    product.enabled = this.formGroup.controls.enabled.value;
    if (this.product) {
      await this.productService.update(product);
    } else {
      product.stock = this.formGroup.controls.inStock.value;
      await this.productService.save(product);
      await this.saveInitialStock(product);
    }
    this.store.endLoader();
  }

  async saveInitialStock(product: Product): Promise<void> {
    if (!product.stock) {
      return;
    }
    const stock = new Stock();
    stock.id = generateID();
    stock.commerce = this.commerce.id;
    stock.product = product.id;
    stock.productName = product.name;
    stock.productSection = product.section;
    stock.total = this.formGroup.controls.stock.value;
    const stockMovement = new StockMovement();
    stockMovement.date = new Date();
    stockMovement.quantity = this.formGroup.controls.stock.value;
    stockMovement.type = MovementStock.ADD;
    stockMovement.user = this.user.username;
    stock._movements = [stockMovement];
    await this.stockService.save(stock);
  }
}
