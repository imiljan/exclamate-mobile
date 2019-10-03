import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs';
import {
  CommentGQL,
  DeletePostGQL,
  EditPostGQL,
  HomePagePostsDocument,
  HomePagePostsQuery,
  HomePagePostsQueryVariables,
  MeCacheDocument,
  MeCacheQuery,
  Post,
  PostPageQueryDocument,
  PostPageQueryGQL,
  PostPageQueryQuery,
  PostPageQueryQueryVariables,
} from '../../../../generated/graphql';

import { AddPostComponent } from '../add-post/add-post.component';

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})
export class PostPage implements OnInit, OnDestroy {
  post: Post;
  isLoading = true;
  comment = '';
  isMyPost = false;

  private querySubscription: Subscription;

  constructor(
    private apollo: Apollo,
    private getPosts: PostPageQueryGQL,
    private createComment: CommentGQL,
    private editPost: EditPostGQL,
    private deletePost: DeletePostGQL,
    private route: ActivatedRoute,
    private actionSheetController: ActionSheetController,
    private modalCtrl: ModalController,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('postId')) {
        this.router.navigate(['home', 'tabs', 'posts']);
      }

      const { me } = this.apollo.getClient().readQuery<MeCacheQuery>({
        query: MeCacheDocument,
      });

      console.log('paramMap', paramMap.get('postId'));
      this.querySubscription = this.getPosts
        .watch({ id: paramMap.get('postId') })
        .valueChanges.subscribe(({ data, loading }) => {
          this.post = data.getPost;
          this.isLoading = loading;
          this.isMyPost = me.id === data.getPost.user.id;
        });
    });
  }

  onComment() {
    console.log(this.comment);
    this.createComment
      .mutate(
        { postId: +this.post.id, body: this.comment },
        {
          update: (proxy, { data: { createComment } }) => {
            // Read the data from our cache for this query.
            const postInCache = proxy.readQuery<PostPageQueryQuery, PostPageQueryQueryVariables>({
              query: PostPageQueryDocument,
              variables: { id: this.post.id },
            });

            // Add our todo from the mutation to the start.
            postInCache.getPost.comments.push(createComment);

            // Write our data back to the cache.
            proxy.writeQuery({
              query: PostPageQueryDocument,
              data: postInCache,
            });
          },
        },
      )
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
              this.deletePost
                .mutate(
                  { postId: this.post.id },
                  {
                    update: (proxy, { data: { deletePost } }) => {
                      // Read the data from our cache for this query.
                      const postsInCache = proxy.readQuery<HomePagePostsQuery,
                        HomePagePostsQueryVariables>({
                        query: HomePagePostsDocument,
                        variables: { limit: 10, offset: 0 },
                      });

                      // Add our todo from the mutation to the start.
                      postsInCache.getPosts = postsInCache.getPosts.filter(
                        (el) => el.id !== this.post.id,
                      );

                      // Write our data back to the cache.
                      proxy.writeQuery({
                        query: HomePagePostsDocument,
                        data: postsInCache,
                      });
                    },
                  },
                )
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
                      this.editPost
                        .mutate(
                          { postId: this.post.id, body: data.body },
                          {
                            update: (proxy, { data: { editPost } }) => {
                              // Read the data from our cache for this query.
                              const postsInCache = proxy.readQuery<PostPageQueryQuery,
                                PostPageQueryQueryVariables>({
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
                          },
                        )
                        .subscribe(
                          (res) => {
                            console.log(`Edited`, res);
                          },
                          (errorResp) => {
                            console.error(`Error`, errorResp);
                          },
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
