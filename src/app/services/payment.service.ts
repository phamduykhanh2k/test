import { Injectable } from '@angular/core';
import { ObservableService } from './observable.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private schemaName = 'payments';

  constructor(private observableSrv: ObservableService) { }

  createPayment = async (data: any) => {
    const result = await this.observableSrv.post(this.schemaName + '/create', data);
    let payUrl = null;

    if (result && result.data.payUrl) {
      payUrl = result.data.payUrl;
    }
    return payUrl;
  }
}
