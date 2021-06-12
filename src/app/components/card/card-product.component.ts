import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CONSTANTS } from 'src/app/utils/constants';

@Component({
  selector: 'eu-card-product',
  templateUrl: './card-product.component.html',
  styleUrls: ['./card-product.component.scss'],
})
export class CardProductComponent implements OnInit {
  @Input() description: string;
  @Input() imageSrc: string;
  @Input() price: number;
  @Input() qty: number;
  @Input() rating: number;
  @Input() title: string;
  @Output() clickEvent = new EventEmitter();
  genericImage = CONSTANTS.genericImg;

  constructor() {}

  ngOnInit(): void {}
}
