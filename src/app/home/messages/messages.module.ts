import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { MessageItemComponent } from './message-item/message-item.component';
import { MessagesPage } from './messages.page';

const routes: Routes = [
  {
    path: '',
    component: MessagesPage,
  },
];

@NgModule({
  imports: [CommonModule, IonicModule, RouterModule.forChild(routes)],
  declarations: [MessagesPage, MessageItemComponent],
})
export class MessagesPageModule {}
