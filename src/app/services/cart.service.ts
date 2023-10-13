import { EventEmitter, Injectable } from '@angular/core';
import { Product } from '../models/product';
import { ToastrService } from 'ngx-toastr';
import { Route, Router } from '@angular/router';
import { Cart } from '../models/cart';
import { TotalSumary } from '../models/totalSumary';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  public cartData = new EventEmitter<Product[] | []>();
  public totalSumaryEmit = new EventEmitter<TotalSumary>();
  private products: Product[] = [];

  constructor(private toasr: ToastrService, private router: Router) { }

  getCart() {
    const localCart = localStorage.getItem('localCart');
    if (localCart) {
      this.products = JSON.parse(localCart);

      this.cartData.emit(this.products);
    }
    return this.products;
  }

  getTotalSumary(products: Product[], shipCost: number) {
    const subTotal = products.reduce((total: number, item: Product) => {
      return total += item.price * item.cartQuantity;
    }, 0);

    const totalSumary: TotalSumary = {
      subTotal: subTotal,
      shipCost: shipCost,
      total: subTotal + shipCost
    }

    return totalSumary;
  }

  localAddToCart(data: Product) {
    let cartData = [];
    let localCart = localStorage.getItem('localCart');

    if (!localCart) {
      localStorage.setItem('localCart', JSON.stringify([data]));
      cartData.push(data);
    } else {
      cartData = JSON.parse(localCart);

      let existItem = cartData.filter((item: Product) => item._id === data._id);

      if (existItem.length === 0) {
        cartData.push(data);
      } else {
        existItem[0].cartQuantity += data.cartQuantity;
      }
      localStorage.setItem('localCart', JSON.stringify(cartData));
    }
    this.toasr.success('Bạn đã thêm: ' + data.name + ' x ' + data.cartQuantity, 'Thêm thành công')
    this.cartData.emit(cartData);
  }

  localRemoveItemCart(itemId: string) {
    let localCart = localStorage.getItem('localCart');

    if (localCart) {
      let cartData = JSON.parse(localCart);
      let items = cartData.filter((item: Product) => !(item._id === itemId))

      localStorage.setItem('localCart', JSON.stringify(items));
      this.cartData.emit(items);
    }
  }

  singleAddToCart(item: Product) {
    if (localStorage.getItem('user')) {
      item.cartQuantity = 1;
      this.localAddToCart(item);
    } else {
      this.toasr.warning('Vui lòng đăng nhập để mua sản phẩm')
      this.router.navigate(['/authentication']);
    }
  }

  changeQuantity(type: string, indexItem: number) {
    if (this.products) {
      let item = this.products[indexItem];

      if (item.cartQuantity < item.quantity && type === 'plus') {
        item.cartQuantity += 1;
      } else if (item.cartQuantity > 1 && type === 'min') {
        item.cartQuantity -= 1;
      } else if (item.cartQuantity >= item.quantity && type === 'plus') {
        this.toasr.warning('Vui lòng liên hệ cửa hàng để đặt sản phẩm', 'Sản phẩm không đủ')
      }
      localStorage.setItem('localCart', JSON.stringify(this.products));
      this.cartData.emit(this.products);
      this.totalSumaryEmit.emit(this.getTotalSumary(this.products, 0))
    }
  }
}
