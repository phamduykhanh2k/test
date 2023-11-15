import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartItem, Order, ToTalSumary } from 'src/app/models/data-types';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import { UserAuthService } from 'src/app/services/user-auth.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cart: CartItem[] = [];
  totalSumary!: ToTalSumary;
  isCheckError = false;

  constructor(
    private cartSrv: CartService,
    private builder: FormBuilder,
    private orderSrv: OrderService,
    private userSrv: UserAuthService,
    private router: Router
  ) { }

  checkoutForm = this.builder.group({
    name: this.builder.control('', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(250)])),
    address: this.builder.control('', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(250)])),
    phone: this.builder.control('', Validators.compose([Validators.required, Validators.pattern("(84|0[3|5|7|8|9])+([0-9]{8})")])),
    note: this.builder.control(''),
    paymentMethod: this.builder.control('', Validators.required)
  })

  ngOnInit(): void {
    const localCart = this.cartSrv.getLocalCart();
    if (localCart.length > 0) {
      this.cart = localCart;
      this.totalSumary = this.cartSrv.processTotalSumary(localCart);
    } else {
      this.router.navigate(['/cart']);
    }
  }

  handleCheckOut = async () => {
    if (this.checkoutForm.valid) {
      const user = this.userSrv.GetLocalUser();
      const result = await this.orderSrv.createOrder(user!, this.checkoutForm, this.totalSumary, this.cart);

      if (result)
        this.router.navigate(['/shop']);

    } else {
      this.isCheckError = true;
    }
  }


}
