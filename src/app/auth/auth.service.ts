import { Injectable, OnDestroy } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { Apollo } from 'apollo-angular';
import { ApolloQueryResult } from 'apollo-client';
import gql from 'graphql-tag';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from './user.model';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private user = new BehaviorSubject<User>(null);

  constructor(private apollo: Apollo) {}

  get userId() {
    return this.user.asObservable().pipe(
      map((user) => {
        if (user) {
          return user.id;
        } else {
          return null;
        }
      })
    );
  }

  login(username: string, password: string) {
    return this.apollo
      .query({
        query: gql`
          query LoginUser($username: String!, $password: String!) {
            login(username: $username, password: $password)
          }
        `,
        variables: {
          username,
          password,
        },
      })
      .toPromise()
      .then((res: ApolloQueryResult<{ login: number }>) => {
        console.log(res);
        this.setUserData(new User(res.data.login, null));
        return true;
      });
  }

  register(username: string, password: string, email: string, firstName: string, lastName: string) {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation RegisterUser($input: RegisterInput!) {
            register(userData: $input)
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
      .then((res: ApolloQueryResult<{ register: string }>) => {
        console.log(res);
        this.setUserData(new User(res.data.register, null));

        return true;
      });
  }

  private setUserData(user: User) {
    this.user.next(user);
    this.storeAuthData(user.id, user.email);
  }

  private storeAuthData(userId: number, email: string) {
    const data = JSON.stringify({ userId, email });
    console.log('data to store', userId, email);
    Storage.set({ key: 'authData', value: data });
  }

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
}
