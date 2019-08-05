import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddPostComponent } from './add-post/add-post.component';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.page.html',
  styleUrls: ['./posts.page.scss'],
})
export class PostsPage implements OnInit {
  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  onAddPost() {
    this.modalCtrl.create({ component: AddPostComponent }).then((modalEl) => {
      modalEl.onDidDismiss().then((modalData) => {
        if (!modalData.data) {
          return;
        }
        console.log(modalData.data);
      });
      modalEl.present();
    });
  }
}
