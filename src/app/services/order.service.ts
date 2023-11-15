import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { User } from '../models/user';
import { Product } from '../models/product';
import { ServerData } from '../models/serverData';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Observable, Subject, retry, take } from 'rxjs';
import { CartItem, Order, ToTalSumary } from '../models/data-types';
import { FormControl, FormGroup } from '@angular/forms';
import { ObservableService } from './observable.service';
import { CartService } from './cart.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  public orders = new EventEmitter<Order[]>();
  private schemaName = 'orders';

  constructor(private http: HttpClient,
    private observableSrv: ObservableService,
    private toastr: ToastrService,
    private cartSrv: CartService,
    private nzMessageService: NzMessageService
  ) { }

  GetAllOrder = async () => {
    return await this.observableSrv.getAll(this.schemaName);
  }

  getOrder = async (id: string) => {
    return await this.observableSrv.get(this.schemaName, id);
  }

  GetOrderByUserId(userId: string) {
    this.http.get<ServerData>('http://localhost:8081/v1/api/orders?userId=' + userId, { withCredentials: true }).subscribe(result => {
      if (result.data.length > 0) {
        this.orders.emit(result.data);
        console.warn(result.data);
      } else {
        // show thông báo
      }
    });
  }

  createOrder = async (user: User, checkoutForm: FormGroup, totalSumary: ToTalSumary, cart: CartItem[]) => {
    const formValue = checkoutForm.value;
    const order: Order = {
      userId: user!._id || '',
      name: formValue.name || '',
      address: formValue.address || '',
      note: formValue.note || '',
      phone: formValue.phone || '',
      paymentMethod: formValue.paymentMethod || '',
      shippingCost: totalSumary.shippingCost,
      totalPrice: totalSumary.total,
      cart: cart,
      status: "Chờ xác nhận"
    }

    const result = await this.observableSrv.post(this.schemaName, order);

    if (result) {
      this.toastr.success("Đặt hàng thành công");
      localStorage.removeItem('cart');
      this.cartSrv.removeLocalCart();
      return true;
    }

    this.toastr.error('Có lẽ hệ thống đang gặp sự cố', 'Đặt hàng thất bại');
    return false;
  }

  updateOrder = async (type: string, order: Order) => {
    const data = { type, ...order };
    const result = await this.observableSrv.update(this.schemaName, data);

    if (result.modifiedCount > 0) {
      const orders = await this.observableSrv.getAll(this.schemaName);
      this.orders.emit(orders);
      this.nzMessageService.success('Hành động chạy thành công');

    } else {
      this.nzMessageService.error('Hành động chạy thất bại');
    }
  }


}
