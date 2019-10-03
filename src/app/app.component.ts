import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppState, Capacitor, Plugins } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { filter, switchMap, take, tap } from 'rxjs/operators';
import { MeCacheGQL } from '../generated/graphql';

import { AuthService } from './auth/auth.service';

const { App, SplashScreen } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private authSub: Subscription;
  private previousAuthState = false;

  constructor(
    private platform: Platform,
    private authService: AuthService,
    private router: Router,
    private apollo: Apollo,
    private meCache: MeCacheGQL,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (Capacitor.isPluginAvailable('SplashScreen')) {
        SplashScreen.hide();
      }
    });
  }

  ngOnInit() {
    App.addListener('appStateChange', this.checkAuthOnResume.bind(this));

    this.authSub = this.authService.userIsAuthenticated
      .pipe(
        tap((isAuth) => {
          if (!isAuth && this.previousAuthState !== isAuth) {
            this.router.navigate(['auth']);
          }
          this.previousAuthState = isAuth;
        }),
        filter((isAuth) => isAuth === true),
        take(1),
        switchMap((isAuth) => {
          console.log(isAuth);
          return this.meCache.fetch();
        }),
      )
      .subscribe((data) => {
        console.log('APP ON INIT', data.data);
      });
  }

  onLogout() {
    this.authService.logout();
    this.apollo
      .getClient()
      .clearStore()
      .then(() => {
        console.log('Cache cleared', this.apollo.getClient().cache);
        this.router.navigate(['auth', 'login']).then(() => console.log('NAVIGATED to login'));
      });
  }

  ngOnDestroy() {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
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
}
