import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import Categories from 'src/app/models/db/categories/categories';
import Category from 'src/app/models/db/categories/category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  collection = 'categories';

  constructor(private firestore: AngularFirestore) {}

  async findByCommerceId(commerceId: string): Promise<Category[]> {
    return await this.firestore
      .collection(this.collection, (r) =>
        r.where('commerceId', '==', commerceId)
      )
      .get()
      .pipe(
        map((e) => {
          const categories: Category[] = [];
          e.docs.forEach((doc) => {
            const category = Category.parse(doc.data());
            category.id = doc.id;
            categories.push(category);
          });
          return categories;
        })
      )
      .toPromise();
  }

  async save(category: Category): Promise<void> {
    const id = category.id;
    const categoryDB = category.getSimpleObject();
    delete categoryDB.id;
    return this.firestore.collection(this.collection).doc(id).set(categoryDB);
  }

  async update(category: Category): Promise<void> {
    const id = category.id;
    const categoryDB = category.getSimpleObject();
    delete categoryDB.id;
    return this.firestore
      .collection(this.collection)
      .doc(id)
      .update(categoryDB);
  }
}
