import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Voucher } from 'src/app/models/data-types';
import { VoucherService } from 'src/app/services/voucher.service';
import { differenceInCalendarDays } from 'date-fns';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-voucher-manager',
  templateUrl: './voucher-manager.component.html',
  styleUrls: ['./voucher-manager.component.css']
})
export class VoucherManagerComponent implements OnInit {
  page = 1;
  vouchers: Voucher[];
  isVisible = false;
  isSubmitted = false;
  date = new Date();
  maxDate = new Date('2024-11-16');
  disabledDate = (current: Date): boolean => {
    return current < this.date || current > this.maxDate
  };

  nzTitle = '';
  nzOkText = '';

  voucherForm = this.builder.group({
    code: this.builder.control('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(30)])),
    discount: this.builder.control(0, Validators.compose([Validators.required, Validators.min(500)])),
    quantity: this.builder.control(0, Validators.compose([Validators.required, Validators.min(1)])),
    description: this.builder.control('')
  })

  constructor(
    private voucherSrv: VoucherService,
    private builder: FormBuilder,
    private nzMessageSrv: NzMessageService
  ) { }

  async ngOnInit(): Promise<void> {
    this.vouchers = await this.voucherSrv.getAllVoucher();
  }

  onOpenCreatedVoucher = () => {
    this.nzTitle = 'Thêm phiếu khuyến mãi';
    this.nzOkText = 'Thêm';
    this.isVisible = true;
  }

  onOpenUpdatedVoucher = (voucher: Voucher) => {
    this.voucherForm.setValue({
      code: voucher.code,
      discount: voucher.discount,
      quantity: voucher.quantity,
      description: voucher.description
    })
    this.date = voucher.expired_date;
    this.nzTitle = 'Cập nhật phiếu khuyến mãi';
    this.nzOkText = 'Cập nhật';
    this.isVisible = true;
  }

  onChange = (date: Date) => {

  }

  onSubmitForm = async (voucher?: Voucher) => {
    let voucherId = voucher?._id;

    if (this.voucherForm.valid) {
      if (!voucher) {
        let data = {
          type: "CREATE-VOUCHER",
          ...this.voucherForm.value,
          status: 'Còn hiệu lực',
          expired_date: this.date
        }
        let newData = await this.voucherSrv.createVoucher(data);

        if (newData) {
          this.vouchers.push(newData);
          this.nzMessageSrv.success('Thêm thành công');
          this.isVisible = false;
        } else {
          this.nzMessageSrv.error(newData);
        }
      }

      if (voucher) {
        let data = {
          _id: voucherId,
          ...this.voucherForm.value,
          status: 'Còn hiệu lực',
          expired_date: this.date
        }

        let newData = await this.voucherSrv.updateVoucher(data);

        if (newData) {
          voucher = newData;
          this.voucherForm.reset();
          this.isVisible = false;
        }
      }
    } else {
      this.isSubmitted = true;
    }
  }

  onCancel = () => {
    this.isSubmitted = false;
    this.isVisible = false;
  }

  onChangeStatus = async (voucher: Voucher, status: string) => {
    let data = {
      _id: voucher._id,
      status: status
    }

    let newData = await this.voucherSrv.updateVoucher(data);

    if (newData) {
      voucher.status = newData.status;
    }
  }

}
