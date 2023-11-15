import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserAuthService } from '../../services/user-auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { AuthGuard, IsLogin } from 'src/app/guards/auth.guard';

@Component({
  selector: 'app-user-auth',
  templateUrl: './user-auth.component.html',
  styleUrls: ['./user-auth.component.css']
})
export class UserAuthComponent implements OnInit {

  public saveUser: boolean = false;
  showLogin = true;
  isCheckError = false;

  signUpForm = this.builder.group({
    name: this.builder.control('', Validators.compose([Validators.required, Validators.minLength(5)])),
    username: this.builder.control('', Validators.compose([Validators.required, Validators.minLength(5)])),
    password: this.builder.control('', Validators.compose([Validators.required])),
    // , Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,15}')
    rePassword: this.builder.control('', Validators.compose([Validators.required])),
    role: 'Khách hàng'
  })

  loginForm = this.builder.group({
    username: this.builder.control('', Validators.compose([Validators.required, Validators.minLength(5)])),
    password: this.builder.control('', Validators.compose([Validators.required])),
    isSaveLogin: this.builder.control(false)
  })

  constructor(
    private builder: FormBuilder, private authSrv: AuthService, private router: Router) { }

  ngOnInit(): void {
    if (this.authSrv.isAuthentication())
      this.router.navigate(['']);
  }

  login = async () => {
    if (this.loginForm.valid) {
      const isLogin = await this.authSrv.handleLogin(this.loginForm);

      if (isLogin)
        this.router.navigate(['/'])
    } else {
      this.isCheckError = true;
    }
  }

  signUp = async () => {
    if (this.signUpForm.valid) {
      const result = await this.authSrv.handleRegister(this.signUpForm);

      if (result) {
        this.showLogin = true;
        this.signUpForm.reset();
      }
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
