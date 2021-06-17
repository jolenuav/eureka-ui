import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Subscription } from 'rxjs';
import Order from 'src/app/models/db/order/order';
import PaymentMethod from 'src/app/models/db/payment-method';
import { OrderService } from 'src/app/services/firestore/order.service';
import { StoreService } from 'src/app/services/store.service';
import { CONSTANTS } from 'src/app/utils/constants';
import { DetailModalComponent } from './detail-modal/detail-modal.component';

@Component({
  selector: 'eu-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
})
export class OrderListComponent implements OnInit {
  reference: number;
  ordersSubject = new BehaviorSubject<Order[]>([]);
  orders$ = this.ordersSubject.asObservable();
  subscription: Subscription;

  constructor(
    private modalService: NgbModal,
    private orderService: OrderService,
    private store: StoreService
  ) {}

  ngOnInit(): void {
    this.subscription = this.orderService
      .getAllSnapshot()
      .subscribe((_orders: Order[]) => {
        this.ordersSubject.next(_orders);
      });
  }

  openModal(order: Order): void {
    const modalRef = this.modalService.open(DetailModalComponent, {
      size: 'lg',
    });
    modalRef.componentInstance.configModal(order);
  }

  async changeStatus(
    order: Order,
    status: string,
    template?: any
  ): Promise<void> {
    if (status === 'P' && order.payOrder.paymentType !== PaymentMethod.CASH) {
      this.modalService
        .open(template, { size: 'sm' })
        .closed.subscribe(async () => {
          if (this.reference) {
            order.payOrder.payment = this.reference;
            await this.orderService.changeStatus(order, status);
            this.reference = null;
          }
        });
      return;
    }
    this.store.startLoader();
    await this.orderService.changeStatus(order, status);
    this.store.endLoader();
  }

  disableStatusBtn(status: string, statusChange: string): boolean {
    let disabled = true;
    if (
      status !== CONSTANTS.status.canceled.id &&
      status !== CONSTANTS.status.diff.id &&
      statusChange === CONSTANTS.status.canceled.id
    ) {
      disabled = false;
    }
    switch (status) {
      case CONSTANTS.status.diff.id:
        if (
          statusChange === CONSTANTS.status.pendding.id ||
          statusChange === CONSTANTS.status.refused.id
        ) {
          disabled = false;
        }
        break;

      case CONSTANTS.status.pendding.id:
        if (statusChange === CONSTANTS.status.inProgress.id) {
          disabled = false;
        }
        break;

      case CONSTANTS.status.inProgress.id:
        if (statusChange === CONSTANTS.status.inComming.id) {
          disabled = false;
        }
        break;

      case CONSTANTS.status.inComming.id:
        if (statusChange === CONSTANTS.status.finished.id) {
          disabled = false;
        }
        break;

      case CONSTANTS.status.refused.id:
      case CONSTANTS.status.canceled.id:
      case CONSTANTS.status.finished.id:
      default:
        disabled = true;
        break;
    }
    return disabled;
  }
}
