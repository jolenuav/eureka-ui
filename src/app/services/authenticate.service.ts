import { Injectable } from '@angular/core';
import SessionToken from '../models/db/session-token';
import { generateID } from '../utils/commons.function';
import { SessionTokenService } from './firestore/sessionToken.service';
import { UserService } from './firestore/user.service';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class AuthService {
  userLogged = new BehaviorSubject<boolean>(this._tokenValid());

  constructor(
    private userService: UserService,
    private sessionTokenService: SessionTokenService
  ) {}

  async signIn(username: string, password: string): Promise<boolean> {
    const resp = await this.userService.signIn(username, password);
    if (resp) {
      const sessionToken = new SessionToken();
      sessionToken.id = generateID();
      sessionToken.username = username;
      sessionToken.expireToken = this.calculateExpireDate();
      sessionStorage.setItem(
        'sessionToken',
        JSON.stringify(sessionToken.getSimpleObject())
      );
      await this.sessionTokenService.deleteByUsername(sessionToken);
      await this.sessionTokenService.save(sessionToken);
    }
    return resp;
  }

  calculateExpireDate(): Date {
    const currentMoment = moment().add(1, 'hour');
    return currentMoment.toDate();
  }

  _tokenValid(): boolean {
    const obj = JSON.parse(sessionStorage.getItem('sessionToken'));
    if (!obj) {
      return false;
    }
    const sessionToken = SessionToken.parse(obj);
    const tokenDate = moment(sessionToken.expireToken);
    const currentDate = moment();
    if (tokenDate.diff(currentDate, 'minutes') > 0) {
      return true;
    }
    return false;
  }

  set _userLogged(isLogged: boolean) {
    this.userLogged.next(isLogged);
  }
}
