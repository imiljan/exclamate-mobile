import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.scss'],
})
export class AddPostComponent implements OnInit {
  body = '';
  footerVisible = true;
  @ViewChild('fileInput', { static: false }) fileInput: any;

  constructor(private modalCtrl: ModalController, private alertCtrl: AlertController) {}

  ngOnInit() {}

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
      this.modalCtrl.dismiss({ body: this.body }, 'add');
    }
  }

  onTakePicture() {}

  onSelectFromStorage(event) {}
}
