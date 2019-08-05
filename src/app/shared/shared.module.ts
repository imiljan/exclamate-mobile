import { NgModule } from '@angular/core';
import { PostItemComponent } from './post-item/post-item.component';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [CommonModule, IonicModule],
  exports: [PostItemComponent],
  declarations: [PostItemComponent],
})
export class SharedModule {}
