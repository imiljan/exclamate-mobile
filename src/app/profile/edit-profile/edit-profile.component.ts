import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
  @Input() firstName: string;
  @Input() lastName: string;
  @Input() email: string;
  password: string;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const { firstName, lastName, email, password } = form.value;

    this.modalCtrl.dismiss('edit-successful');
  }

  onCancel() {
    this.modalCtrl.dismiss();
  }
}
