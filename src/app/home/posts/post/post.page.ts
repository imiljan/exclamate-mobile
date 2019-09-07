import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Subscription } from 'rxjs';
import {
  CommentMutation,
  CommentMutationVariables,
  DeletePostMutation,
  DeletePostMutationVariables,
  EditPostMutation,
  EditPostMutationVariables,
  HomePagePostsDocument,
  HomePagePostsQuery,
  HomePagePostsQueryVariables,
  MeCacheDocument,
  MeCacheQuery,
  Post,
  PostPageQueryDocument,
  PostPageQueryQuery,
  PostPageQueryQueryVariables,
} from 'src/generated/graphql';

import { AddPostComponent } from '../add-post/add-post.component';

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})
export class PostPage implements OnInit, OnDestroy {
  readonly POST_QUERY = gql`
    query PostPageQuery($id: ID!) {
      getPost(id: $id) {
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
        comments {
          id
          body
          created
          user {
            id
            username
            email
            firstName
            lastName
          }
        }
      }
    }
  `;
  readonly COMMENT_MUTATION = gql`
    mutation Comment($postId: Int!, $body: String!) {
      createComment(postId: $postId, body: $body) {
        id
        body
        created
        user {
          id
          username
          email
          firstName
          lastName
        }
      }
    }
  `;

  readonly DELETE_POST_MUTATION = gql`
    mutation DeletePost($postId: ID!) {
      deletePost(postId: $postId)
    }
  `;

  readonly EDIT_POST_MUTATION = gql`
    mutation EditPost($postId: ID!, $body: String!) {
      editPost(postId: $postId, body: $body) {
        id
        body
      }
    }
  `;

  post: Post;
  isLoading = true;
  comment = '';
  isMyPost = false;

  private querySubscription: Subscription;

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private actionSheetController: ActionSheetController,
    private modalCtrl: ModalController,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('postId')) {
        this.router.navigate(['home', 'tabs', 'posts']);
      }

      const { me } = this.apollo.getClient().readQuery<MeCacheQuery>({
        query: MeCacheDocument,
      });

      console.log('paramMap', paramMap.get('postId'));
      this.querySubscription = this.apollo
        .watchQuery<PostPageQueryQuery, PostPageQueryQueryVariables>({
          query: this.POST_QUERY,
          variables: { id: paramMap.get('postId') },
        })
        .valueChanges.subscribe(({ data, loading }) => {
          this.post = data.getPost;
          this.isLoading = loading;
          this.isMyPost = me.id === data.getPost.user.id;
        });
    });
  }

  onComment() {
    console.log(this.comment);
    this.apollo
      .mutate<CommentMutation, CommentMutationVariables>({
        mutation: this.COMMENT_MUTATION,
        variables: { postId: +this.post.id, body: this.comment },
        update: (proxy, { data: { createComment } }) => {
          // Read the data from our cache for this query.
          const postInCache = proxy.readQuery<PostPageQueryQuery, PostPageQueryQueryVariables>({
            query: this.POST_QUERY,
            variables: { id: this.post.id },
          });

          // Add our todo from the mutation to the start.
          postInCache.getPost.comments.push(createComment);

          // Write our data back to the cache.
          proxy.writeQuery({
            query: this.POST_QUERY,
            data: postInCache,
          });
        },
      })
      .subscribe((res) => {
        console.log(`created`, res);
      });
    this.comment = '';
  }

  presentActionSheet() {
    this.actionSheetController
      .create({
        header: 'Post options',
        buttons: [
          {
            text: 'Delete',
            role: 'destructive',
            icon: 'trash',
            cssClass: 'primary',
            handler: () => {
              this.apollo
                .mutate<DeletePostMutation, DeletePostMutationVariables>({
                  mutation: this.DELETE_POST_MUTATION,
                  variables: { postId: this.post.id },
                  update: (proxy, { data: { deletePost } }) => {
                    // Read the data from our cache for this query.
                    const postsInCache = proxy.readQuery<
                      HomePagePostsQuery,
                      HomePagePostsQueryVariables
                    >({
                      query: HomePagePostsDocument,
                      variables: { limit: 10, offset: 0 },
                    });

                    // Add our todo from the mutation to the start.
                    postsInCache.getPosts = postsInCache.getPosts.filter(
                      (el) => el.id !== this.post.id
                    );

                    // Write our data back to the cache.
                    proxy.writeQuery({
                      query: HomePagePostsDocument,
                      data: postsInCache,
                    });
                  },
                })
                .subscribe((res) => {
                  if (res.data.deletePost === true) {
                    console.log('post deleted');
                    this.router.navigate(['home', 'tabs', 'posts']);
                  } else {
                    console.log('post not deleted');
                  }
                });
            },
          },
          {
            text: 'Edit',
            icon: 'create',
            // cssClass: 'action-sheet-item',
            handler: () => {
              this.modalCtrl
                .create({ component: AddPostComponent, componentProps: { post: this.post } })
                .then((modalEl) => {
                  modalEl.onDidDismiss().then(({ data, role }) => {
                    if (!data) {
                      return;
                    }
                    console.log(data);
                    console.log(role);
                    if (role === 'edit') {
                      this.apollo
                        .mutate<EditPostMutation, EditPostMutationVariables>({
                          mutation: this.EDIT_POST_MUTATION,
                          variables: { postId: this.post.id, body: data.body },
                          update: (proxy, { data: { editPost } }) => {
                            // Read the data from our cache for this query.
                            const postsInCache = proxy.readQuery<
                              PostPageQueryQuery,
                              PostPageQueryQueryVariables
                            >({
                              query: PostPageQueryDocument,
                              variables: { id: this.post.id },
                            });
                            // Add our todo from the mutation to the start.
                            postsInCache.getPost.body = editPost.body;
                            // Write our data back to the cache.
                            proxy.writeQuery({
                              query: PostPageQueryDocument,
                              data: postsInCache,
                            });
                          },
                        })
                        .subscribe(
                          (res) => {
                            console.log(`Edited`, res);
                          },
                          (errorResp) => {
                            console.error(`Error`, errorResp);
                          }
                        );
                    }
                  });
                  modalEl.present();
                });
            },
          },
          {
            text: 'Cancel',
            icon: 'close',
            role: 'cancel',
            // cssClass: 'action-sheet-item',
            handler: () => {
              console.log('Cancel clicked');
            },
          },
        ],
      })
      .then((actionSheetEl) => {
        actionSheetEl.present();
      });
  }

  ngOnDestroy() {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
  }
}
