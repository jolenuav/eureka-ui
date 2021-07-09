import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import PaymentMethod from 'src/app/models/db/payment-method';
import Stock from 'src/app/models/db/stock/stock';
import StockMovement from 'src/app/models/db/stock/stock-movement';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  collection = 'stocks';
  constructor(private firestore: AngularFirestore) {}

  async findByCommerceId(commerceId: string): Promise<Stock[]> {
    return await this.firestore
      .collection(this.collection, (ref) =>
        ref.where('commerce', '==', commerceId)
      )
      .get()
      .pipe(
        map((e) => {
          const stocks: Stock[] = [];
          e.docs.forEach((doc) => {
            const stock: Stock = Stock.parse(doc.data());
            stock.id = doc.id;
            stocks.push(stock);
          });
          return stocks;
        })
      )
      .toPromise();
  }

  async findByProductId(productId: string): Promise<Stock[]> {
    return await this.firestore
      .collection(this.collection, (ref) =>
        ref.where('product', '==', productId)
      )
      .get()
      .pipe(
        map((e) => {
          const stocks: Stock[] = [];
          e.docs.forEach((doc) => {
            const stock: Stock = Stock.parse(doc.data());
            stock.id = doc.id;
            stocks.push(stock);
          });
          return stocks;
        })
      )
      .toPromise();
  }

  findByCommerceIdSnapshot(commerceId: string): Observable<Stock[]> {
    return this.firestore
      .collection(this.collection, (ref) =>
        ref.where('commerce', '==', commerceId)
      )
      .snapshotChanges()
      .pipe(
        map((resp) => {
          const stocks: Stock[] = [];
          resp.forEach((instance) => {
            const stock = Stock.parse(instance.payload.doc.data());
            stock.id = instance.payload.doc.id;
            stocks.push(stock);
          });
          return stocks;
        })
      );
  }

  async save(stock: Stock): Promise<void> {
    const id = stock.id;
    const stockDB = stock.getSimpleObject();
    delete stockDB.id;
    await this.firestore.collection(this.collection).doc(id).set(stockDB);
  }

  async update(stock: Stock): Promise<void> {
    const id = stock.id;
    const stockDB = stock.getSimpleObject();
    delete stockDB.id;
    await this.firestore.collection(this.collection).doc(id).update(stockDB);
  }
}
