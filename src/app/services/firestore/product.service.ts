import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
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

  findByCommerceIdSnapshot(commerceId: string): Observable<Product[]> {
    return this.firestore
      .collection(this.collection, (ref) =>
        ref.where('commerce', '==', commerceId)
      )
      .snapshotChanges()
      .pipe(
        map((resp) => {
          const products: Product[] = [];
          resp.forEach((instance) => {
            const prod = Product.parse(instance.payload.doc.data());
            prod.id = instance.payload.doc.id;
            products.push(prod);
          });
          return products;
        })
      );
  }

  async findById(id: string): Promise<Product> {
    return this.firestore
      .collection(this.collection)
      .doc(id)
      .get()
      .pipe(
        map((data) => {
          if (data.data()) {
            const product = Product.parse(data.data());
            product.id = id;
            return product;
          }
          return null;
        })
      )
      .toPromise();
  }

  async save(product: Product): Promise<void> {
    const id = product.id;
    const productDB = product.getSimpleObject();
    delete productDB.id;
    return this.firestore.collection(this.collection).doc(id).set(productDB);
  }
}
