import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Subscription } from 'rxjs';
import {
  FollowDocument,
  FollowMutation,
  FollowMutationVariables,
  MeCacheDocument,
  MeCacheQuery,
  MyProfilePageQueryQuery,
  UnfollowDocument,
  UnfollowMutation,
  UnfollowMutationVariables,
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
    query UserProfilePageQuery($id: ID!) {
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

      canFollow(userId: $id)
    }
  `;

  readonly FOLLOW_USER = gql`
    mutation Follow($userId: ID!) {
      follow(userId: $userId)
    }
  `;
  readonly UNFOLLOW_USER = gql`
    mutation Unfollow($userId: ID!) {
      unfollow(userId: $userId)
    }
  `;

  user: User;
  isLoading = true;
  isMyProfile = true;
  canFollow = true;

  private querySubscription: Subscription;

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    const { me } = this.apollo.getClient().readQuery<MeCacheQuery>({
      query: MeCacheDocument,
    });

    this.route.paramMap.subscribe((paramMap) => {
      console.log(paramMap.get('userId'));
      if (paramMap.has('userId')) {
        this.querySubscription = this.apollo
          .query<UserProfilePageQueryQuery, UserProfilePageQueryQueryVariables>({
            query: this.USER_PROFILE_QUERY,
            variables: { id: paramMap.get('userId') },
          })
          .subscribe(({ data, loading }) => {
            this.user = data.getUser;
            this.isLoading = loading;
            this.isMyProfile = me.id === data.getUser.id;
            this.canFollow = data.canFollow;
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
            this.canFollow = false;
            this.user.posts = this.user.posts.map((el) => ({
              ...el,
              user: this.user,
              comments: [],
            }));
          });
      }
    });
  }

  onFollow() {
    this.apollo
      .mutate<FollowMutation, FollowMutationVariables>({
        mutation: FollowDocument,
        variables: { userId: this.user.id },
      })
      .subscribe(
        (res) => {
          console.log('User followed');
          this.canFollow = false;
        },
        (err) => {
          console.error('User not followed');
        }
      );
  }

  onUnfollow() {
    this.alertCtrl
      .create({
        header: `Unfollow @${this.user.username}?`,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'Okay',
            handler: () => {
              this.apollo
                .mutate<UnfollowMutation, UnfollowMutationVariables>({
                  mutation: UnfollowDocument,
                  variables: { userId: this.user.id },
                })
                .subscribe(
                  (res) => {
                    console.log('User unfollowed');
                    this.canFollow = true;
                  },
                  (err) => {
                    console.error('User not unfollowed');
                  }
                );
            },
          },
        ],
      })
      .then((alert) => {
        alert.present();
      });
  }

  ngOnDestroy() {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
  }
}
