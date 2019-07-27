import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { BehaviorSubject } from 'rxjs';

import { User } from './user.model';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _user = new BehaviorSubject<User>(null);

  constructor() {}

  login(username: string, password: string) {
    console.log('Auth service login', username, password);
    return true;
  }
}
