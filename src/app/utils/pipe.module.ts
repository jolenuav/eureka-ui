import { NgModule, Pipe, PipeTransform } from '@angular/core';
import PaymentMethod from '../models/db/payment-method';
import { CONSTANTS } from './constants';

@Pipe({ name: 'accountNumber' })
export class PipeAccountNumber implements PipeTransform {
  transform(paymentMethod: PaymentMethod): string {
    if (!paymentMethod || !paymentMethod.accountNumber) {
      return '0000000000';
    }
    if (paymentMethod.type === PaymentMethod.TRANSFER) {
      return paymentMethod.accountNumber.toString();
    }
    if (paymentMethod.type === PaymentMethod.MOBILE) {
      const accountNumberStr = paymentMethod.accountNumber.toString();
      return `(0${accountNumberStr.substring(
        0,
        3
      )}) ${accountNumberStr.substring(4)}`;
    }
  }
}

@Pipe({ name: 'documentPaymentMethod' })
export class PipeDocumentWithPrefix implements PipeTransform {
  transform(paymentMethod: PaymentMethod): string {
    if (!paymentMethod || !paymentMethod.ownerDocument) {
      return '00.000.000';
    }
    return `${paymentMethod.ownerDocType} ${paymentMethod.ownerDocument}`;
  }
}

@Pipe({ name: 'truncate' })
export class PipeTruncate implements PipeTransform {
  transform(value: string, limit: number): string {
    return value.length < limit ? value : value.slice(0, limit) + '...';
  }
}

@Pipe({ name: 'status' })
export class PipeStatus implements PipeTransform {
  transform(value: string): string {
    let status = '';
    Object.entries(CONSTANTS.status).forEach((item) => {
      if (item[1].id === value) {
        status = item[1].description;
      }
    });
    return status;
  }
}

@Pipe({ name: 'paymentMethod' })
export class PipePaymentMethod implements PipeTransform {
  transform(value: number): string {
    let v = '';
    PaymentMethod.LIST.forEach((p) => {
      if (p.id === value) {
        v = p.description;
      }
    });
    return v;
  }
}

@NgModule({
  declarations: [
    PipeAccountNumber,
    PipeDocumentWithPrefix,
    PipeTruncate,
    PipeStatus,
    PipePaymentMethod,
  ],
  exports: [
    PipeAccountNumber,
    PipeDocumentWithPrefix,
    PipeTruncate,
    PipeStatus,
    PipePaymentMethod,
  ],
})
export class PipeModule {}
