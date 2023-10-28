import { EventEmitter, Injectable } from '@angular/core';
import { Product } from '../models/product';
import { ToastrService } from 'ngx-toastr';
import { Route, Router } from '@angular/router';
import { Order } from '../models/order';
import { CartItem, ToTalSumary } from '../models/data-types';
import { UserAuthService } from './user-auth.service';
import { find } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  public cartEmit = new EventEmitter<CartItem[]>();
  private cart: CartItem[] | undefined;

  constructor(private toastr: ToastrService, private userSrv: UserAuthService) {
  }

  addItemToCart = (item: Product, quantity: number): boolean => {
    const user = this.userSrv.GetLocalUser();

    if (user) {
      const isValid = this.isValidQuantity(quantity, item);
      if (isValid) {
        const cartStore: CartItem[] = this.getLocalCart();
        const index = cartStore.findIndex(cartItem => cartItem.product._id === item._id);

        if (index !== -1) {
          cartStore.at(index)!.quantity += quantity;
        } else {
          let cartItem: CartItem = {
            product: item,
            quantity: quantity
          }
          cartStore.push(cartItem);
        }
        localStorage.setItem("cart", JSON.stringify(cartStore));
        this.cartEmit.emit(cartStore);
        this.toastr.success("Bạn đã thêm một sản phẩm vào giỏ hàng");
      }
      return true;
    }
    this.toastr.warning("Vui lòng đăng nhập để mua hàng");
    return false;
  }

  getLocalCart = () => {
    const localCart = localStorage.getItem("cart");

    return localCart ? JSON.parse(localCart) : [];
  }

  changeQuantity = (index: number, newQuantity: number) => {
    this.cart = this.getLocalCart();
    this.cart![index].quantity = newQuantity;
  }

  updateCart = () => {
    if (this.cart) {
      const findError = this.cart.filter(cartItem => !this.isValidQuantity(cartItem.quantity, cartItem.product));

      if (findError.length === 0) {
        this.cartEmit.emit(this.cart);
        localStorage.setItem("cart", JSON.stringify(this.cart));
        this.toastr.success("Cập nhật giỏ hàng thành công");
      }
    }
  }

  removeItemtoCart = (index: number) => {
    const cart: CartItem[] = this.getLocalCart();
    const isDelete = confirm(`Bạn chắn chắn muốn bỏ ${cart.at(index)?.product.name} này chứ?`);

    if (isDelete) {
      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      this.cartEmit.emit(cart);
      this.toastr.success("Xóa sản phẩm thành công");
    }
  }

  isValidQuantity = (quantity: number, product: Product): boolean => {
    if (quantity <= 0) {
      this.toastr.warning("Số lượng sản phẩm tối thiểu là 1", "Số lượng không hợp lệ");
      return false;
    }

    if (quantity > product.quantity) {
      this.toastr.warning(`Số lượng ${product.name} không còn đủ`, "Hết hàng");
      return false;
    }

    return true;
  }

  processTotalSumary = (cart: CartItem[]) => {
    const subTotal = cart.reduce((previousValue, currentValue) => {
      return previousValue + (currentValue.product.price * currentValue.quantity);
    }, 0);
    const shippingCost = 0;
    const discount = 0;
    const total = subTotal - shippingCost - discount;

    const totalSumary: ToTalSumary = { subTotal, shippingCost, discount, total };

    return totalSumary;
  }
}
