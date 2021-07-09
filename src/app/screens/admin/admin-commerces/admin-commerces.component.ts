import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute } from '@angular/router';
import * as mapboxgl from 'mapbox-gl';
import { MapComponent } from 'src/app/components/map/map.component';
import Commerce from 'src/app/models/db/commerce';
import PaymentMethod from 'src/app/models/db/payment-method';
import { CommerceService } from 'src/app/services/firestore/commerce.service';
import { PaymentMethodsService } from 'src/app/services/firestore/paymenth-methods.service';
import { StoreService } from 'src/app/services/store.service';
import { generateCommerceId } from 'src/app/utils/commons.function';
import { PATTERN } from 'src/app/utils/pattern';

@Component({
  selector: 'eu-admin-commerces',
  templateUrl: './admin-commerces.component.html',
  styleUrls: ['./admin-commerces.component.scss'],
})
export class AdminCommercesComponent implements OnInit {
  @ViewChild('map') mapComponent: MapComponent;
  documentTypes = this.store.appState.documentTypes;
  formGroup = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    documentNo: new FormControl(null, [Validators.required]),
    url: new FormControl(null, [Validators.required]),
    mail: new FormControl(null, [
      Validators.required,
      Validators.pattern(PATTERN.mail),
    ]),
    phone: new FormControl(null, [Validators.required]),
    enabled: new FormControl(true, [Validators.required]),
    duration: new FormControl(null, [
      Validators.required,
      Validators.pattern(PATTERN.duration),
    ]),
    rate: new FormControl(null, [Validators.required]),
  });
  commerce: Commerce = this.activeRouter.snapshot.data.selectPayment.commerce;
  geoposition;
  removable = true;
  sections: string[] = [];
  words: string[] = [];
  paymentMethods: PaymentMethod[] =
    this.activeRouter.snapshot.data.selectPayment.paymentMethods;

  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  constructor(
    private activeRouter: ActivatedRoute,
    private commerceService: CommerceService,
    private paymentMethodservice: PaymentMethodsService,
    private store: StoreService
  ) {}

  ngOnInit(): void {
    if (!this.commerce) {
      return;
    }
    this.formGroup.controls.name.setValue(this.commerce.name);
    this.formGroup.controls.name.disable();
    this.formGroup.controls.documentNo.setValue(this.commerce.documentNo);
    this.formGroup.controls.documentNo.disable();
    this.formGroup.controls.url.setValue(this.commerce.url);
    this.formGroup.controls.url.disable();
    this.formGroup.controls.mail.setValue(this.commerce.mail);
    this.formGroup.controls.phone.setValue(this.commerce.phone);
    this.formGroup.controls.enabled.setValue(this.commerce.enabled);
    this.formGroup.controls.duration.setValue(this.commerce.duration);
    this.formGroup.controls.rate.setValue(this.commerce.rate);
    this.sections = this.commerce.sections;
    this.words = this.commerce.categories;
    this.geoposition = this.commerce.geolacation;
  }

  addWord(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.words.push(value);
    }
    event.input.value = null;
  }

  removeWord(word: string): void {
    const index = this.words.indexOf(word);
    if (index >= 0) {
      this.words.splice(index, 1);
    }
  }

  addSection(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.sections.push(value);
    }
    event.input.value = null;
  }

  removeSection(word: string): void {
    const index = this.sections.indexOf(word);
    if (index >= 0) {
      this.sections.splice(index, 1);
    }
  }

  addPayment(
    paymentMethodType: string,
    accountName: string,
    accountNumber: string,
    ownerName: string,
    docType: string,
    ownerDocument: string
  ): void {
    const paymentMethod = new PaymentMethod();
    const id = (this.paymentMethods.length + 1).toString().padStart(3, '0');
    paymentMethod.id = id;
    paymentMethod.ownerDocType = docType;
    paymentMethod.ownerDocument = Number(ownerDocument);
    paymentMethod.ownerName = ownerName;
    paymentMethod.accountName = accountName;
    paymentMethod.accountNumber = Number(accountNumber);
    paymentMethod.type = Number(paymentMethodType);
    this.paymentMethods.push(paymentMethod);
  }

  deletePaymentMethod(paymentMethod: PaymentMethod): void {
    const index = this.paymentMethods.indexOf(paymentMethod);
    if (index >= 0) {
      this.paymentMethods.splice(index, 1);
    }
  }

  async onSaveOrUpdate(): Promise<void> {
    this.store.startLoader();
    const id = this.commerce
      ? this.commerce.id
      : generateCommerceId(
          this.formGroup.controls.name.value,
          this.formGroup.controls.documentNo.value
        );
    const resp = !this.commerce
      ? await this.commerceService.findById(id)
      : null;
    if (resp) {
      this.store.endLoader();
      return;
    }
    const commerce = new Commerce();
    commerce.id = id;
    commerce.geolacation = this.geoposition;
    commerce.name = this.formGroup.controls.name.value;
    commerce.documentNo = this.formGroup.controls.documentNo.value;
    commerce.duration = this.formGroup.controls.duration.value;
    commerce.enabled = this.formGroup.controls.enabled.value;
    commerce.mail = this.formGroup.controls.mail.value;
    commerce.phone = this.formGroup.controls.phone.value;
    commerce.rate = this.formGroup.controls.rate.value;
    commerce.url = this.formGroup.controls.url.value;
    commerce.categories = this.words;
    commerce.sections = this.sections;
    if (this.commerce) {
      await this.commerceService.update(commerce);
      await this.paymentMethodservice.deleteByCommerce(this.commerce.id);
      for await (const paymentMethod of this.paymentMethods) {
        const index = this.paymentMethods.indexOf(paymentMethod) + 1;
        paymentMethod.id = `${this.commerce.id}-${index
          .toString()
          .padStart(3, '0')}`;
        paymentMethod.commerce = commerce.id;
        await this.paymentMethodservice.save(paymentMethod);
      }
    } else {
      await this.commerceService.save(commerce);
      for await (const paymentMethod of this.paymentMethods) {
        paymentMethod.id = `${commerce.id}-${paymentMethod.id}`;
        paymentMethod.commerce = commerce.id;
        await this.paymentMethodservice.save(paymentMethod);
      }
    }
    this.store.endLoader();
  }
}
