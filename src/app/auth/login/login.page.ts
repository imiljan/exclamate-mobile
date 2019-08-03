import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  constructor(
    private authService: AuthService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private router: Router
  ) {}

  ngOnInit() {}

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const { username, password } = form.value;

    this.authenticate(username, password);
    form.reset();
  }

  private authenticate(username: string, password: string) {
    this.loadingCtrl.create({ keyboardClose: true, message: 'Logging in...' }).then((loadingEl) => {
      loadingEl.present();
      this.authService.login(username, password).subscribe(
        (res) => {
          if (!res.loading) {
            loadingEl.dismiss();
            this.router.navigateByUrl('/home');
          }
        },
        (errorResp) => {
          console.log('error resp', errorResp);
          // TODO change message
          loadingEl.dismiss();
          this.alertCtrl
            .create({
              header: 'Authentication failed',
              message: errorResp.message.split(':')[1],
              buttons: ['Okay'],
            })
            .then((alertEl) => alertEl.present());
        }
      );
    });
  }
}
