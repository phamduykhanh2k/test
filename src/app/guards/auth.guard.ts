import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserAuthService } from '../services/user-auth.service';
import { BehaviorSubject, flatMap } from 'rxjs';
import { Toast, ToastrService } from 'ngx-toastr';
import { User } from '../models/user';

export const authGuard: CanActivateFn = (route, state) => {
  return inject(AuthGuard).canActivate();
};

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private authSrv: UserAuthService, private router: Router) { }

  canActivate(): boolean {
    return true;
  };
}

@Injectable({
  providedIn: 'root',
})
export class IsAdmin {
  constructor(private userSrv: UserAuthService, private router: Router, private toastr: ToastrService) { }

  canActivate(): boolean {
    const user = this.userSrv.GetLocalUser();
    if (user && user.role === 'Quản trị viên') {
      return true;
    }

    this.toastr.warning('Bạn không có quyền truy cập');
    return false;
  };
}

@Injectable({
  providedIn: 'root',
})
export class IsLogin {

  constructor(private toastr: ToastrService, private userSrv: UserAuthService, private router: Router) { }

  canActivate(): boolean {
    const user = this.userSrv.GetLocalUser();
    if (user)
      return true;
    else {
      this.router.navigate(['authentication'])
      return false;
    }
  };
}
