import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import ItemOrder from 'src/app/models/db/order/item-order';
import Order from 'src/app/models/db/order/order';

@Component({
  selector: 'eu-detail-modal',
  templateUrl: './detail-modal.component.html',
  styleUrls: ['./detail-modal.component.scss'],
})
export class DetailModalComponent implements OnInit {
  order: Order;
  products: ItemOrder[] = [];

  constructor(private activeModal: NgbActiveModal) {}

  ngOnInit(): void {}

  configModal(order: Order): void {
    this.order = order;
    this.products = order.products;
  }
}
