import { EventEmitter, Injectable } from '@angular/core';
import { Product } from '../models/product';
import { ToastrService } from 'ngx-toastr';
import { Route, Router } from '@angular/router';
import { CartItem, ToTalSumary } from '../models/data-types';
import { UserAuthService } from './user-auth.service';
import { find } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  public cartEmit = new EventEmitter<CartItem[]>();

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

  removeLocalCart = () => {
    localStorage.removeItem('cart');
    this.cartEmit.emit([]);
  }

  updateCart = (cart: CartItem[]) => {
    const isValid = this.isValidQuantityByCart(cart);
    if (isValid) {
      this.cartEmit.emit(cart);
      localStorage.setItem("cart", JSON.stringify(cart));
      this.toastr.success("Cập nhật giỏ hàng thành công");
      return cart;
    }
    return null;
  }

  removeItemtoCart = (index: number) => {
    const cart: CartItem[] = this.getLocalCart();
    const isDelete = confirm(`Bạn chắn chắn muốn bỏ ${cart.at(index)?.product.name} này chứ?`);

    if (isDelete) {
      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      this.cartEmit.emit(cart);
      this.toastr.success("Xóa sản phẩm thành công");
      return cart;
    }
    return null;
  }

  isValidQuantity = (quantity: number, product: Product): boolean => {
    const localCart: CartItem[] = this.getLocalCart();
    const cartItem = localCart.find(cartItem => cartItem.product._id === product._id);
    if (quantity <= 0) {
      this.toastr.warning('Số lượng không hợp lệ');
      return false;
    }

    if (quantity > product.quantity) {
      this.toastr.warning(`Số lượng ${product.name} không còn đủ hàng`, "Hết hàng");
      return false;
    }

    if (cartItem && cartItem.quantity + quantity > product.quantity) {
      this.toastr.warning(`Số lượng ${cartItem!.product.name} không còn đủ hàng`, "Hết hàng");
      return false;
    }

    return true;
  }

  isValidQuantityByCart = (cart: CartItem[]): boolean => {
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].quantity <= 0) {
        this.toastr.warning('Số lượng không hợp lệ');
        return false;
      }

      if (cart[i].quantity > cart[i].product.quantity) {
        this.toastr.warning(`Số lượng ${cart[i].product.name} không còn đủ hàng`, "Hết hàng");
        return false;
      }
    }
    return true;
  }

  processTotalSumary = (cart: CartItem[], voucherDiscount?: number) => {
    const subTotal = cart.reduce((previousValue, currentValue) => {
      return previousValue + (currentValue.product.price * currentValue.quantity);
    }, 0);
    const shippingCost = 25000;
    let discount = voucherDiscount || 0;
    const total = subTotal + shippingCost - discount;

    const totalSumary: ToTalSumary = { subTotal, shippingCost, discount, total };

    return totalSumary;
  }
}
