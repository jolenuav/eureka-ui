import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import Commerce from 'src/app/models/db/commerce';
import { UserTypeEnum } from 'src/app/models/enums/user-type.enum';
import { AlertService } from 'src/app/services/alert.service';
import { VendorStoreService } from 'src/app/services/store/vendor-store.service';
import { CONSTANTS } from 'src/app/utils/constants';

@Component({
  selector: 'eu-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  categories: string[] = [];
  commerce: Commerce;
  formGroup = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    price: new FormControl(null, [Validators.required]),
    section: new FormControl(null, [Validators.required]),
    description: new FormControl(null),
    enabled: new FormControl(true, [Validators.required]),
    inStock: new FormControl(false),
    stock: new FormControl({ value: null, disabled: true }),
  });
  showInputCommerce = false;
  subCategories: string[] = [];
  user = this.vendorStore.user;

  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  constructor(
    private alertService: AlertService,
    private vendorStore: VendorStoreService) {}

  ngOnInit(): void {
    if (
      this.user.type === UserTypeEnum.admin &&
      this.user.roles.some((r) => r === CONSTANTS.roles.all)
    ) {
      this.showInputCommerce = true;
    }
  }

  addCategory(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.categories.push(value);
    }
    event.input.value = null;
  }

  addSubCategory(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.subCategories.push(value);
    }
    event.input.value = null;
  }

  removeCategory(category: string): void {
    const index = this.categories.indexOf(category);
    if (index >= 0) {
      this.categories.splice(index, 1);
    }
  }

  removeSubCategory(subCategory: string): void {
    const index = this.subCategories.indexOf(subCategory);
    if (index >= 0) {
      this.subCategories.splice(index, 1);
    }
  }

  onSaveOrUpdate(): void {
    if (this.categories.length === 0) {
      console.log('error');
      this.alertService.successAlert('Debe ingresar una categoría');
      return;
    }
  }
}
