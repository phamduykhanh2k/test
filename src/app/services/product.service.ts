import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Product } from '../models/product';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ServerData } from '../models/serverData';
import { Observable, Subject, find } from 'rxjs';
import { ObservableService } from './observable.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormGroup } from '@angular/forms';
import { FilterService } from './filter.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  public productsEmit = new EventEmitter<Product[]>();
  private schemaName = 'products';
  private products: Product[] = [];

  constructor(private http: HttpClient,
    private observableSrv: ObservableService,
    private nzMessageService: NzMessageService,
    private filterSrv: FilterService) { }


  getAllProduct = async () => {
    const products = await this.observableSrv.getAll(this.schemaName);
    this.products = products;
    this.productsEmit.emit(products);
  }

  getProduct = async (id: string) => {
    return await this.observableSrv.get(this.schemaName, id);
  }

  createProduct = async (productForm: FormGroup): Promise<boolean> => {
    productForm.removeControl('_id');
    const product: Product = productForm.value as Product;
    const result = await this.observableSrv.post(this.schemaName, product);

    if (result) {
      this.products.push(result);
      this.nzMessageService.success('Thêm thành công!');
      return true;
    }

    this.nzMessageService.error('Thêm thất bại!');
    return false;
  }

  updateProduct = async (productForm: FormGroup): Promise<boolean> => {
    const data = productForm.value;
    const result = await this.observableSrv.update(this.schemaName, data);

    if (result.modifiedCount > 0) {
      const findIndex = this.products.findIndex(item => item._id === data._id);

      this.products[findIndex] = data;
      this.nzMessageService.success('Cập nhật thành công');

      return true;
    }

    this.nzMessageService.error('Cập nhật thất bại');
    return false;
  }

  deleteProduct = async (_id: string) => {
    const result = await this.observableSrv.delete(this.schemaName, _id);

    if (result.modifiedCount > 0) {
      const findIndex = this.products.findIndex(item => item._id === _id);

      this.products.splice(findIndex);
      this.nzMessageService.success('Xóa thành công');

      return true;
    }

    this.nzMessageService.error('Xóa thất bại');
    return false;
  }

  handleFilterProductByName = async (name: string) => {
    const queryString = 'products?name=/^' + name + '/';
    return await this.filterSrv.filter(queryString);
  }
}
