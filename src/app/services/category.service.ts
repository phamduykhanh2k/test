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
    const categories = await this.observableSrv.getAll(this.schemaName);

    this.categories = categories;
    this.categoriesEmit.emit(this.categories);
  }

  createCategory = async (data: FormGroup): Promise<boolean> => {
    const category = data.value as Category;
    const result = await this.observableSrv.post(this.schemaName, category);

    if (result) {
      this.categories.push(result);
      this.nzMessageService.success('Thêm thành công');
      return true;
    }

    this.nzMessageService.success('Thêm thất bại');
    return false;
  }

  updateCategory = async (data: FormGroup): Promise<boolean> => {
    const category = data.value;
    const result = await this.observableSrv.update(this.schemaName, category);

    if (result.modifiedCount > 0) {
      const findIndex = this.categories.findIndex(item => item._id === category._id);

      this.categories[findIndex] = category;
      this.nzMessageService.success('Cập nhật thành công');

      return true;
    }

    this.nzMessageService.error('Cập nhật thất bại');
    return false;
  }

  deleteCategory = async (_id: string) => {
    const result = await this.observableSrv.delete(this.schemaName, _id);

    if (result.modifiedCount > 0) {
      const findIndex = this.categories.findIndex(item => item._id === _id);

      this.categories.splice(findIndex);
      this.nzMessageService.success('Xóa thành công');

      return true;
    }
    this.nzMessageService.error('Xóa thất bại');
    return false;
  }
}
