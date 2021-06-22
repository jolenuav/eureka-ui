import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import Commerce from 'src/app/models/db/commerce';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root',
})
export class CommerceService {
  collection = 'commerces';

  constructor(private firestore: AngularFirestore) {}

  async findAll(): Promise<Commerce[]> {
    return this.firestore
      .collection(this.collection, (ref) => ref.where('enabled', '==', true))
      .get()
      .pipe(
        map((data) => {
          const commerces: Commerce[] = [];
          data.docs.forEach((doc) => {
            const commerce = Commerce.parse(doc.data());
            commerce.id = doc.id;
            commerces.push(commerce);
          });
          return commerces;
        })
      )
      .toPromise();
  }

  findAllSnapshot(): Observable<Commerce[]> {
    return this.firestore
      .collection(this.collection, (ref) => ref.where('enabled', '==', true))
      .snapshotChanges()
      .pipe(
        map((resp) => {
          const commerces: Commerce[] = [];
          resp.forEach((instance) => {
            const commerce = Commerce.parse(instance.payload.doc.data());
            commerce.id = instance.payload.doc.id;
            commerces.push(commerce);
          });
          return commerces;
        })
      );
  }

  async findById(id: string): Promise<Commerce> {
    return this.firestore
      .collection(this.collection)
      .doc(id)
      .get()
      .pipe(
        map((data) => {
          if (data.data()) {
            const commerce = Commerce.parse(data.data());
            commerce.id = id;
            return commerce;
          }
          return null;
        })
      )
      .toPromise();
  }

  async findByUrl(url: string): Promise<Commerce> {
    return this.firestore
      .collection(this.collection, (ref) => ref.where('url', '==', url))
      .get()
      .pipe(
        map((data) => {
          if (data.docs.length > 0) {
            const commerce = Commerce.parse(data.docs[0].data());
            commerce.id = data.docs[0].id;
            return commerce;
          }
          return null;
        })
      )
      .toPromise();
  }

  async save(commerce: Commerce): Promise<void> {
    const id = commerce.id;
    const commerceDB = commerce.getSimpleObject();
    const locationData = new firebase.default.firestore.GeoPoint(
      commerce.geolacation.latitude,
      commerce.geolacation.longitude
    );
    commerceDB.geolacation = locationData;
    delete commerceDB.id;
    return this.firestore.collection(this.collection).doc(id).set(commerceDB);
  }
}
