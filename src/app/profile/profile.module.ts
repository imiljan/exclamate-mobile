import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { SharedModule } from '../shared/shared.module';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ProfilePage } from './profile.page';

const routes: Routes = [
  {
    path: '',
    children: [{ path: '', component: ProfilePage }, { path: ':userId', component: ProfilePage }],
  },
];

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes), SharedModule],
  declarations: [ProfilePage, EditProfileComponent],
  entryComponents: [EditProfileComponent],
})
export class ProfilePageModule {}
