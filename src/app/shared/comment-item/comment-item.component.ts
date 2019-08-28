import { Component, Input, OnInit } from '@angular/core';

import { Comment } from '../../../generated/graphql';

@Component({
  selector: 'app-comment-item',
  templateUrl: './comment-item.component.html',
  styleUrls: ['./comment-item.component.scss'],
})
export class CommentItemComponent implements OnInit {
  @Input() comment: Comment;

  constructor() {}

  ngOnInit() {}
}
