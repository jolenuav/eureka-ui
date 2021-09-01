import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import Category from 'src/app/models/db/category';

@Injectable({
  providedIn: 'root',
})
export class SessionStoreService {
  _showCategory = new BehaviorSubject<boolean>(false);
  _selectedCategory = new BehaviorSubject<Category>(null);
  _isSubCategory = new BehaviorSubject<boolean>(false);

  constructor() {}

  get showCategory(): boolean {
    const json = sessionStorage.getItem('showCategory');
    if (json) {
      const value = JSON.parse(json);
      this._showCategory.next(value);
      return value;
    }
    return this._showCategory.value;
  }
  set showCategory(value: boolean) {
    sessionStorage.setItem('showCategory', JSON.stringify(value));
    this._showCategory.next(value);
  }

  get selectedCategory(): Category {
    const json = sessionStorage.getItem('selectedCategory');
    if (json) {
      const value = JSON.parse(json);
      this._selectedCategory.next(value);
      return value;
    }
    return this._selectedCategory.value;
  }
  set selectedCategory(value: Category) {
    sessionStorage.setItem('selectedCategory', JSON.stringify(value));
    this._selectedCategory.next(value);
  }

  get isSubCategory(): boolean {
    const json = sessionStorage.getItem('isSubCategory');
    if (json) {
      const value = JSON.parse(json);
      this._isSubCategory.next(value);
      return value;
    }
    return this._isSubCategory.value;
  }
  set isSubCategory(value: boolean) {
    sessionStorage.setItem('isSubCategory', JSON.stringify(value));
    this._isSubCategory.next(value);
  }

  clearInCatalog(): void {
    this.isSubCategory = false;
    this.selectedCategory = null;
    this.showCategory = false;
  }
}
