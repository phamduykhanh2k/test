import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-checkout-result',
  templateUrl: './checkout-result.component.html',
  styleUrls: ['./checkout-result.component.css']
})
export class CheckoutResultComponent implements OnInit {
  orderId = '';

  constructor(private route: ActivatedRoute, private orderSrv: OrderService, private router: Router) { }

  async ngOnInit(): Promise<void> {
    this.route.queryParams.subscribe(async params => {
      let orderIdParam: string = params['orderId'];
      let resultCode = params['resultCode'];

      if (orderIdParam && resultCode === 0) {
        this.orderId = orderIdParam.split('-')[0];
        await this.orderSrv.updateOrder('Hoàn thành', { _id: this.orderId });
      } else {
        this.router.navigate(['/']);
      }
    })
  }

}
