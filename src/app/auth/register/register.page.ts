import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  constructor(
    private alertCtrl: AlertController,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private router: Router
  ) {}
  ngOnInit() {}

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    console.log(form.value);
    const { username, password, email, firstName, lastName } = form.value;

    this.register(username, password, email, firstName, lastName);
    form.reset();
  }

  private register(
    username: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string
  ) {
    this.loadingCtrl.create({ keyboardClose: true, message: 'Logging in...' }).then((loadingEl) => {
      loadingEl.present();
      this.authService
        .register(username, password, email, firstName, lastName)
        .then((res) => {
          console.log('auth resp', res);

          if (res) {
            console.log('Register ok');
            loadingEl.dismiss();
            this.router.navigateByUrl('/home');
          }
        })
        .catch((errorResp) => {
          console.log('registration error resp', errorResp);
          // TODO change message
          loadingEl.dismiss();
          this.alertCtrl
            .create({
              header: 'Registration failed',
              message: errorResp.message.split(':')[1],
              buttons: ['Okay'],
            })
            .then((alertEl) => alertEl.present());
        });
    });
  }
}
