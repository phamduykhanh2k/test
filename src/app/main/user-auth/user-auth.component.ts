import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserAuthService } from '../../services/user-auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-user-auth',
  templateUrl: './user-auth.component.html',
  styleUrls: ['./user-auth.component.css']
})
export class UserAuthComponent implements OnInit {

  public saveUser: boolean = false;
  showLogin = true;
  isCheckError = false;

  ngOnInit(): void {

  }

  constructor(private userService: UserAuthService, private builder: FormBuilder, private toastr: ToastrService, private router: Router) { }

  signUpForm = this.builder.group({
    type: 'CREATE-USER',
    role: 'Khách hàng',
    fullname: this.builder.control('', Validators.compose([Validators.required, Validators.minLength(5)])),
    username: this.builder.control('', Validators.compose([Validators.required, Validators.minLength(5)])),
    password: this.builder.control('', Validators.compose([Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,15}')])),
    rePassword: this.builder.control('', Validators.compose([Validators.required]))
  })

  loginForm = this.builder.group({
    type: 'LOGGIN',
    username: this.builder.control('', Validators.compose([Validators.required, Validators.minLength(5)])),
    password: this.builder.control('', Validators.compose([Validators.required])),
    isSaveLogin: this.builder.control(false)
  })

  login(): void {
    if (this.loginForm.valid) {
      this.userService.LoggedIn(this.loginForm.value).subscribe(result => {
        if (result) {
          this.toastr.success('Đăng nhập thành công');
          this.router.navigate(['']);
        } else {
          this.toastr.warning('Tài khoản hoặc mật khẩu không chính xác', 'Đăng nhập thất bại')
        }
      })
    } else {
      this.isCheckError = true;
    }
  }

  signUp() {
    if (this.signUpForm.valid) {
      this.userService.SignUp(this.signUpForm.value).subscribe(result => {
        if (result) {
          this.showLogin = true;
          this.signUpForm.reset();
          this.toastr.success('Đăng ký thành công');
        } else {
          this.toastr.warning('Tài khoản đã tồn tại');
        }
      })
    } else {
      this.isCheckError = true;
    }
  }

  openLogin() {
    this.showLogin = true;
  }

  openSignUp() {
    this.showLogin = false;
  }
}
