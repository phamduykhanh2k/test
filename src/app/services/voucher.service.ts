import { Injectable } from '@angular/core';
import { ObservableService } from './observable.service';
import { ToastrService } from 'ngx-toastr';
import { FilterService } from './filter.service';
import { BehaviorSubject } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
  providedIn: 'root'
})
export class VoucherService {
  private schemaName = 'vouchers';

  constructor(
    private observableSrv: ObservableService,
    private toastr: ToastrService,
    private filterSrv: FilterService,
    private nzMessageSrv: NzMessageService) { }

  applyVoucher = async (data: any) => {
    let result = await this.observableSrv.post(this.schemaName, data);

    if (result && result.EC === 0) {
      localStorage.setItem('voucher', JSON.stringify(result.data));
      return result.data;
    } else {
      this.toastr.warning(result?.errorMessage);
    }
  }

  getVoucherHasFilter = async () => {
    let queryString = this.schemaName + "?status=Còn hiệu lực&quantity>0&sort=-discount"
    let result = await this.filterSrv.filter(queryString);
    if (result && result.EC === 0)
      return result.data;
  }
  getLocalVoucher = () => {
    let localVoucher = localStorage.getItem('voucher');
    return localVoucher ? JSON.parse(localVoucher) : null;
  }

  getAllVoucher = async () => {
    let result = await this.observableSrv.getAll(this.schemaName);

    if (result && result.EC === 0) {
      return result.data;
    } else {
      this.toastr.error(result?.errorMessage);
      return null;
    }
  }

  createVoucher = async (data: any) => {
    let result = await this.observableSrv.post(this.schemaName, data);

    if (result && result.EC === 0) {
      this.nzMessageSrv.success('Thêm thành công');
      return result.data;
    } else {
      this.nzMessageSrv.error('Thêm thất bại');
      return null;
    }
  }

  updateVoucher = async (data: any) => {
    let result = await this.observableSrv.update(this.schemaName, data);

    if (result && result.EC === 0) {
      this.nzMessageSrv.success('Cập nhật thành công');
      return data;
    } else {
      this.nzMessageSrv.error('Cập nhật thất bại');
      return null;
    }

  }
}
