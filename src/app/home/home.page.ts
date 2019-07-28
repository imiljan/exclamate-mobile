import { Component, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { Apollo } from 'apollo-angular';
import { ApolloQueryResult } from 'apollo-client';
import gql from 'graphql-tag';

import { AuthService } from '../auth/auth.service';

const { Storage } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  constructor(private apollo: Apollo, private authService: AuthService) {
    this.apollo
      .watchQuery({
        query: gql`
          {
            hello
          }
        `,
      })
      .valueChanges.subscribe((res: ApolloQueryResult<{ hello: string }>) => {
        console.log(res.data);
      });
  }

  ngOnInit(): void {
    Storage.get({ key: 'authData' }).then((res) => console.log(res));
  }
}
