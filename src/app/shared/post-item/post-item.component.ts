import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from '../../../generated/graphql';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.scss'],
})
export class PostItemComponent implements OnInit {
  @Input() post: Post;

  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  openPost() {
    this.router.navigate(['home', 'tabs', 'posts', this.post.id]);
  }

  openUserPage() {
    this.router.navigate(['profile', this.post.user.id]);
  }
}
