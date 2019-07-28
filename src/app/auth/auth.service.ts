import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { Apollo } from 'apollo-angular';
import { ApolloQueryResult } from 'apollo-client';
import gql from 'graphql-tag';
import { BehaviorSubject, from } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from './user.model';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _storedToken = new BehaviorSubject<string>(null);

  constructor(private apollo: Apollo) {}

  get storedToken() {
    return this._storedToken.asObservable().pipe(
      map((token) => {
        if (token) {
          return token;
        } else {
          return null;
        }
      })
    );
  }

  get userIsAuthenticated() {
    return this._storedToken.asObservable().pipe(
      map((token) => {
        if (token) {
          return !!token;
        } else {
          return false;
        }
      })
    );
  }

  login(username: string, password: string) {
    return this.apollo
      .query({
        query: gql`
          query LoginUser($username: String!, $password: String!) {
            login(username: $username, password: $password) {
              token
            }
          }
        `,
        variables: {
          username,
          password,
        },
      })
      .toPromise()
      .then((res: ApolloQueryResult<{ login: { token: string } }>) => {
        console.log(res);
        this.setUserData(res.data.login.token);
        return true;
      });
  }

  register(username: string, password: string, email: string, firstName: string, lastName: string) {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation RegisterUser($input: RegisterInput!) {
            register(userData: $input) {
              user {
                id
                username
                lastName
                firstName
                email
              }
              token
            }
          }
        `,
        variables: {
          input: {
            username,
            password,
            firstName,
            lastName,
            email,
          },
        },
      })
      .toPromise()
      .then((res: ApolloQueryResult<{ register: { user: User; token: string } }>) => {
        console.log(res);
        this.setUserData(res.data.register.token);
        return true;
      });
  }

  autoLogin() {
    return from(Storage.get({ key: 'authData' })).pipe(
      map((storedData) => {
        if (!storedData || !storedData.value) {
          return null;
        }
        const parsedData = JSON.parse(storedData.value) as { token: string };
        this._storedToken.next(parsedData.token);
        return !!parsedData.token;
      })
    );
  }

  logout() {
    this._storedToken.next(null);
    Storage.remove({ key: 'authData' });
  }

  private setUserData(token: string) {
    this._storedToken.next(token);
    const data = JSON.stringify({ token });
    console.log('data to store', data);
    Storage.set({ key: 'authData', value: data });
  }
}
