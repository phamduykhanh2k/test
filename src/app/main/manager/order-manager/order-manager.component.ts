import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/models/data-types';
import { OrderService } from 'src/app/services/order.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-order-manager',
  templateUrl: './order-manager.component.html',
  styleUrls: ['./order-manager.component.css']
})
export class OrderManagerComponent implements OnInit {
  orders: Order[] = [];
  currentPage = 1;
  itemsPerPage = 5;

  async ngOnInit(): Promise<void> {
    this.orders = await this.orderSrv.GetAllOrder();

    this.orderSrv.orders.subscribe(orders => {
      this.orders = orders;
    })
  }

  constructor(private orderSrv: OrderService) { }

  onAction = (type: string, order: Order) => {
    this.orderSrv.updateOrder(type, order);
  }
}
