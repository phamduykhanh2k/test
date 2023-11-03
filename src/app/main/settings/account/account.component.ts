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
  user: User;
  isCheckError = false;
  notEditMode = false;

  constructor(private userSrv: UserAuthService, private builder: FormBuilder) {

  }

  userForm = this.builder.group({
    name: this.builder.control('', Validators.compose([Validators.required, Validators.minLength(5)])),
    email: this.builder.control('', Validators.compose([Validators.required, Validators.pattern("^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$")])),
    phone: this.builder.control('', Validators.compose([Validators.required, Validators.pattern("(84|0[3|5|7|8|9])+([0-9]{8})")])),
    address: this.builder.control('', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(250)])),
    gender: this.builder.control('', Validators.required)
  })

  ngOnInit(): void {
    this.user = this.userSrv.GetLocalUser()!;
    this.userSrv.userEmit.subscribe(user => {
      this.user = user;
    });
    this.setValueForm(this.user);
    this.userForm.disable();
  }

  setValueForm = (user: User) => {
    this.userForm.setValue({
      name: user.name,
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      gender: user.gender || ''
    })
  }

  onEditForm = () => {
    if (this.notEditMode === false) {
      this.notEditMode = true;
      this.userForm.enable();
    } else {
      this.notEditMode = false;
      this.userForm.disable();
    }
  }

  onUpdate = async () => {
    if (this.userForm.valid) {
      const data = {
        ...this.user,
        ...this.userForm.value
      }

      const isUpdate = await this.userSrv.updateUser(data);

      if (isUpdate) {
        const user = data as User;
        localStorage.setItem('user', JSON.stringify(user));
        this.onEditForm();
      }
    } else {
      this.isCheckError = true;
    }
  }


}
