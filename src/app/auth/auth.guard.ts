import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad {
  constructor(private authService: AuthService, private router: Router) {}

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    console.log('GUARD');
    return this.authService.userIsAuthenticated.pipe(
      take(1),
      map((isAuth) => {
        console.log('isAuth', isAuth);
        if (!isAuth) {
          this.router.navigateByUrl('/auth');
        }
        return isAuth;
      })
    );
  }
}
