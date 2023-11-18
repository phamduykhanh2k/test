import { EventEmitter, Injectable } from '@angular/core';
import { Feedback } from '../models/data-types';
import { HttpClient } from '@angular/common/http';
import { ObservableService } from './observable.service';
import { FormGroup } from '@angular/forms';
import { FilterService } from './filter.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  public FeedbacksEmit = new EventEmitter<Feedback[]>();
  private schemaName = 'feedbacks';
  private Feedbacks: Feedback[] = [];

  constructor(
    private observableSrv: ObservableService,
    private toastr: ToastrService,
    private filterSrv: FilterService) { }


  getAllFeedback = async () => {
    let result = await this.observableSrv.getAll(this.schemaName);

    if (result && result.EC === 0)
      this.FeedbacksEmit.emit(result.data);
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
    let result = await this.filterSrv.filter(queryString);
    if (result && result.EC === 0) {
      return result.data;
    }
  }

  createFeedback = async (data: any) => {
    const result = await this.observableSrv.post(this.schemaName, data);

    if (result && result.EC === 0) {
      this.Feedbacks.push(result.data);
      this.toastr.success('Thêm thành công!');
      return true;
    }

    this.toastr.error('Thêm thất bại!');
    return false;
  }

  updateFeedback = async (data: any) => {
    const result = await this.observableSrv.update(this.schemaName, data);

    if (result && result.EC === 0 && result.data.modifiedCount > 0) {
      return true;
    }

    this.toastr.error('Thêm thất bại!');
    return false;
  }

  deleteFeedback = async (_id: string) => {
    // const result = await this.observableSrv.delete(this.schemaName, _id);

    // if (result && result.EC === 0 && result.data.modifiedCount > 0) {
    //   const findIndex = this.Feedbacks.findIndex(item => item._id! === _id);

    //   this.Feedbacks.splice(findIndex);
    //   this.toastr.success('Xóa thành công');

    //   return true;
    // }

    // this.toastr.error('Xóa thất bại');
    // return false;
  }
}


