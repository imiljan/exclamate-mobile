import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.storedToken.pipe(
      take(1),
      switchMap((token) => {
        if (token) {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          });
        }
        return next.handle(request).pipe(
          tap(
            (event: HttpEvent<any>) => {
              if (event instanceof HttpResponse) {
                if (event.body.errors) {
                  event.body.errors.forEach((el) => {
                    if (el.extensions.code === 'TOKEN_EXPIRED') {
                      this.authService.logout();
                      this.router.navigate(['auth']);
                    }
                  });
                } else {
                  return event.body;
                }
              }
            },
            (err: any) => {
              if (err instanceof HttpErrorResponse) {
                console.log(err);
                this.authService.logout();
                this.router.navigate(['auth']);
              }
            }
          )
        );
      })
    );
  }
}
