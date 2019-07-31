import { Component, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { Apollo } from 'apollo-angular';
import { ApolloQueryResult } from 'apollo-client';
import gql from 'graphql-tag';

const { Storage } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  constructor(private apollo: Apollo) {
    this.apollo
      .watchQuery({
        query: gql`
          {
            hello
          }
        `,
      })
    .valueChanges.subscribe(
      (res: ApolloQueryResult<{ hello: string }>) => {
        console.log(res);
      },
      (err) => {
        console.log(err);
      },
    );
  }

  ngOnInit(): void {
    Storage.get({ key: 'authData' }).then((res) => console.log(res));
  }
}
