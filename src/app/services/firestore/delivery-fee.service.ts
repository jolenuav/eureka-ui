import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import Commerce from 'src/app/models/db/commerce';
import DeliveryFee from 'src/app/models/db/delivery-fee';

@Injectable({
  providedIn: 'root',
})
export class DeliveryFeeService {
  collection = 'delivery_fee';

  constructor(private firestore: AngularFirestore) {}

  async findAll(): Promise<DeliveryFee[]> {
    return this.firestore
      .collection(this.collection)
      .get()
      .pipe(
        map((data) => {
          const deliveryFees: DeliveryFee[] = [];
          data.docs.forEach((doc) => {
            const deliveryFee = DeliveryFee.parse(doc.data());
            deliveryFee.id = doc.id;
            deliveryFees.push(deliveryFee);
          });
          return deliveryFees;
        })
      )
      .toPromise();
  }

}
