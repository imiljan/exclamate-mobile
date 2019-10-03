import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { BehaviorSubject, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { LoginUserGQL, RegisterUserGQL } from '../../generated/graphql';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private loginUserGql: LoginUserGQL, private registerUserGql: RegisterUserGQL) {
  }

  private _storedToken = new BehaviorSubject<string>(null);

  get storedToken() {
    return this._storedToken.asObservable();
  }

  get userIsAuthenticated() {
    return this._storedToken.asObservable().pipe(
      map((token) => {
        if (token) {
          return !!token;
        } else {
          return false;
        }
      }),
    );
  }

  login(username: string, password: string) {
    return this.loginUserGql
      .fetch({
        username,
        password,
      })
      .pipe(
        tap((res) => {
          this.setUserData(res.data.login.token);
        }),
      );
  }

  logout() {
    this._storedToken.next(null);
    Storage.remove({ key: 'authData' });
  }

  register(username: string, password: string, email: string, firstName: string, lastName: string) {
    return this.registerUserGql
      .mutate({
        input: {
          username,
          password,
          firstName,
          lastName,
          email,
        },
      })
      .pipe(
        tap((res) => {
          this.setUserData(res.data.register.token);
        }),
      );
  }

  autoLogin() {
    return from(Storage.get({ key: 'authData' })).pipe(
      map((storedData) => {
        if (!storedData || !storedData.value) {
          return null;
        }
        const parsedData = JSON.parse(storedData.value) as { token: string };
        console.log('Found user in storage', parsedData);
        return parsedData.token;
      }),
      tap((token) => {
        console.log('Token stored in memory', token);
        this._storedToken.next(token);
      }),
      map((token) => !!token),
    );
  }

  private setUserData(token: string) {
    this._storedToken.next(token);
    const data = JSON.stringify({ token });
    console.log('data to store', data);
    Storage.set({ key: 'authData', value: data });
  }
}
