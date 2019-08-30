import { Component, OnInit } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';
import { Subscription } from 'rxjs';
import { SearchPagePostsQuery, SearchPagePostsQueryVariables } from 'src/generated/graphql';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  readonly SEARCH_POSTS = gql`
    query searchPagePosts($limit: Int, $offset: Int, $searchParam: String) {
      getPosts(limit: $limit, offset: $offset, searchParam: $searchParam)
        @connection(key: "searchPosts") {
        id
        body
        created
        likes
        user {
          id
          username
          firstName
          lastName
          email
        }
      }
    }
  `;

  posts = [];
  isLoading = false;
  offset = 0;
  limit = 10;

  private querySubscription: Subscription;
  searchPostsQuery: QueryRef<SearchPagePostsQuery>;

  constructor(private apollo: Apollo) {}

  ngOnInit() {}

  onSearchChange(event) {
    this.isLoading = true;
    console.log(this.isLoading);
    this.apollo
      .query<SearchPagePostsQuery, SearchPagePostsQueryVariables>({
        query: this.SEARCH_POSTS,
        variables: { offset: this.offset, limit: this.limit, searchParam: event.target.value },
        fetchPolicy: 'no-cache',
      })
      .subscribe(({ data, loading }) => {
        this.posts = data.getPosts;
        this.isLoading = loading;
        console.log(this.isLoading);
      });
  }
}
