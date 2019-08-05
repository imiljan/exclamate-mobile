import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PostsPage } from './posts.page';
import { SharedModule } from '../../shared/shared.module';
import { AddPostComponent } from './add-post/add-post.component';

const routes: Routes = [
  {
    path: '',
    component: PostsPage,
  },
];

@NgModule({
  imports: [CommonModule, IonicModule, RouterModule.forChild(routes), SharedModule],
  declarations: [PostsPage, AddPostComponent],
  entryComponents: [AddPostComponent],
})
export class PostsPageModule {}
