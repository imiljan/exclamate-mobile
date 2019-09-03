import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { CommentItemComponent } from './comment-item/comment-item.component';
import { ImagePickerComponent } from './pickers/image-picker/image-picker.component';
import { PostItemComponent } from './post-item/post-item.component';

@NgModule({
  imports: [CommonModule, IonicModule],
  exports: [PostItemComponent, CommentItemComponent, ImagePickerComponent],
  declarations: [PostItemComponent, CommentItemComponent, ImagePickerComponent],
})
export class SharedModule {}
