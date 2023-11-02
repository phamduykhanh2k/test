import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Order } from 'src/app/models/data-types';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  order: Order | undefined;


  constructor(private orderSrv: OrderService, private activeRoute: ActivatedRoute) { }

  async ngOnInit(): Promise<void> {
    this.activeRoute.params.subscribe(async (params: Params) => {
      const id: string = params['id'];
      const order = await this.orderSrv.getOrder(id);

      this.order = order;

    })


  }




}
