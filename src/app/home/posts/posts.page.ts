import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, IonVirtualScroll, ModalController } from '@ionic/angular';
import { Apollo, QueryRef } from 'apollo-angular';
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
    query homePagePosts($limit: Int, $offset: Int) {
      getPosts(limit: $limit, offset: $offset) @connection(key: "getPosts") {
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
  limit = 10;
  offset = 0;
  @ViewChild(IonVirtualScroll, { static: false }) virtualScroll: IonVirtualScroll;
  @ViewChild(IonInfiniteScroll, { static: false }) infiniteScroll: IonInfiniteScroll;

  private querySubscription: Subscription;
  postsQuery: QueryRef<HomePagePostsQuery>;

  constructor(private modalCtrl: ModalController, private apollo: Apollo) {}

  ngOnInit() {
    this.postsQuery = this.apollo.watchQuery<HomePagePostsQuery>({
      query: this.HOME_PAGE_POSTS_QUERY,
      variables: { offset: this.offset, limit: this.limit },
    });

    this.querySubscription = this.postsQuery.valueChanges.subscribe(({ data, loading }) => {
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
            .mutate<AddPostMutation>({
              mutation: this.CREATE_POST_MUTATION,
              variables: data,
              update: (proxy, { data: { createPost } }) => {
                // Read the data from our cache for this query.
                const postsInCache = proxy.readQuery<HomePagePostsQuery>({
                  query: this.HOME_PAGE_POSTS_QUERY,
                  variables: { limit: 10, offset: 0 },
                });

                // Add our todo from the mutation to the start.
                postsInCache.getPosts.unshift(createPost);

                // Write our data back to the cache.
                proxy.writeQuery({
                  query: this.HOME_PAGE_POSTS_QUERY,
                  data: postsInCache,
                });
              },
            })
            .subscribe(
              (res) => {
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

  doRefresh(event) {
    this.postsQuery.refetch().then((res) => {
      this.infiniteScroll.disabled = false;
      this.offset = 0;
      event.target.complete();
    });
  }

  loadData(event) {
    console.log('event', event);
    this.offset += this.limit;

    this.postsQuery
      .fetchMore({
        variables: { offset: this.offset },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return prev;
          }
          return Object.assign({}, prev, {
            getPosts: [...prev.getPosts, ...fetchMoreResult.getPosts],
          });
        },
      })
      .then((res) => {
        if (res.data.getPosts.length === 0) {
          event.target.disabled = true;
        }
        this.virtualScroll.checkEnd();
        event.target.complete();
      });
  }

  ngOnDestroy(): void {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
  }
}
