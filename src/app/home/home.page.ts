import { Component } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { ApolloQueryResult } from 'apollo-client';
import gql from 'graphql-tag';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(private apollo: Apollo) {
    this.apollo
      .watchQuery({
        query: gql`
          {
            hello
          }
        `,
      })
      .valueChanges.subscribe((res: ApolloQueryResult<{ hello: string }>) => {
        console.log(res);
      });
  }
}
