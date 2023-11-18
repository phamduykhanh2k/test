import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, catchError, map, switchMap, tap, throwError } from 'rxjs';
import { ObservableService } from '../services/observable.service';
import { Router } from '@angular/router';
import { UserAuthService } from '../services/user-auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private observableSrv: ObservableService, private router: Router, private userSrv: UserAuthService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request)
      .pipe(
        catchError((error) => {
          if (error.status === 401) {
            return this.handle401Error(request, next, error)
          } else {
            return throwError(() => error);
          }
        })
      );
  }

  private handle401Error(request: HttpRequest<unknown>, next: HttpHandler, error: any) {
    return this.observableSrv.refreshToken()
      .pipe(
        switchMap(() => {
          return next.handle(request)
        }),
        catchError((e) => {
          localStorage.removeItem('user');
          this.userSrv.userEmit.emit(undefined);
          this.router.navigate(['authentication']);
          return throwError(() => error);
        })
      )
  }
}
