import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import Categories from 'src/app/models/db/categories/categories';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  collection = 'categories';

  constructor(private firestore: AngularFirestore) {}

  async findByCommerceId(commerceId: string): Promise<Categories> {
    return await this.firestore
      .collection(this.collection)
      .doc(commerceId)
      .get()
      .pipe(
        map((e) => {
          if (!e.data()) {
            return null;
          }
          const categories = Categories.parse(e.data());
          return categories;
        })
      )
      .toPromise();
  }

  async save(categories: Categories): Promise<void> {
    const id = categories.id;
    const categoriesDB = categories.getSimpleObject();
    delete categoriesDB.id;
    return this.firestore.collection(this.collection).doc(id).set(categoriesDB);
  }

  async update(categories: Categories): Promise<void> {
    const id = categories.id;
    const categoriesDB = categories.getSimpleObject();
    delete categoriesDB.id;
    return this.firestore
      .collection(this.collection)
      .doc(id)
      .update(categoriesDB);
  }
}
