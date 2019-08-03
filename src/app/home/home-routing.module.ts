import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home/tabs/posts',
    pathMatch: 'full',
  },
  {
    path: 'tabs',
    component: HomePage,
    children: [
      {
        path: '',
        redirectTo: '/home/tabs/posts',
        pathMatch: 'full',
      },
      {
        path: 'posts',
        children: [
          {
            path: '',
            loadChildren: './posts/posts.module#PostsPageModule',
          },
          {
            path: ':postId',
            loadChildren: './posts/post/post.module#PostPageModule',
          },
        ],
      },
      {
        path: 'search',
        loadChildren: './search/search.module#SearchPageModule',
      },
      {
        path: 'notifications',
        loadChildren: './notifications/notifications.module#NotificationsPageModule',
      },
      {
        path: 'messages',
        loadChildren: './messages/messages.module#MessagesPageModule',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
