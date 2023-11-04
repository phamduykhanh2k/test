import { EventEmitter, Injectable } from '@angular/core';
import { Feedback } from '../models/data-types';
import { HttpClient } from '@angular/common/http';
import { ObservableService } from './observable.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormGroup } from '@angular/forms';
import { FilterService } from './filter.service';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  public FeedbacksEmit = new EventEmitter<Feedback[]>();
  private schemaName = 'feedbacks';
  private Feedbacks: Feedback[] = [];

  constructor(
    private observableSrv: ObservableService,
    private nzMessageService: NzMessageService,
    private filterSrv: FilterService) { }


  getAllFeedback = async () => {
    return await this.observableSrv.getAll(this.schemaName);
  }

  getFeedback = async (id: string) => {
    return await this.observableSrv.get(this.schemaName, id);
  }

  getFeedbackByUserId = async (userId: string) => {
    const queryParam = { user: userId };
    const queryString = this.filterSrv.BuildQueryString(queryParam);
    return await this.filterSrv.filter(queryString);
  }

  getFeedbackByProductId = async (productId: string) => {
    const queryString = 'feedbacks?product=' + productId;
    return await this.filterSrv.filter(queryString);
  }

  createFeedback = async (data: any) => {
    const result = await this.observableSrv.post(this.schemaName, data);

    if (result) {
      this.Feedbacks.push(result);
      this.nzMessageService.success('Thêm thành công!');
      return true;
    }

    this.nzMessageService.error('Thêm thất bại!');
    return false;
  }

  updateFeedback = async (FeedbackForm: FormGroup) => {
    // const data = FeedbackForm.value;
    // const result = await this.observableSrv.update(this.schemaName, data);

    // if (result.modifiedCount > 0) {
    //   const findIndex = this.Feedbacks.findIndex(item => item._id === data._id);

    //   this.Feedbacks[findIndex] = data;
    //   this.nzMessageService.success('Cập nhật thành công');

    //   return true;
    // }

    // this.nzMessageService.error('Cập nhật thất bại');
    // return false;
  }

  deleteFeedback = async (_id: string) => {
    // const result = await this.observableSrv.delete(this.schemaName, _id);

    // if (result.modifiedCount > 0) {
    //   const findIndex = this.Feedbacks.findIndex(item => item._id! === _id);

    //   this.Feedbacks.splice(findIndex);
    //   this.nzMessageService.success('Xóa thành công');

    //   return true;
    // }

    // this.nzMessageService.error('Xóa thất bại');
    // return false;
  }
}


