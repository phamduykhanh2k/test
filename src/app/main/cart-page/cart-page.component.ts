import { Component, OnInit } from '@angular/core';
import { CartItem, ToTalSumary } from 'src/app/models/data-types';
import { Product } from 'src/app/models/product';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})
export class CartPageComponent implements OnInit {
  cart: CartItem[] = [];
  totalSumary!: ToTalSumary;
  quantity = 1;

  constructor(private cartSrv: CartService) { }

  ngOnInit(): void {
    const localCart = this.cartSrv.getLocalCart();
    if (localCart.length > 0) {
      this.cart = localCart;
      this.totalSumary = this.cartSrv.processTotalSumary(localCart);
    }

    this.cartSrv.cartEmit.subscribe(cart => {
      this.cart = cart;
      this.totalSumary = this.cartSrv.processTotalSumary(this.cart);
    })
  }

  onchangeQuantity = (event: Event, index: number) => {
    const newQuantity = (event.target as HTMLInputElement).value;
    this.cartSrv.changeQuantity(+index, +newQuantity);
  }

  onUpdateCart = () => {
    this.cartSrv.updateCart();
  }

  handleRemoveItemToCart = (index: number) => {
    this.cartSrv.removeItemtoCart(index);
  }
}
