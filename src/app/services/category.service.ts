import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { ServerData } from '../models/serverData';
import { Category } from '../models/category';
import { Observable, Subject } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ObservableService } from './observable.service';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  categoriesEmit = new EventEmitter<Category[]>();
  private schemaName = 'categories';
  private categories: Category[] = [];

  constructor(
    private http: HttpClient,
    private observableSrv: ObservableService,
    private nzMessageService: NzMessageService
  ) { }

  getAllCategory = async () => {
    const result = await this.observableSrv.getAll(this.schemaName);

    if (result && result.EC === 0) {
      this.categories = result.data;
      this.categoriesEmit.emit(this.categories);
    }


  }

  createCategory = async (data: FormGroup): Promise<boolean> => {
    const category = {
      name: data.value.name,
      description: data.value.description
    };
    const result = await this.observableSrv.post(this.schemaName, category);

    if (result && result.EC === 0) {
      this.categories.push(result.data);
      this.nzMessageService.success('Thêm thành công');
      return true;
    }

    this.nzMessageService.success('Thêm thất bại');
    return false;
  }

  updateCategory = async (data: FormGroup): Promise<boolean> => {
    const category = data.value;
    const result = await this.observableSrv.update(this.schemaName, category);

    if (result && result.EC === 0 && result.data.modifiedCount > 0) {
      const findIndex = this.categories.findIndex(item => item._id === category._id);

      this.categories[findIndex] = category;
      this.nzMessageService.success('Cập nhật thành công');
      this.getAllCategory();

      return true;
    }

    this.nzMessageService.error('Cập nhật thất bại');
    return false;
  }

  deleteCategory = async (_id: string) => {
    const result = await this.observableSrv.delete(this.schemaName, _id);

    if (result && result.EC === 0 && result.data.modifiedCount > 0) {
      const findIndex = this.categories.findIndex(item => item._id === _id);

      this.categories.splice(findIndex, 1);
      this.nzMessageService.success('Xóa thành công');

      return true;
    }
    this.nzMessageService.error('Xóa thất bại');
    return false;
  }
}
