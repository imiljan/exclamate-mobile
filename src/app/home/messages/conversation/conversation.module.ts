import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { ConversationPage } from './conversation.page';

const routes: Routes = [
  {
    path: '',
    component: ConversationPage,
  },
];

@NgModule({
  imports: [CommonModule, IonicModule, RouterModule.forChild(routes)],
  declarations: [ConversationPage],
})
export class ConversationPageModule {}
