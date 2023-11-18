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
    private cartSrv: CartService,
  ) { }

  GetAllOrder = async () => {
    let result = await this.observableSrv.getAll(this.schemaName);

    if (result && result.EC === 0) {
      return result.data;
    } else {

    }
  }

  getOrder = async (id: string) => {
    let result = await this.observableSrv.get(this.schemaName, id);
    if (result && result.EC === 0) {
      return result.data;

    }
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

  createOrder = async (data: any) => {
    const result = await this.observableSrv.post(this.schemaName, data);

    if (result && result.EC === 0) {
      localStorage.removeItem('cart');
      localStorage.removeItem('voucher');
      this.cartSrv.cartEmit.emit([]);
      return result.data;
    }
    return null;
  }

  updateOrder = async (status: string, order: any) => {
    const data = { ...order, status };
    console.log(data)
    const result = await this.observableSrv.update(this.schemaName, data);

    if (result && result.EC === 0 && result.data.modifiedCount > 0) {
      const result = await this.observableSrv.getAll(this.schemaName);

      if (result && result.EC === 0) {
        this.orders.emit(result.data);
        return true;
      }

    }
    return false;
  }
}
