import { Component, OnDestroy, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Subscription } from 'rxjs';
import { ProfilePageQueryQuery, User } from 'src/generated/graphql';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {
  readonly PROFILE_QUERY = gql`
    query ProfilePageQuery {
      me {
        id
        username
        firstName
        lastName
        email
        joinedDate
        posts {
          id
          body
          created
          likes
        }
      }
    }
  `;

  user: User;
  isLoading = true;

  private querySubscription: Subscription;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.querySubscription = this.apollo
      .query<ProfilePageQueryQuery>({
        query: this.PROFILE_QUERY,
      })
      .subscribe(({ data, loading }) => {
        this.user = data.me;
        this.isLoading = loading;
        console.log(this.user.posts);
        this.user.posts = this.user.posts.map((el) => ({ ...el, user: this.user, comments: [] }));
      });
  }

  ngOnDestroy() {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
  }
}
