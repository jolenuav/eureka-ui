import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import Commerce from 'src/app/models/db/commerce';
import Order from 'src/app/models/db/order/order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  collection = 'orders';

  constructor(private firestore: AngularFirestore) {}

  async save(order: Order): Promise<void> {
    return await this.firestore
      .collection(this.collection)
      .doc(`${order.commerce}-${order.id}`)
      .set(order.getSimpleObject())
      .then((data) => {
      });
  }

  async findById(id: string): Promise<Commerce> {
    return this.firestore
      .collection(this.collection)
      .doc(id)
      .get()
      .pipe(
        map((data) => {
          const commerce = Commerce.parse(data.data());
          commerce.id = id;
          return commerce;
        })
      )
      .toPromise();
  }

  getAllSnapshot(): Observable<any> {
    return this.firestore
      .collection(this.collection)
      .snapshotChanges()
      .pipe(
        map((r: any[]) => {
          const orders: Order[] = [];
          r.forEach((_) => {
            const order = Order.parse(_.payload.doc.data());
            order.date = _.payload.doc.data().date.toDate();
            orders.push(order);
          });
          return orders;
        })
      );
  }

  changeStatus(order: Order, status: string): void {
    const id = `${order.commerce}-${order.id}`;
    const params: any = {};
    params.status = status;
    params.payOrder = order.getSimpleObject().payOrder;
    this.firestore.collection(this.collection).doc(id).update(params);
  }
}
