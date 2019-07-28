import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppState, Capacitor, Plugins } from '@capacitor/core';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { AuthService } from './auth/auth.service';

const { App, Storage } = Plugins;

// TODO Check AutoLogin flow on phone

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home',
    },
    {
      title: 'List',
      url: '/list',
      icon: 'list',
    },
  ];

  private authSub: Subscription;

  constructor(
    private platform: Platform,
    // private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      if (Capacitor.isPluginAvailable('SplashScreen')) {
        Plugins.SplashScreen.hide();
      }
    });
  }

  ngOnInit() {
    this.authSub = this.authService.userIsAuthenticated.subscribe((isAuth) => {
      if (!isAuth) {
        Storage.get({ key: 'authData' }).then((storedData) => {
          if (!storedData.value) {
            this.router.navigateByUrl('/auth');
          } else {
            this.authService
              .autoLogin()
              .toPromise()
              .then((res) => {
                console.log('Auto login in app.component.ts', res);
              });
          }
        });
      }
    });
    App.addListener('appStateChange', this.checkAuthOnResume.bind(this));
  }

  onLogout() {
    this.authService.logout();
  }

  private checkAuthOnResume(state: AppState) {
    if (state.isActive) {
      this.authService
        .autoLogin()
        .pipe(take(1))
        .subscribe((success) => {
          if (!success) {
            this.onLogout();
          }
        });
    }
  }

  ngOnDestroy() {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }
}
