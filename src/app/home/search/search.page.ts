import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';
import { SearchPageQuery, SearchPageQueryVariables, User } from 'src/generated/graphql';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  readonly SEARCH_USERS = gql`
    query searchPage($searchParam: String!) {
      getUsers(searchParam: $searchParam) {
        id
        username
        firstName
        lastName
      }
    }
  `;

  users: User[] = [];
  isLoading = false;
  offset = 0;
  limit = 10;

  searchPostsQuery: QueryRef<SearchPageQuery>;

  constructor(private apollo: Apollo, private router: Router) {}

  ngOnInit() {}

  onSearchChange(event) {
    if (event.target.value === '') {
      this.users = [];
      return;
    }
    this.isLoading = true;
    console.log(this.isLoading);
    this.apollo
      .query<SearchPageQuery, SearchPageQueryVariables>({
        query: this.SEARCH_USERS,
        variables: { searchParam: event.target.value },
        fetchPolicy: 'no-cache',
      })
      .subscribe(({ data, loading }) => {
        this.users = data.getUsers.map((el) => ({ ...el, email: '' }));
        this.isLoading = loading;
        console.log(this.isLoading);
      });
  }
  openProfilePage(userId: number) {
    this.router.navigate(['profile', userId]);
  }
}
