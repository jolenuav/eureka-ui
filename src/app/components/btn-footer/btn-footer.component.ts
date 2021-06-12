import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'eu-btn-footer',
  templateUrl: './btn-footer.component.html',
  styleUrls: ['./btn-footer.component.scss'],
})
export class BtnFooterComponent implements OnInit {
  @Input() label: string;
  @Input() disabled = false;
  @Output() clickEvent = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
}
