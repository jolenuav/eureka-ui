import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import Commerce from 'src/app/models/db/commerce';

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
}
