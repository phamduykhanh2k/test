import { Component, OnInit } from '@angular/core';
import { CartItem, ToTalSumary } from 'src/app/models/data-types';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cart: CartItem[] = [];
  totalSumary!: ToTalSumary;

  constructor(private cartSrv: CartService) { }

  ngOnInit(): void {
    const localCart = this.cartSrv.getLocalCart();
    if (localCart.length > 0) {
      this.cart = localCart;
      this.totalSumary = this.cartSrv.processTotalSumary(localCart);
    }
  }
}
