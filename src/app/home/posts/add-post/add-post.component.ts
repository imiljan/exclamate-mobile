import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.scss'],
})
export class AddPostComponent implements OnInit {
  body = '';
  image = '';
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
                this.modalCtrl.dismiss({ body: this.body, image: this.image }, 'add-thread');
              },
            },
            { text: 'Cancel', role: 'cancel' },
          ],
        })
        .then((alertEl) => {
          alertEl.present();
        });
    } else {
      this.modalCtrl.dismiss({ body: this.body, image: this.image }, 'add');
    }
  }

  onImagePicked(imageData: string | File) {
    let imageFile;
    if (typeof imageData === 'string') {
      try {
        imageFile = base64toBlob(imageData.replace('data:image/jpeg;base64,', ''), 'image/jpeg');
      } catch (error) {
        console.log(error);
        return;
      }
    } else {
      imageFile = imageData;
    }
    this.image = imageFile;
  }
}

function base64toBlob(base64Data, contentType) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = window.atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}
