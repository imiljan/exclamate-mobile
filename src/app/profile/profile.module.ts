import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { SharedModule } from '../shared/shared.module';
import { ProfilePage } from './profile.page';

const routes: Routes = [
  {
    path: '',
    children: [{ path: '', component: ProfilePage }, { path: ':userId', component: ProfilePage }],
  },
];

@NgModule({
  imports: [CommonModule, IonicModule, RouterModule.forChild(routes), SharedModule],
  declarations: [ProfilePage],
})
export class ProfilePageModule {}
