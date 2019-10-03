import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Post } from '../../../../generated/graphql';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.scss'],
})
export class AddPostComponent implements OnInit {
  body = '';
  footerVisible = true;
  @ViewChild('fileInput', { static: false }) fileInput: any;
  @Input() post: Post;
  editMode = false;

  constructor(private modalCtrl: ModalController, private alertCtrl: AlertController) {
  }

  ngOnInit() {
    if (this.post) {
      this.body = this.post.body;
      this.editMode = true;
    }
  }

  onCancel() {
    this.modalCtrl.dismiss();
  }

  onCreatePost() {
    console.log(this.body);
    if (this.body.length > 180) {
      this.alertCtrl
        .create({
          message: 'Maximum length of post is 180. Create thread?',
          buttons: [
            {
              text: 'OK',
              handler: () => {
                this.modalCtrl.dismiss({ body: this.body }, 'add-thread');
              },
            },
            { text: 'Cancel', role: 'cancel' },
          ],
        })
        .then((alertEl) => {
          alertEl.present();
        });
    } else {
      if (this.editMode) {
        this.modalCtrl.dismiss({ body: this.body }, 'edit');
      } else {
        this.modalCtrl.dismiss({ body: this.body }, 'add');
      }
    }
  }

  onTakePicture() {
  }

  onSelectFromStorage(event) {
  }
}
