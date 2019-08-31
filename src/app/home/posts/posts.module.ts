import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { SharedModule } from '../../shared/shared.module';
import { AddPostComponent } from './add-post/add-post.component';
import { PostsPage } from './posts.page';

const routes: Routes = [
  {
    path: '',
    component: PostsPage,
  },
];

@NgModule({
  imports: [CommonModule, IonicModule, FormsModule, RouterModule.forChild(routes), SharedModule],
  declarations: [PostsPage, AddPostComponent],
  entryComponents: [AddPostComponent],
})
export class PostsPageModule {}
