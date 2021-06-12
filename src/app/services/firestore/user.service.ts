import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { utf8_to_b64 } from 'src/app/utils/commons.function';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  collection = 'users';

  constructor(private firestore: AngularFirestore) {}

  async signIn(username: string, password: string): Promise<boolean> {
    return this.firestore
      .collection(this.collection, (ref) =>
        ref
          .where('username', '==', username)
          .where('password', '==', utf8_to_b64(password))
          .limit(1)
      )
      .get()
      .pipe(
        map((data) => {
          if (data.docs.length === 0) {
            return false;
          }
          if (data.docs[0].id) {
            return true;
          }
          return false;
        })
      )
      .toPromise();
  }
}
