import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { FollowGQL, MyProfilePageQueryGQL, UnfollowGQL, User, UserProfilePageQueryGQL } from '../../generated/graphql';

import { EditProfileComponent } from './edit-profile/edit-profile.component';
import gql from 'graphql-tag';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {
  user: User;
  isLoading = true;
  isMyProfile = true;
  canFollow = true;

  private querySubscription: Subscription;

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private alertCtrl: AlertController,
    private modalController: ModalController,
    private userProfilePageQuery: UserProfilePageQueryGQL,
    private myProfilePageQuery: MyProfilePageQueryGQL,
    private follow: FollowGQL,
    private unfollow: UnfollowGQL,
  ) {
  }

  ngOnInit() {
    const { me } = this.apollo.getClient().readQuery({
      query: gql`
        query MeCache {
          me {
            id
            username
          }
        }
      `,
    });

    this.route.paramMap.subscribe((paramMap) => {
      console.log(paramMap.get('userId'));
      if (paramMap.has('userId')) {
        this.querySubscription = this.userProfilePageQuery
          .fetch({ id: paramMap.get('userId') })
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
        this.querySubscription = this.myProfilePageQuery.fetch().subscribe(({ data, loading }) => {
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
    this.follow.mutate({ userId: this.user.id }).subscribe(
      (res) => {
        console.log('User followed');
        this.canFollow = false;
      },
      (err) => {
        console.error('User not followed');
      },
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
              this.unfollow.mutate({ userId: this.user.id }).subscribe(
                (res) => {
                  console.log('User unfollowed');
                  this.canFollow = true;
                },
                (err) => {
                  console.error('User not unfollowed');
                },
              );
            },
          },
        ],
      })
      .then((alert) => {
        alert.present();
      });
  }

  onEdit() {
    this.modalController
      .create({
        component: EditProfileComponent,
        componentProps: {
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          email: this.user.email,
        },
      })
      .then((modal) => modal.present());
  }

  ngOnDestroy() {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
  }
}
