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

  constructor(private orderSrv: OrderService,
    private nzMessageService: NzMessageService) { }

  async ngOnInit(): Promise<void> {
    this.orders = await this.orderSrv.GetAllOrder();

    this.orderSrv.orders.subscribe(orders => {
      this.orders = orders;
    })
  }

  onAction = async (status: string, order: Order) => {
    console.log(status)
    const isUpdated = await this.orderSrv.updateOrder(status, order);

    if (isUpdated) {
      this.nzMessageService.success('Hành động chạy thành công');
    } else {
      this.nzMessageService.error('Hành động chạy thất bại');
    }
  }
}
