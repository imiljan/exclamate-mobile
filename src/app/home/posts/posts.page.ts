import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Apollo } from 'apollo-angular';
import { ApolloQueryResult } from 'apollo-client';
import gql from 'graphql-tag';
import { Subscription } from 'rxjs';
import { HomePagePostsQuery } from 'src/generated/graphql';

import { AddPostComponent } from './add-post/add-post.component';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.page.html',
  styleUrls: ['./posts.page.scss'],
})
export class PostsPage implements OnInit, OnDestroy {
  posts = [{ id: '1', body: 'asd', created: Date.now(), user: null }];
  isLoading = true;

  private querySubscription: Subscription;

  constructor(private modalCtrl: ModalController, private apollo: Apollo) {}

  ngOnInit() {
    this.querySubscription = this.apollo
      .watchQuery({
        query: gql`
          query homePagePosts {
            getPosts {
              id
              body
              created
              user {
                id
                username
                firstName
                lastName
                email
              }
            }
          }
        `,
      })
      .valueChanges.subscribe(({ data, loading }: ApolloQueryResult<HomePagePostsQuery>) => {
        this.posts = data.getPosts;
        this.isLoading = loading;
      });
  }

  onAddPost() {
    this.modalCtrl.create({ component: AddPostComponent }).then((modalEl) => {
      modalEl.onDidDismiss().then((modalData) => {
        if (!modalData.data) {
          return;
        }
        console.log(modalData.data);
        console.log(modalData.role);
      });
      modalEl.present();
    });
  }

  ngOnDestroy(): void {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
  }
}
