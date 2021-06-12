import { Injectable } from '@angular/core';
import SessionToken from '../models/db/session-token';
import { generateID } from '../utils/commons.function';
import { SessionTokenService } from './firestore/sessionToken.service';
import { UserService } from './firestore/user.service';
import * as moment from 'moment';

@Injectable()
export class AuthService {
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
}
