import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Subscription } from 'rxjs';
import {
  MyProfilePageQueryQuery,
  User,
  UserProfilePageQueryQuery,
  UserProfilePageQueryQueryVariables,
} from 'src/generated/graphql';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {
  readonly MY_PROFILE_QUERY = gql`
    query MyProfilePageQuery {
      me {
        id
        username
        firstName
        lastName
        email
        bio
        location
        joinedDate
        followers
        following
        posts {
          id
          body
          created
          likes
        }
      }
    }
  `;

  readonly USER_PROFILE_QUERY = gql`
    query UserProfilePageQuery($id: Int!) {
      getUser(id: $id) {
        id
        username
        firstName
        lastName
        email
        bio
        location
        joinedDate
        followers
        following
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
  isMyProfile = true;

  private querySubscription: Subscription;

  constructor(private apollo: Apollo, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      console.log(paramMap.get('userId'));
      if (paramMap.has('userId')) {
        this.querySubscription = this.apollo
          .query<UserProfilePageQueryQuery, UserProfilePageQueryQueryVariables>({
            query: this.USER_PROFILE_QUERY,
            variables: { id: +paramMap.get('userId') },
          })
          .subscribe(({ data, loading }) => {
            this.user = data.getUser;
            this.isLoading = loading;
            this.isMyProfile = false;
            this.user.posts = this.user.posts.map((el) => ({
              ...el,
              user: this.user,
              comments: [],
            }));
          });
      } else {
        this.querySubscription = this.apollo
          .query<MyProfilePageQueryQuery>({
            query: this.MY_PROFILE_QUERY,
          })
          .subscribe(({ data, loading }) => {
            this.user = data.me;
            this.isLoading = loading;
            this.isMyProfile = true;

            console.log(this.user.posts);
            this.user.posts = this.user.posts.map((el) => ({
              ...el,
              user: this.user,
              comments: [],
            }));
          });
      }
    });
  }

  ngOnDestroy() {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
  }
}
