import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/models/order';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order-manager',
  templateUrl: './order-manager.component.html',
  styleUrls: ['./order-manager.component.css']
})
export class OrderManagerComponent implements OnInit {
  orders: Order[] = [];
  p = 1;

  ngOnInit(): void {
    this.orderSrv.GetAll().subscribe(result => {
      const storeOrder = result.data;
      this.orders = storeOrder;
    })
  }

  constructor(private orderSrv: OrderService) { }

}
