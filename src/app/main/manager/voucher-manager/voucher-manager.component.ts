import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Voucher } from 'src/app/models/data-types';
import { VoucherService } from 'src/app/services/voucher.service';
import { differenceInCalendarDays } from 'date-fns';

@Component({
  selector: 'app-voucher-manager',
  templateUrl: './voucher-manager.component.html',
  styleUrls: ['./voucher-manager.component.css']
})
export class VoucherManagerComponent implements OnInit {
  vouchers: Voucher[];
  isVisible = false;
  isSubmitted = false;
  minDate = new Date();
  maxDate = new Date('2024-11-16');
  disabledDate = (current: Date): boolean => {
    return current < this.minDate || current > this.maxDate
  };

  nzTitle = '';
  nzOkText = '';

  voucherForm = this.builder.group({
    code: this.builder.control('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(30)])),
    discount: this.builder.control('', Validators.compose([Validators.required, Validators.min(500), Validators.max(10000000)])),
    quantity: this.builder.control('', Validators.compose([Validators.required, Validators.min(1), Validators.max(9999)])),
    description: this.builder.control('')
  })

  constructor(
    private voucherSrv: VoucherService,
    private builder: FormBuilder
  ) { }

  async ngOnInit(): Promise<void> {
    this.vouchers = await this.voucherSrv.getAllVoucher();
    console.log(this.vouchers)
  }

  onOpenCreatedVoucher = () => {
    this.nzTitle = 'Thêm phiếu khuyến mãi';
    this.nzOkText = 'Thêm';
    this.isVisible = true;
  }

  onOpenUpdatedVoucher = (voucher: Voucher) => {
    this.nzTitle = 'Cập nhật phiếu khuyến mãi';
    this.nzOkText = 'Cập nhật';
    this.isVisible = true;
  }

  onChange = (date: Date) => {

  }

  onUpdated = () => {
    console.log(this.voucherForm.value);
  }

  onCancel = () => {
    this.isSubmitted = false;
    this.isVisible = false;
  }

  onChangeStatus = (voucher: Voucher) => {

  }

}
