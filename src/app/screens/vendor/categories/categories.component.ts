import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InputFileComponent } from 'src/app/components/input-file/input-file.component';
import Category from 'src/app/models/db/category';
import Commerce from 'src/app/models/db/commerce';
import { UserTypeEnum } from 'src/app/models/enums/user-type.enum';
import { AlertService } from 'src/app/services/alert.service';
import { CategoryService } from 'src/app/services/firestore/category.service';
import { ImageService } from 'src/app/services/firestore/image.service';
import { StoreService } from 'src/app/services/store/store.service';
import { VendorStoreService } from 'src/app/services/store/vendor-store.service';
import { generateID, pathRoute } from 'src/app/utils/commons.function';
import { CONSTANTS } from 'src/app/utils/constants';
import { ROUTES } from 'src/app/utils/routes';

@Component({
  selector: 'eu-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  categoriesDB: Category[] = [];
  commerce: Commerce;
  byDeletes: string[] = [];
  formGroup = new FormGroup({
    image: new FormControl(null),
    imageData: new FormControl(null),
    order: new FormControl(null, [Validators.required]),
    description: new FormControl(null, [Validators.required]),
    parentCategory: new FormControl({ value: null, disabled: true }),
  });
  showInputCommerce = false;
  update = false;
  user = this.vendorStore.user;

  @ViewChild('inputImage') inputImage: InputFileComponent;

  constructor(
    private alertService: AlertService,
    private categoryService: CategoryService,
    private imageService: ImageService,
    private router: Router,
    private store: StoreService,
    private vendorStore: VendorStoreService
  ) {}

  ngOnInit(): void {
    if (
      this.user.type === UserTypeEnum.admin &&
      this.user.roles.some((r) => r === CONSTANTS.roles.all)
    ) {
      this.showInputCommerce = true;
    }
  }

  resetForm(): void {
    this.inputImage.captureImage(null);
    this.formGroup.controls.imageData.setValue(null);
    this.formGroup.controls.image.setValue(null);
    this.formGroup.controls.order.setValue(null);
    this.formGroup.controls.description.setValue(null);
    this.formGroup.controls.parentCategory.setValue(null);
    this.formGroup.markAsUntouched();
    if (this.categories.length > 0) {
      this.formGroup.controls.parentCategory.enable();
    } else {
      this.formGroup.controls.parentCategory.disable();
    }
  }

  async selectedCommerce(commerce: Commerce): Promise<void> {
    this.store.startLoader();
    this.commerce = commerce;
    this.categoriesDB = await this.categoryService.findByCommerceId(
      commerce.id
    );
    this.categories = [...this.categoriesDB];
    this.categories.forEach((cat) => {
      if (!cat.subCategories) {
        cat.subCategories = [];
      }
    });
    this.resetForm();
    this.store.endLoader();
  }

  async onSaveOrUpdate(): Promise<void> {
    this.store.startLoader();
    if (!this.isValid()) {
      this.store.endLoader();
      return;
    }

    for await (const image of this.byDeletes) {
      await this.imageService.delete(image);
    }
    await this.saveImages();
    for await (const category of this.categories) {
      if (this.categoriesDB.some((cat) => cat.id === category.id)) {
        this.categoryService.update(category);
      } else {
        this.categoryService.save(category);
      }
    }
    this.store.endLoader();
    this.alertService.success('Categorias guardadas satisfactoriamente');
    setTimeout(() => {
      this.router.navigate([
        pathRoute([ROUTES.partner.main, ROUTES.partner.orderList]),
      ]);
    }, 3000);
  }

  async saveImages(): Promise<void> {
    for await (const category of this.categories) {
      if (category._imageFile) {
        category.image = await this.imageService.upload(
          category._imageFile,
          `commerces/${category.commerceId}/categories/${category.id}.${
            category._imageFile.type.split('/')[1]
          }`
        );
      }
    }
  }

  isValid(): boolean {
    if (!this.commerce) {
      this.alertService.error('No hay comercio seleccionado');
      return false;
    }
    if (this.categories.length === 0) {
      this.alertService.error('Debe agregar categorías');
      return false;
    }
    return true;
  }

  isValidByAdd(): boolean {
    if (!this.commerce) {
      this.alertService.error('No hay comercio seleccionado');
      return false;
    }
    if (this.formGroup.invalid) {
      this.alertService.error('Error al cargar categoría');
      return false;
    }
    return true;
  }

  addCategory(): void {
    if (!this.isValidByAdd()) {
      return;
    }
    const category = new Category();
    category.id = generateID();
    category.commerceId = this.commerce.id;
    category.order = this.formGroup.controls.order.value;
    category.description = this.formGroup.controls.description.value;
    category._imageFile = this.formGroup.controls.image.value;
    category._imagePreview = this.formGroup.controls.imageData.value;
    category.subCategories = [];

    if (this.categories.some((categ) => categ.order === category.order)) {
      this.alertService.error('Ya existe una categoría en ese orden');
      return;
    }

    this.categories.push(category);
    this.categories.sort(
      (categoryA, categoryB) => categoryA.order - categoryB.order
    );
    this.resetForm();
  }

  addSubcategory(): void {
    if (!this.isValidByAdd()) {
      return;
    }
    const category = new Category();
    category.id = generateID();
    category.commerceId = this.commerce.id;
    category.order = this.formGroup.controls.order.value;
    category.description = this.formGroup.controls.description.value;

    if (!this.formGroup.controls.parentCategory.value) {
      this.alertService.error('Seleccione una categoría padre');
      return;
    }
    const categoryCompare: Category =
      this.formGroup.controls.parentCategory.value;
    if (
      categoryCompare.subCategories.some(
        (categ) => categ.order === category.order
      )
    ) {
      this.alertService.error('Ya existe una subcategoría en ese orden');
      return;
    }

    this.categories.forEach((c) => {
      if (c.id === categoryCompare.id) {
        c.subCategories.push(category);
        c.subCategories.sort(
          (subCategoryA, subCategoryB) =>
            subCategoryA.order - subCategoryB.order
        );
      }
    });
    this.resetForm();
  }

  deleteCategory(index: number): void {
    if (this.categoriesDB.length > 0 && this.categories[index].image) {
      this.byDeletes.push(this.categories[index].image);
    }
    this.categories.splice(index, 1);
    this.resetForm();
  }

  deleteSubCategory(indexCategory: number, indexSubCategory: number): void {
    this.categories[indexCategory].subCategories.splice(indexSubCategory, 1);
    this.resetForm();
  }
}
