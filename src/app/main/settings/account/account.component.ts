import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user';
import { UserAuthService } from 'src/app/services/user-auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {
  isCheckError = false;

  userForm = this.builder.group({
    _id: '',
    username: '',
    password: '',
    role: '',
    fullname: this.builder.control('', Validators.compose([Validators.required, Validators.minLength(5)])),
    email: this.builder.control('', Validators.compose([Validators.required, Validators.pattern("^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$")])),
    phone: this.builder.control('', Validators.compose([Validators.required, Validators.pattern("(84|0[3|5|7|8|9])+([0-9]{8})")])),
    address: this.builder.control('', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(250)])),
    gender: this.builder.control(-1, Validators.required)
  })

  ngOnInit(): void {
    const user = this.userSrv.GetLocalUser();
    if (user) {
      this.setValueUserForm(user);
    }
  }

  setValueUserForm(user: User) {
    this.userForm.setValue({
      _id: user._id!,
      username: user.username,
      password: user.password,
      role: user.role,
      fullname: user.fullname,
      email: user.email || null,
      phone: user.phone || null,
      address: user.address || null,
      gender: user.gender || null
    })
  }

  updateUser() {
    if (this.userForm.valid) {
      this.userSrv.UpdateUser(this.userForm.value).subscribe(result => {
        if (result) {
          this.toastr.success('Cập nhật thành công');
        } else {
          this.toastr.warning('Cập nhật thất bại')
        }
      })
    } else {
      this.isCheckError = true;
    }
  }

  constructor(private userSrv: UserAuthService, private builder: FormBuilder, private toastr: ToastrService) { }
}
