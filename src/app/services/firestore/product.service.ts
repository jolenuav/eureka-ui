import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import Product from 'src/app/models/db/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  collection = 'products';
  constructor(private firestore: AngularFirestore) {}

  async findByCommerceId(commerceId: string): Promise<Product[]> {
    return await this.firestore
      .collection(this.collection, (ref) =>
        ref.where('commerce', '==', commerceId)
      )
      .get()
      .pipe(
        map((e) => {
          const products: Product[] = [];
          e.docs.forEach((doc) => {
            const prod = Product.parse(doc.data());
            prod.id = doc.id;
            products.push(prod);
          });
          return products;
        })
      )
      .toPromise();
  }

  async findById(id: string): Promise<Product> {
    return this.firestore
      .collection(this.collection)
      .doc(id)
      .get()
      .pipe(
        map((data) => {
          const product = Product.parse(data.data());
          return product;
        })
      )
      .toPromise();
  }
}
