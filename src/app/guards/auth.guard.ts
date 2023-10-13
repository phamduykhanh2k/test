import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserAuthService } from '../services/user-auth.service';
import { BehaviorSubject, flatMap } from 'rxjs';
import { Toast, ToastrService } from 'ngx-toastr';

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
export class AdminGuard {
  constructor(private userSrv: UserAuthService, private router: Router, private toastr: ToastrService) { }

  canActivate(): boolean {
    const user = this.userSrv.GetLocalUser();
    if (user && user.role === 'Quản trị viên') {
      this.toastr.success('Bạn đang truy cập bằng quyền quản trị viên')
      return true;
    }
    this.toastr.warning('Bạn không có quyền truy cập')
    this.router.navigate(['authentication']);
    return false;

  };
}

@Injectable({
  providedIn: 'root',
})
export class CartGuard {
  constructor(private toastr: ToastrService) { }

  canActivate(): boolean {
    const cartLength = localStorage.getItem('localCart')?.length;
    if (cartLength && cartLength > 2)
      return true;
    else {
      this.toastr.warning('Giỏ hàng bị trống');
      return false;
    }
  };
}

@Injectable({
  providedIn: 'root',
})
export class LoginGuard {
  constructor(private toastr: ToastrService, private userSrv: UserAuthService, private router: Router) { }

  canActivate(): boolean {
    const user = this.userSrv.GetLocalUser();
    if (user)
      return true;
    else {
      this.toastr.warning('Vui lòng đăng nhập');
      this.router.navigate(['authentication'])
      return false;
    }
  };
}
