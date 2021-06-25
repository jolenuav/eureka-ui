import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import PaymentMethod from 'src/app/models/db/payment-method';

@Injectable({
  providedIn: 'root',
})
export class PaymentMethodsService {
  collection = 'payment_methods';
  constructor(private firestore: AngularFirestore) {}

  async findByCommerceId(commerceId: string): Promise<PaymentMethod[]> {
    return await this.firestore
      .collection(this.collection, (ref) =>
        ref.where('commerce', '==', commerceId)
      )
      .get()
      .pipe(
        map((e) => {
          const paymentMethods: PaymentMethod[] = [];
          e.docs.forEach((doc) => {
            const pm: PaymentMethod = PaymentMethod.parse(doc.data());
            pm.id = doc.id;
            paymentMethods.push(pm);
          });
          return paymentMethods;
        })
      )
      .toPromise();
  }

  async save(paymentMethod: PaymentMethod): Promise<void> {
    const id = paymentMethod.id;
    const paymentMethodDB = paymentMethod.getSimpleObject();
    delete paymentMethodDB.id;
    return this.firestore
      .collection(this.collection)
      .doc(id)
      .set(paymentMethodDB);
  }

  async deleteByCommerce(commerceId: string): Promise<void> {
    return this.firestore
      .collection(this.collection, (ref) =>
        ref.where('commerce', '==', commerceId)
      )
      .doc()
      .delete();
  }
}
