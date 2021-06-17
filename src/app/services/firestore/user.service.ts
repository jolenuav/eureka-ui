import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import User from 'src/app/models/db/user';
import { utf8_to_b64 } from 'src/app/utils/commons.function';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  collection = 'users';

  constructor(private firestore: AngularFirestore) {}

  async signIn(username: string, password: string): Promise<User> {
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
          if (data.docs.length > 0) {
            const user = User.parse(data.docs[0].data());
            user.id = data.docs[0].id;
            return user;
          }
          return null;
        })
      )
      .toPromise();
  }

  async findById(id: string): Promise<User> {
    console.log('buscar: ', id);
    return this.firestore
      .collection(this.collection)
      .doc(id)
      .get()
      .pipe(
        map((data) => {
          console.log(data.data());
          const user = User.parse(data.data());
          user.id = id;
          return user;
        })
      )
      .toPromise();
  }
}
