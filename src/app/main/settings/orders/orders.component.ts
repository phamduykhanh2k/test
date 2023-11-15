import { Component } from '@angular/core';
import { User } from 'src/app/models/user';
import { OrderService } from 'src/app/services/order.service';
import { UserAuthComponent } from '../../user-auth/user-auth.component';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { query } from '@angular/animations';
import { ActivatedRoute, Router, UrlSerializer } from '@angular/router';
import { Order } from 'src/app/models/data-types';
import { FeedbackService } from 'src/app/services/feedback.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent {
  orders: Order[] = [];
  user: User
  currentPage = 1;
  itemsPerPage = 3;

  ngOnInit(): void {
    this.user = this.userSrv.GetLocalUser()!;

    if (this.user && this.user._id) {
      this.orderSrv.GetOrderByUserId(this.user._id);
      this.orderSrv.orders.subscribe(result => {
        this.orders = result;
        console.log(this.orders)
      })
    }
  }

  constructor(private orderSrv: OrderService, private userSrv: UserAuthService, private feedbackSrv: FeedbackService) { }
  isVisible = false;
  tooltips = ['terrible', 'bad', 'normal', 'good', 'wonderful'];
  score = 3;
  comment = '';

  showModal(): void {
    this.isVisible = true;
  }

  onCreateFeedback = async (orderId: string, productId: string) => {
    const data = {
      order: orderId,
      user: this.user._id,
      product: productId,
      score: this.score,
      note: this.comment
    }
    const result = await this.feedbackSrv.createFeedback(data);

    if (result) {
      this.handleCancel();
    }
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}
