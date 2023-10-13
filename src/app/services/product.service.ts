import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Product } from '../models/product';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ServerData } from '../models/serverData';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  public productsEmit = new EventEmitter<Product[]>();
  private urlAPI = 'http://localhost:8081/v1/api/products/'

  constructor(private http: HttpClient) { }


  GetProducts() {
    this.http.get<ServerData>(this.urlAPI).subscribe(result => {
      this.productsEmit.emit(result.data);
    });
  }

  GetProductById(id: string) {
    return this.http.get<ServerData>('http://localhost:8081/v1/api/products/' + id);
  }

  CreateProduct(data: any): Observable<boolean> {
    let subject = new Subject<boolean>();
    this.http.post<ServerData>(this.urlAPI, data).subscribe(result => {
      if (result.data) {
        this.productsEmit.emit(result.data);
        this.GetProducts();
        subject.next(true);
      } else {
        subject.next(false);
      }
    })
    return subject.asObservable();
  }

  UpdateProduct(data: any) {
    let subject = new Subject<boolean>();
    this.http.put<ServerData>(this.urlAPI, data).subscribe(result => {
      const data: any = result.data;
      if (data.modifiedCount > 0) {
        this.productsEmit.emit(result.data);
        this.GetProducts();
        subject.next(true);
      } else {
        subject.next(false);
      }
    })
    return subject.asObservable();
  }

  DeleteProduct(id: string) {
    let subject = new Subject<boolean>();
    this.http.delete<ServerData>(this.urlAPI + id).subscribe(result => {
      const data: any = result.data;
      if (data.modifiedCount > 0) {
        this.productsEmit.emit(result.data);
        this.GetProducts();
        subject.next(true);
      } else {
        subject.next(false);
      }
    });

    return subject.asObservable();
  }
}
