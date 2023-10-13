import { Component } from '@angular/core';
import { Order } from 'src/app/models/order';
import { User } from 'src/app/models/user';
import { OrderService } from 'src/app/services/order.service';
import { UserAuthComponent } from '../../user-auth/user-auth.component';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { query } from '@angular/animations';
import { ActivatedRoute, Router, UrlSerializer } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent {
  orders: Order[] = []

  ngOnInit(): void {
    const user = this.userSrv.GetLocalUser();

    if (user && user._id) {
      this.orderSrv.GetOrderByUserId(user._id);
      this.orderSrv.orderDataEmit.subscribe(result => {
        this.orders = result;
      })
    }
  }

  constructor(private orderSrv: OrderService, private userSrv: UserAuthService) { }
}
