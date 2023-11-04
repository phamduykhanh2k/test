import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';
import { UserAuthService } from 'src/app/services/user-auth.service';

@Component({
  selector: 'app-user-manager',
  templateUrl: './user-manager.component.html',
  styleUrls: ['./user-manager.component.css']
})
export class UserManagerComponent implements OnInit {
  itemsPerPage = 5;
  currentPage = 1;
  visible = false;
  users: User[] = [];
  isCheckError = false;
  updateUserForm: FormGroup

  constructor(private userSrv: UserAuthService, private builder: FormBuilder) {
    this.updateUserForm = this.builder.group({
      _id: this.builder.control('', Validators.required),
      username: this.builder.control('', Validators.required),
      role: this.builder.control('', Validators.required),
      name: this.builder.control('', Validators.compose([Validators.required, Validators.minLength(5)])),
      email: this.builder.control('', Validators.email),
      phone: this.builder.control('', Validators.pattern("(84|0[3|5|7|8|9])+([0-9]{8})")),
      address: this.builder.control('', Validators.compose([Validators.minLength(10), Validators.maxLength(250)])),
      gender: this.builder.control('')
    })

    this.userSrv.GetAll();
  }

  ngOnInit(): void {
    this.userSrv.usersEmit.subscribe(users => {
      this.users = users;
    })
  }

  open(user: User): void {
    this.visible = true;
    console.warn(user);
    this.setValueForm(user);
  }

  close(): void {
    this.visible = false;
  }

  onUpdate = async () => {
    if (this.updateUserForm.valid) {
      const result = await this.userSrv.updateUser(this.updateUserForm.value);
      if (result)
        this.visible = false;
    } else {
      this.isCheckError = true;
    }
  }

  setValueForm = (user: User) => {
    this.updateUserForm.setValue({
      _id: user._id,
      username: user.username,
      role: user.role,
      name: user.name,
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      gender: user.gender || ''
    })
  }

  onLock = async (user: User) => {
    const status = 'Ngừng hoạt động';
    const data = { ...user, status };

    const result = await this.userSrv.updateUser(data);
    if (result)
      user.status = status;
  }

  onUnlock = async (user: User) => {
    const status = 'Hoạt động';
    const data = { ...user, status };

    const result = await this.userSrv.updateUser(data);
    if (result)
      user.status = status;
  }

  onDelete = async (user: User) => {
    const result = await this.userSrv.deleteUser(user);
  }
}
