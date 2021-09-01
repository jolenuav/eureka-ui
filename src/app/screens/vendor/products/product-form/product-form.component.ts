import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { InputFileComponent } from 'src/app/components/input-file/input-file.component';
import Additional from 'src/app/models/db/additional';
import Category from 'src/app/models/db/categories/category';
import Commerce from 'src/app/models/db/commerce';
import Product from 'src/app/models/db/product';
import Stock from 'src/app/models/db/stock/stock';
import StockMovement from 'src/app/models/db/stock/stock-movement';
import { MovementStock } from 'src/app/models/enums/movement-stock.enum';
import { UserTypeEnum } from 'src/app/models/enums/user-type.enum';
import { AlertService } from 'src/app/services/alert.service';
import { CategoryService } from 'src/app/services/firestore/category.service';
import { ImageService } from 'src/app/services/firestore/image.service';
import { ProductService } from 'src/app/services/firestore/product.service';
import { StockService } from 'src/app/services/firestore/stock.service';
import { StoreService } from 'src/app/services/store/store.service';
import { VendorStoreService } from 'src/app/services/store/vendor-store.service';
import { generateID } from 'src/app/utils/commons.function';
import { CONSTANTS } from 'src/app/utils/constants';

@Component({
  selector: 'eu-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit {
  additionals: Additional[] = [];
  additionalForm = new FormGroup({
    order: new FormControl(null, [Validators.required]),
    name: new FormControl(null, [Validators.required]),
    price: new FormControl(null),
    parent: new FormControl({ value: null, disabled: true }),
  });
  categories: Category[] = [];
  commerceLoged: Commerce = this.vendorStore.commerce;
  commerce: Commerce;
  formGroup = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    price: new FormControl(null, [Validators.required]),
    category: new FormControl(null, [Validators.required]),
    subCategory: new FormControl({ value: null, disabled: true }),
    description: new FormControl(null),
    enabled: new FormControl(true),
    isAdditional: new FormControl(false),
    inStock: new FormControl(false),
    stock: new FormControl({ value: null, disabled: true }),
    tags: new FormControl([]),
    ingredients: new FormControl([]),
    image: new FormControl(null),
    imagePreview: new FormControl(null),
  });
  product: Product = this.activateRoute.snapshot.data.adminProduct.product;
  showInputCommerce = false;
  subCategories: Category[];
  subscriptions: Subscription[];
  user = this.vendorStore.user;

  @ViewChild('inputImage') inputImage: InputFileComponent;

  constructor(
    private activateRoute: ActivatedRoute,
    private alertService: AlertService,
    private categoryService: CategoryService,
    private imageService: ImageService,
    private productService: ProductService,
    private stockService: StockService,
    private store: StoreService,
    private vendorStore: VendorStoreService
  ) {}

  resetAll(): void {
    this.formGroup.controls.name.setValue(null);
    this.formGroup.controls.price.setValue(null);
    this.formGroup.controls.category.setValue(null);
    this.formGroup.controls.subCategory.setValue(null);
    this.formGroup.controls.subCategory.disable();
    this.formGroup.controls.description.setValue(null);
    this.formGroup.controls.enabled.setValue(true);
    this.formGroup.controls.isAdditional.setValue(false);
    this.formGroup.controls.inStock.setValue(false);
    this.formGroup.controls.stock.setValue(null);
    this.formGroup.controls.stock.disable();
    this.formGroup.controls.tags.setValue([]);
    this.formGroup.controls.ingredients.setValue([]);
    this.formGroup.controls.image.setValue(null);
    this.formGroup.markAsUntouched();

    this.additionalForm.controls.order.setValue(null);
    this.additionalForm.controls.name.setValue(null);
    this.additionalForm.controls.price.setValue(null);
    this.additionalForm.controls.parent.setValue(null);
    this.additionalForm.controls.parent.disable();
    this.additionalForm.markAsUntouched();
    this.additionals = [];

    this.inputImage.captureImage(null);
  }

  async ngOnInit(): Promise<void> {
    this._subscription();
    if (
      this.user.type === UserTypeEnum.admin &&
      this.user.roles.some((r) => r === CONSTANTS.roles.all)
    ) {
      this.showInputCommerce = true;
    }

    this.commerce = this.commerceLoged ? this.commerceLoged.clone() : null;
    if (this.product) {
      this.additionals = this.product.additionals;
      await this.loadCategories();
      const category = this.categories.find(
        (cat) =>
          cat.order === this.product.category.order &&
          cat.description === this.product.category.description
      );
      const subCategory = category.subCategories.find(
        (cat) =>
          cat.order === this.product.subCategory.order &&
          cat.description === this.product.subCategory.description
      );
      this.formGroup.controls.name.setValue(this.product.name);
      this.formGroup.controls.price.setValue(this.product.price);
      this.formGroup.controls.category.setValue(category);
      this.formGroup.controls.subCategory.setValue(subCategory);
      this.formGroup.controls.description.setValue(this.product.description);
      this.formGroup.controls.enabled.setValue(this.product.enabled);
      this.formGroup.controls.isAdditional.setValue(this.product.isAdditional);
      this.formGroup.controls.inStock.setValue(this.product.stock);
      this.formGroup.controls.tags.setValue(this.product.tags);
      this.formGroup.controls.ingredients.setValue(this.product.tags);
      this.formGroup.controls.imagePreview.setValue(this.product.image);
    }
  }

  async selectedCommerce(commerce: Commerce): Promise<void> {
    this.store.startLoader();
    this.commerce = commerce;
    this.resetAdditionalForm();
    await this.loadCategories();
    this.store.endLoader();
  }

  async loadCategories(): Promise<void> {
    this.categories = await this.categoryService.findByCommerceId(
      this.commerce.id
    );
  }

  resetAdditionalForm(): void {
    this.additionalForm.controls.order.setValue(null);
    this.additionalForm.controls.name.setValue(null);
    this.additionalForm.controls.price.setValue(null);
    this.additionalForm.controls.parent.setValue(null);
    this.additionalForm.markAsUntouched();
    if (this.additionals.length > 0) {
      this.additionalForm.controls.parent.enable();
    } else {
      this.additionalForm.controls.parent.disable();
    }
  }

  _subscription(): void {
    this.subscriptions = [
      this.formGroup.controls.inStock.valueChanges.subscribe((value) => {
        if (value && !this.product) {
          this.formGroup.controls.stock.enable();
          this.formGroup.controls.stock.setValidators(Validators.required);
        } else {
          this.formGroup.controls.stock.setValidators(null);
          this.formGroup.controls.stock.disable();
        }
      }),
      this.formGroup.controls.category.valueChanges.subscribe(
        (value: Category) => {
          this.formGroup.controls.subCategory.setValue(null);
          if (!value) {
            this.formGroup.controls.subCategory.disable();
            return;
          }
          this.formGroup.controls.subCategory.enable();
          this.subCategories = value.subCategories;
        }
      ),
    ];
  }

  isValidForSaved(): boolean {
    if (!this.product && !this.formGroup.controls.image.value) {
      this.alertService.error('Debe seleccionar una imagen');
      return false;
    }
    if (
      this.additionals.length > 0 &&
      this.additionals.some((section) => section.additionals.length === 0)
    ) {
      this.alertService.error(
        'Se detecto una sección de adicionales sin adicional'
      );
      return false;
    }
    return true;
  }

  async onSaveOrUpdate(): Promise<void> {
    this.store.startLoader();
    if (!this.isValidForSaved()) {
      this.store.endLoader();
      return;
    }
    const id = generateID();
    const product = new Product();
    product.id = this.product ? this.product.id : id;
    product.commerce = this.commerce.id;
    product.name = this.formGroup.controls.name.value;
    product.price = this.formGroup.controls.price.value;
    product.description = this.formGroup.controls.description.value;
    product.enabled = this.formGroup.controls.enabled.value;
    product.tags = this.formGroup.controls.tags.value;
    product.ingredients = this.formGroup.controls.ingredients.value;
    product.additionals = this.additionals;
    product.isAdditional = this.formGroup.controls.isAdditional.value;
    product.stock = this.formGroup.controls.inStock.value;
    // Se elimina las subCategorias en este punto para guardar los datos limpios
    const category = Category.parse(this.formGroup.controls.category.value);
    category.subCategories = null;
    product.category = category;
    product.subCategory = this.formGroup.controls.subCategory.value;
    product.image = this.product ? this.product.image : null;
    const image = this.formGroup.controls.image.value as File;

    if (this.product) {
      if (image) {
        product.image = await this.imageService.upload(
          image,
          `commerces/${this.commerce.id}/products/${product.id}.${
            image.type.split('/')[1]
          }`
        );
      }
      await this.productService.update(product);
    } else {
      product.image = await this.imageService.upload(
        image,
        `commerces/${this.commerce.id}/products/${product.id}.${
          image.type.split('/')[1]
        }`
      );
      await this.productService.save(product);
      if (product.stock) {
        await this.saveInitialStock(product);
      }
    }
    this.alertService.success('Producto guardado satisfactoriamente');
    this.resetAll();
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
    stock.category = product.category.description;
    stock.subCategory = product.category.description;
    stock.total = this.formGroup.controls.stock.value;
    const stockMovement = new StockMovement();
    stockMovement.date = new Date();
    stockMovement.quantity = this.formGroup.controls.stock.value;
    stockMovement.type = MovementStock.ADD;
    stockMovement.user = this.user.username;
    stock._movements = [stockMovement];
    await this.stockService.save(stock);
  }

  isValidForSection(validOrder?: boolean): boolean {
    if (this.additionalForm.invalid) {
      this.alertService.error(
        `Error al cargar  ${validOrder ? 'sección' : 'adicional'}`
      );
      return false;
    }
    if (!this.commerce) {
      this.alertService.error('No hay comercio seleccionado');
      return false;
    }
    if (validOrder) {
      if (
        this.additionals.some(
          (sec) => sec.order === this.additionalForm.controls.order.value
        )
      ) {
        this.alertService.error('Ya existe una sección en ese orden');
        return false;
      }
    }
    return true;
  }

  isValidForAdditional(): boolean {
    if (!this.isValidForSection()) {
      return false;
    }
    if (!this.additionalForm.controls.parent.value) {
      this.alertService.error('Debe seleccionar una sección');
      return false;
    }
    if (!this.additionalForm.controls.price.value) {
      this.alertService.error('Debe especificar un precio');
      return false;
    }
    if (
      this.additionals.some(
        (sec) =>
          sec.order === this.additionalForm.controls.parent.value.order &&
          sec.additionals.some(
            (additional) =>
              additional.order === this.additionalForm.controls.order.value
          )
      )
    ) {
      this.alertService.error('Ya existe una sección en ese orden');
      return false;
    }
    return true;
  }

  addAdditionalSection(): void {
    if (!this.isValidForSection(true)) {
      return;
    }
    const section = new Additional();
    section.order = this.additionalForm.controls.order.value;
    section.description = this.additionalForm.controls.name.value;
    section.additionals = [];
    this.additionals.push(section);
    this.additionals.sort(
      (categoryA, categoryB) => categoryA.order - categoryB.order
    );
    this.resetAdditionalForm();
  }

  addAdditional(): void {
    if (!this.isValidForAdditional()) {
      return;
    }
    const additional = new Additional();
    additional.order = this.additionalForm.controls.order.value;
    additional.description = this.additionalForm.controls.name.value;
    additional.price = this.additionalForm.controls.price.value;
    additional.additionals = [];

    const sectionToCompare: Additional =
      this.additionalForm.controls.parent.value;
    this.additionals.map((section) => {
      if (
        section.order === sectionToCompare.order &&
        section.description === sectionToCompare.description
      ) {
        section.additionals.push(additional);
        section.additionals.sort(
          (additionalA, additionalB) => additionalA.order - additionalB.order
        );
      }
    });
    this.resetAdditionalForm();
  }

  deleteSection(section: Additional): void {
    const index = this.additionals.indexOf(section);
    this.additionals.splice(index, 1);
    this.resetAdditionalForm();
  }

  deleteAdditional(section: Additional, additional: Additional): void {
    const indexSection = this.additionals.indexOf(section);
    const index =
      this.additionals[indexSection].additionals.indexOf(additional);
    this.additionals[indexSection].additionals.splice(index, 1);
    this.resetAdditionalForm();
  }
}
