import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Order, ToTalSumary } from 'src/app/models/data-types';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  order: Order | undefined;
  totalSumary: ToTalSumary;


  constructor(
    private orderSrv: OrderService,
    private activeRoute: ActivatedRoute,
    private cartSrv: CartService,
    private router: Router) { }

  async ngOnInit(): Promise<void> {
    this.activeRoute.params.subscribe(async (params: Params) => {
      const id: string = params['id'];
      const order = await this.orderSrv.getOrder(id);
      if (order) {
        this.order = order;
        this.totalSumary = this.cartSrv.processTotalSumary(order.cart, order.voucher?.discount);
      } else {
        this.router.navigate(['**']);
      }
    })
  }
}
