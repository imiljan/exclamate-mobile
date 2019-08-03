import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { PostItemComponent } from './post-item/post-item.component';
import { PostsPage } from './posts.page';

const routes: Routes = [
  {
    path: '',
    component: PostsPage,
  },
];

@NgModule({
  imports: [CommonModule, IonicModule, RouterModule.forChild(routes)],
  declarations: [PostsPage, PostItemComponent],
})
export class PostsPageModule {}
