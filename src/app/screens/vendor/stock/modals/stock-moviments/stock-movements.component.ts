import { Component, OnInit } from '@angular/core';
import StockMovement from 'src/app/models/db/stock/stock-movement';

@Component({
  selector: 'eu-stock-movements',
  templateUrl: './stock-movements.component.html',
  styleUrls: ['./stock-movements.component.scss'],
})
export class StockMovementsComponent implements OnInit {
  movements: StockMovement[] = [];

  constructor() {}

  ngOnInit(): void {}

  configModal(movements: StockMovement[]): void {
    this.movements = movements;
  }
}
