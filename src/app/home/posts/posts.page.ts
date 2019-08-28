import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Apollo } from 'apollo-angular';
import { ApolloQueryResult } from 'apollo-client';
import { FetchResult } from 'apollo-link';
import gql from 'graphql-tag';
import { Subscription } from 'rxjs';
import { AddPostMutation, HomePagePostsQuery } from 'src/generated/graphql';

import { AddPostComponent } from './add-post/add-post.component';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.page.html',
  styleUrls: ['./posts.page.scss'],
})
export class PostsPage implements OnInit, OnDestroy {
  readonly HOME_PAGE_POSTS_QUERY = gql`
    query homePagePosts {
      getPosts {
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
  readonly CREATE_POST_MUTATION = gql`
    mutation addPost($body: String!) {
      createPost(body: $body) {
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

  posts = [{ id: '1', body: 'asd', created: Date.now(), user: null }];
  isLoading = true;

  private querySubscription: Subscription;

  constructor(private modalCtrl: ModalController, private apollo: Apollo) {}

  ngOnInit() {
    this.querySubscription = this.apollo
      .watchQuery({
        query: this.HOME_PAGE_POSTS_QUERY,
      })
      .valueChanges.subscribe(({ data, loading }: ApolloQueryResult<HomePagePostsQuery>) => {
        this.posts = data.getPosts;
        this.isLoading = loading;
      });
  }

  onAddPost() {
    this.modalCtrl.create({ component: AddPostComponent }).then((modalEl) => {
      modalEl.onDidDismiss().then(({ data, role }) => {
        if (!data) {
          return;
        }
        console.log(data);
        console.log(role);
        if (role === 'add') {
          this.apollo
            .mutate({
              mutation: this.CREATE_POST_MUTATION,
              variables: data,
              update: (proxy, { data: { createPost } }: FetchResult<AddPostMutation>) => {
                // Read the data from our cache for this query.
                const postsInCache = proxy.readQuery<HomePagePostsQuery>({
                  query: this.HOME_PAGE_POSTS_QUERY,
                });

                // Add our todo from the mutation to the end.
                postsInCache.getPosts.unshift(createPost);

                // Write our data back to the cache.
                proxy.writeQuery({
                  query: this.HOME_PAGE_POSTS_QUERY,
                  data,
                });
              },
            })
            .subscribe(
              (res: ApolloQueryResult<AddPostMutation>) => {
                console.log(`Created`, res);
              },
              (errorResp) => {
                console.error(`Error`, errorResp);
              }
            );
        }
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
