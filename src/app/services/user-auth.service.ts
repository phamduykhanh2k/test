import { EventEmitter, Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject, Observable, Observer, Subject, switchMap } from 'rxjs';
import { User } from '../models/user';
import { ServerData } from '../models/serverData';
import { CartService } from './cart.service';
import { ObservableService } from './observable.service';
import { FormGroup } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  usersEmit = new EventEmitter<User[]>();
  userEmit = new EventEmitter<User>()
  private schemaName = 'users';
  private users: User[] = [];
  private user: User;

  constructor(private http: HttpClient,
    private toastr: ToastrService,
    private observableSrv: ObservableService,
    private message: NzMessageService) { }

  GetAll = async () => {
    const result = await this.observableSrv.getAll(this.schemaName);
    this.users = result;
    this.usersEmit.emit(this.users);
  }

  updateUser = async (data: any) => {
    const result = await this.observableSrv.update(this.schemaName, data);

    if (result.modifiedCount > 0) {
      this.message.success('Cập nhật thành công');
      return true;
    } else {
      this.message.error('Cập nhật thất bại');
      return false;
    }
  }

  deleteUser = async (user: User) => {
    const _id = user._id;
    const result = await this.observableSrv.delete(this.schemaName, _id!);

    if (result.modifiedCount > 0) {
      const findIndex = this.users.findIndex(item => item._id === user._id);

      if (findIndex !== -1) {
        this.users.splice(findIndex, 1);
        this.message.success('Xóa thành công');
      }
    } else {
      this.message.error('Xóa thất bại');
    }

  }

  GetLocalUser() {
    let localUser = localStorage.getItem('user') != null ? localStorage.getItem('user') : undefined;

    if (localUser) {
      this.user = JSON.parse(localUser);
      this.userEmit.emit(this.user);
      return this.user;
    }
    return null;
  }
}