import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import SessionToken from 'src/app/models/db/session-token';

@Injectable({
  providedIn: 'root',
})
export class SessionTokenService {
  collection = 'session_tokens';

  constructor(private firestore: AngularFirestore) {}

  async save(sessionToken: SessionToken): Promise<void> {
    const obj = sessionToken.getSimpleObject();
    delete obj.id;
    await this.firestore
      .collection(this.collection)
      .doc(sessionToken.id)
      .set(obj);
  }

  async deleteByUsername(sessionToken: SessionToken): Promise<void> {
    await this.firestore
      .collection(this.collection, (ref) =>
        ref.where('username', '==', sessionToken.username)
      )
      .get()
      .pipe(
        map(async (data) => {
          for await (const doc of data.docs) {
            await this.delete(doc.id);
          }
          return data;
        })
      )
      .toPromise();
  }

  delete(id: string): Promise<void> {
    return this.firestore.collection(this.collection).doc(id).delete();
  }
}
