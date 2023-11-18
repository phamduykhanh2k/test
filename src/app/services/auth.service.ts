import { Injectable } from '@angular/core';
import { ObservableService } from './observable.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CartService } from './cart.service';
import { UserAuthService } from './user-auth.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private schemaName = 'users';

  constructor(
    private observableSrv: ObservableService,
    private toastr: ToastrService,
    private cartSrv: CartService,
    private userSrv: UserAuthService,
    private cookieSrv: CookieService,
    private message: NzMessageService
  ) { }

  handleRegister = async (formSignUp: FormGroup) => {
    const data = formSignUp.value;
    const isCompare = this.comparePassword(data.password, data.rePassword);

    if (isCompare) {
      const user = await this.observableSrv.post(this.schemaName, data);

      if (user) {
        this.toastr.success('Tạo tài khoản thành công');
        return true;
      } else {
        this.toastr.error('Tài khoản đã tồn tại');
      }
    } else {
      this.toastr.warning('Mật khẩu không khớp');
    }
    return false;
  }

  handleLogin = async (formLogin: FormGroup) => {
    const data = formLogin.value;
    const result = await this.observableSrv.login(data);

    if (result && result.EC === 0) {
      localStorage.setItem('user', JSON.stringify(result.data.user));
      this.userSrv.userEmit.emit(result.data.user);
      this.toastr.success('Đăng nhập thành công');
      return true;
    }
    this.toastr.error('Tài khoản hoặc mật khẩu không chính xác', 'Đăng nhập thất bại');
    return false;
  }

  handleLogout = async () => {
    const isLogout = await this.observableSrv.logout();
    if (isLogout) {
      localStorage.clear();
      this.userSrv.userEmit.emit(undefined);
      this.cartSrv.cartEmit.emit([]);
      return true;
    }
    return false;
  }

  isAuthentication = () => {
    const cookie = this.cookieSrv.get('refresh_token');
    return cookie ? true : false;
  }

  private comparePassword = (password: string, rePassword: string) => {
    return password === rePassword;
  }
}
