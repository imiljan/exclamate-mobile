import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  isLoading = false;

  constructor(
    private authService: AuthService,
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

  authenticate(username: string, password: string) {
    this.isLoading = true;
    this.loadingCtrl.create({ keyboardClose: true, message: 'Logging in...' }).then((loadingEl) => {
      loadingEl.present();

      const authResp = this.authService.login(username, password);
      // TODO Save user in storage

      if (authResp) {
        console.log('Login ok');
        this.isLoading = false;
        loadingEl.dismiss();
      }
    });
  }
}
