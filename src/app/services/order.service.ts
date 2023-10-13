import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Order } from '../models/order';
import { User } from '../models/user';
import { TotalSumary } from '../models/totalSumary';
import { Product } from '../models/product';
import { ServerData } from '../models/serverData';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  public orderDataEmit = new EventEmitter<Order[]>();

  constructor(private http: HttpClient, private toastr: ToastrService, private router: Router) { }

  GetAll() {
    return this.http.get<ServerData>('http://localhost:8081/v1/api/orders');
  }

  GetOrderByUserId(userId: string) {
    this.http.get<ServerData>('http://localhost:8081/v1/api/orders?userId=' + userId).subscribe(result => {
      console.log(result.data)
      if (result.data.length > 0) {
        this.orderDataEmit.emit(result.data);
      } else {
        // show thông báo
      }
    });
  }

  AddOrder(userData: User, deliveryData: any, totalSumaryData: TotalSumary, products: Product[]) {
    const order: Order = {
      userId: userData._id!,
      address: deliveryData.address,
      note: deliveryData.note,
      phoneNumber: deliveryData.phoneNumber,
      shippingCost: totalSumaryData.shipCost,
      totalPrice: totalSumaryData.total,
      status: "Chờ xác nhận",
      products: products!
    }

    this.http.post<ServerData>('http://localhost:8081/v1/api/orders', order).subscribe(result => {
      if (result.data.length > 0) {
        this.toastr.success('Đặt hàng thành công');
        localStorage.removeItem('localCart');
        this.router.navigate(['']);
      } else {
        this.toastr.error('Có lễ hệ thống đang gặp sự cố', 'Đặt hàng thất bại')
      }
    })
  }

  DeleteOrder(id: any) {
    return this.http.delete('http://localhost:8081/v1/api/orders', id)
  }
}
