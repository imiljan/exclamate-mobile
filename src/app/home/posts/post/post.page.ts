import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Subscription } from 'rxjs';
import { Post, PostPageQueryQuery } from 'src/generated/graphql';

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

  post: Post;
  isLoading = true;

  private querySubscription: Subscription;

  constructor(private apollo: Apollo, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('postId')) {
        this.router.navigate(['home', 'tabs', 'posts']);
      }
      console.log('paramMap', paramMap.get('postId'));
      this.querySubscription = this.apollo
        .query<PostPageQueryQuery>({
          query: this.POST_QUERY,
          variables: { id: paramMap.get('postId') },
        })
        .subscribe(({ data, loading }) => {
          this.post = data.getPost;
          this.isLoading = loading;
        });
    });
  }

  ngOnDestroy() {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
  }
}
