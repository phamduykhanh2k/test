import { Component } from '@angular/core';
import { User } from 'src/app/models/user';
import { OrderService } from 'src/app/services/order.service';
import { UserAuthComponent } from '../../user-auth/user-auth.component';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { query } from '@angular/animations';
import { ActivatedRoute, Router, UrlSerializer } from '@angular/router';
import { Order } from 'src/app/models/data-types';
import { FeedbackService } from 'src/app/services/feedback.service';
import { PaymentService } from 'src/app/services/payment.service';

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

  constructor(private orderSrv: OrderService,
    private userSrv: UserAuthService,
    private feedbackSrv: FeedbackService,
    private paymentSrv: PaymentService) { }

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

  isVisible = false;
  tooltips = ['Quá tệ', 'Dở', 'Bình thường', 'Tốt', 'Tuyệt vời'];
  score = 3;
  comment = '';
  productId = '';
  orderId = '';

  showModal(orderId: string, productId: string): void {
    this.orderId = orderId;
    this.productId = productId;
    this.isVisible = true;
  }

  onCreateFeedback = async () => {
    const data = {
      order: this.orderId,
      user: this.user._id,
      product: this.productId,
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

  onPayment = async (order: Order) => {
    let data = {
      _id: order._id,
      totalPrice: order.totalPrice
    }

    let payUrl = await this.paymentSrv.createPayment(data);

    if (payUrl) {
      window.location.href = payUrl;
    }
  }
}
