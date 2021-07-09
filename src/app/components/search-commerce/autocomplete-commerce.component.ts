import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import Commerce from 'src/app/models/db/commerce';
import { CommerceService } from 'src/app/services/firestore/commerce.service';

@Component({
  selector: 'eu-autocomplete-commerce',
  templateUrl: './autocomplete-commerce.component.html',
  styleUrls: ['./autocomplete-commerce.component.scss'],
})
export class AutocompleteCommerceComponent implements OnInit {
  commerceControl = new FormControl();
  commercesSubject = new BehaviorSubject<Commerce[]>([]);
  commerceSelected: Commerce;
  filteredCommecesSubject = new BehaviorSubject<Commerce[]>([]);
  filteredCommeces$ = this.filteredCommecesSubject.asObservable();
  subscription: Subscription;
  @Output() changeEvent = new EventEmitter<Commerce>();

  constructor(private commerceService: CommerceService) {}

  ngOnInit(): void {
    this.subscription = this.commerceService
      .findAllSnapshot()
      .subscribe((commerces) => {
        console.log(commerces);
        this.commercesSubject.next(commerces);
        this.filteredCommecesSubject.next(commerces);
      });
    this.commerceControl.valueChanges.subscribe((value) =>
      this.filterCommerce(value)
    );
  }

  filterCommerce(value): void {
    console.log('filter', value);
    this.commerceSelected = null;
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      this.filteredCommecesSubject.next(this.commercesSubject.value);
    }
    if (typeof value === 'string') {
      const param = value.trim().toUpperCase();
      const resp = this.commercesSubject.value.filter(
        (commerce) =>
          commerce.id.includes(param) ||
          commerce.name.toUpperCase().includes(param)
      );
      this.filteredCommecesSubject.next(resp);
    } else {
      this.commerceSelected = this.commercesSubject.value
        .find((commerce) => commerce.id === value.id)
        .clone();
      this.changeEvent.emit(this.commerceSelected);
    }
  }

  displayCommerceName(commerce: Commerce): string {
    return commerce ? `${commerce.id} ${commerce.name}` : '';
  }

  @Input()
  set setCommerce(commerce: Commerce) {
    this.commerceControl.setValue(commerce);
  }
}
