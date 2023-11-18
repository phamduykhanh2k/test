import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CartItem, Order, ToTalSumary, Voucher } from 'src/app/models/data-types';
import { User } from 'src/app/models/user';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import { PaymentService } from 'src/app/services/payment.service';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { VoucherService } from 'src/app/services/voucher.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cart: CartItem[] = [];
  totalSumary!: ToTalSumary;
  isCheckError = false;
  user: User;

  constructor(
    private cartSrv: CartService,
    private builder: FormBuilder,
    private orderSrv: OrderService,
    private userSrv: UserAuthService,
    private paymentSrv: PaymentService,
    private router: Router,
    private toastr: ToastrService,
    private voucherSrv: VoucherService
  ) { }

  checkoutForm = this.builder.group({
    name: this.builder.control('', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(250)])),
    address: this.builder.control('', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(250)])),
    phone: this.builder.control('', Validators.compose([Validators.required, Validators.pattern("(84|0[3|5|7|8|9])+([0-9]{8})")])),
    note: this.builder.control(''),
    paymentMethod: this.builder.control('', Validators.required)
  })

  ngOnInit(): void {
    this.user = this.userSrv.GetLocalUser()!;
    const localCart = this.cartSrv.getLocalCart();
    const localVoucher = this.voucherSrv.getLocalVoucher();

    if (localCart.length > 0) {
      this.cart = localCart;
      this.totalSumary = this.cartSrv.processTotalSumary(localCart, localVoucher?.discount);
    } else {
      this.router.navigate(['/cart']);
    }
  }

  handleCheckOut = async () => {
    if (this.checkoutForm.valid) {
      const formValue = this.checkoutForm.value;
      const localVoucher = this.voucherSrv.getLocalVoucher();

      let data = {
        userId: this.user._id,
        name: formValue.name,
        address: formValue.address,
        note: formValue.note,
        phone: formValue.phone,
        paymentMethod: formValue.paymentMethod,
        shippingCost: this.totalSumary.shippingCost,
        totalPrice: this.totalSumary.total,
        voucher: localVoucher?._id,
        cart: this.cart,
        status: "Chờ xác nhận"
      }

      console.log(data);

      let order = await this.orderSrv.createOrder(data);

      if (order && order.paymentMethod === 'Thanh toán khi nhận hàng') {
        this.toastr.success('Đặt hàng thành công');
        this.router.navigate(['/shop']);
      }

      if (order && order.paymentMethod === 'Thanh toán bằng ví Momo') {
        let data = {
          _id: order._id,
          totalPrice: order.totalPrice
        }

        let payUrl = await this.paymentSrv.createPayment(data);

        if (payUrl) {
          window.location.href = payUrl;
        }
      }
    } else {
      this.isCheckError = true;
    }
  }


}
