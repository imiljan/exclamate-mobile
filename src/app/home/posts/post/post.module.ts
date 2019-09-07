import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { SharedModule } from '../../../shared/shared.module';
import { PostPage } from './post.page';

const routes: Routes = [
  {
    path: '',
    component: PostPage,
  },
];

@NgModule({
  imports: [CommonModule, IonicModule, RouterModule.forChild(routes), SharedModule],
  declarations: [PostPage],
})
export class PostPageModule {}
