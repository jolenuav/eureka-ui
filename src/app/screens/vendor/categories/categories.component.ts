import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Categories from 'src/app/models/db/categories/categories';
import Category from 'src/app/models/db/categories/category';
import Commerce from 'src/app/models/db/commerce';
import { UserTypeEnum } from 'src/app/models/enums/user-type.enum';
import { AlertService } from 'src/app/services/alert.service';
import { CategoryService } from 'src/app/services/firestore/category.service';
import { StoreService } from 'src/app/services/store/store.service';
import { VendorStoreService } from 'src/app/services/store/vendor-store.service';
import { pathRoute } from 'src/app/utils/commons.function';
import { CONSTANTS } from 'src/app/utils/constants';
import { ROUTES } from 'src/app/utils/routes';

@Component({
  selector: 'eu-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  categories: Categories = new Categories();
  commerce: Commerce;
  formGroup: FormGroup;
  showInputCommerce = false;
  update = false;
  user = this.vendorStore.user;

  constructor(
    private alertService: AlertService,
    private categoryService: CategoryService,
    private router: Router,
    private store: StoreService,
    private vendorStore: VendorStoreService
  ) {
    this.categories.categories = [];
    this.initForm();
  }

  ngOnInit(): void {
    if (
      this.user.type === UserTypeEnum.admin &&
      this.user.roles.some((r) => r === CONSTANTS.roles.all)
    ) {
      this.showInputCommerce = true;
    }
  }

  initForm(): void {
    this.formGroup = new FormGroup({
      order: new FormControl(null, [Validators.required]),
      category: new FormControl(null, [Validators.required]),
      parentCategory: new FormControl({ value: null, disabled: true }),
    });
  }

  resetForm(): void {
    this.formGroup.controls.order.setValue(null);
    this.formGroup.controls.category.setValue(null);
    this.formGroup.controls.parentCategory.setValue(null);
    this.formGroup.markAsUntouched();
    if (this.categories.categories.length > 0) {
      this.formGroup.controls.parentCategory.enable();
    } else {
      this.formGroup.controls.parentCategory.disable();
    }
  }

  async selectedCommerce(commerce: Commerce): Promise<void> {
    this.store.startLoader();
    this.commerce = commerce;
    const resp: Categories = await this.categoryService.findByCommerceId(
      commerce.id
    );

    if (resp) {
      this.update = true;
      this.categories = resp;
    }
    this.categories.id = commerce.id;
    this.resetForm();
    this.store.endLoader();
  }

  async onSaveOrUpdate(): Promise<void> {
    this.store.startLoader();
    if (!this.isValid()) {
      this.store.endLoader();
      return;
    }
    if (this.update) {
      await this.categoryService.update(this.categories);
    } else {
      await this.categoryService.save(this.categories);
    }
    this.store.endLoader();
    this.alertService.success('Categorias guardadas satisfactoriamente');
    setTimeout(() => {
      this.router.navigate([
        pathRoute([ROUTES.partner.main, ROUTES.partner.orderList]),
      ]);
    }, 3000);
  }

  isValid(): boolean {
    if (!this.commerce) {
      this.alertService.error('No hay comercio seleccionado');
      return false;
    }
    if (this.categories.categories.length === 0) {
      this.alertService.error('Debe agregar categorías');
      return false;
    }
    return true;
  }

  addCategory(): void {
    if (!this.commerce) {
      this.alertService.error('No hay comercio seleccionado');
      return;
    }
    if (this.formGroup.invalid) {
      this.alertService.error('Error al cargar categoría');
      return;
    }
    const category = new Category();
    category.order = this.formGroup.controls.order.value;
    category.description = this.formGroup.controls.category.value;
    category.subCategories = [];


    if (
      this.categories.categories.some((categ) => categ.order === category.order)
    ) {
      this.alertService.error('Ya existe una categoría en ese orden');
      return;
    }

    this.categories.categories.push(category);
    this.categories.categories.sort(
      (categoryA, categoryB) => categoryA.order - categoryB.order
    );
    this.resetForm();
  }

  addSubcategory(): void {
    if (!this.commerce) {
      this.alertService.error('No hay comercio seleccionado');
      return;
    }
    if (this.formGroup.invalid) {
      this.alertService.error('Error al cargar categoría');
      return;
    }
    if (!this.formGroup.controls.parentCategory.value) {
      this.alertService.error('Seleccione una categoría padre');
      return;
    }
    const category = new Category();
    category.order = this.formGroup.controls.order.value;
    category.description = this.formGroup.controls.category.value;

    const categoryCompare: Category =
      this.formGroup.controls.parentCategory.value;

    this.categories.categories.map((categ) => {
      if (
        categ.order === categoryCompare.order &&
        categ.description === categoryCompare.description
      ) {
        categ.subCategories.push(category);
      }
    });
    this.resetForm();
  }

  deleteCategory(category: Category): void {
    const index = this.categories.categories.indexOf(category);
    this.categories.categories.splice(index, 1);
    this.resetForm();
  }

  deleteSubCategory(category: Category, subCategory: Category): void {
    const indexCategory = this.categories.categories.indexOf(category);
    const index =
      this.categories.categories[indexCategory].subCategories.indexOf(
        subCategory
      );
    this.categories.categories[indexCategory].subCategories.splice(index, 1);
    this.resetForm();
  }
}
