import { Component } from '@angular/core';
import { User } from 'src/app/models/user';
import { OrderService } from 'src/app/services/order.service';
import { UserAuthComponent } from '../../user-auth/user-auth.component';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { query } from '@angular/animations';
import { ActivatedRoute, Router, UrlSerializer } from '@angular/router';
import { Order } from 'src/app/models/data-types';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent {
  orders: Order[] = [];
  currentPage = 1;
  itemsPerPage = 3;

  ngOnInit(): void {
    const user = this.userSrv.GetLocalUser();

    if (user && user._id) {
      this.orderSrv.GetOrderByUserId(user._id);
      this.orderSrv.orders.subscribe(result => {
        this.orders = result;
      })
    }
  }

  constructor(private orderSrv: OrderService, private userSrv: UserAuthService) { }
}
