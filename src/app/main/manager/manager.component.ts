import { Component } from '@angular/core';
import { UserManagerComponent } from './user-manager/user-manager.component';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.css']
})
export class ManagerComponent {
  tabs = [
    {
      name: 'Tài khoản',
      icon: 'apple',
      renderTemplate: UserManagerComponent
    },
    {
      name: 'Sản phẩm',
      icon: 'android'
    },
    {
      name: 'Danh mục',
      icon: 'android'
    },
    {
      name: 'Đơn hàng',
      icon: 'android'
    },
    {
      name: 'Khuyến mãi',
      icon: 'android'
    }
  ];

}
