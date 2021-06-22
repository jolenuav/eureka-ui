import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import Commerce from 'src/app/models/db/commerce';
import { CommerceService } from 'src/app/services/firestore/commerce.service';
import { StoreService } from 'src/app/services/store.service';
import { generateCommereId } from 'src/app/utils/commons.function';
import { PATTERN } from 'src/app/utils/pattern';

@Component({
  selector: 'eu-admin-commerces',
  templateUrl: './admin-commerces.component.html',
  styleUrls: ['./admin-commerces.component.scss'],
})
export class AdminCommercesComponent implements OnInit {
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
  geoposition;
  removable = true;
  words: string[] = [];
  sections: string[] = [];

  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  constructor(
    private commerceService: CommerceService,
    private store: StoreService
  ) {}

  ngOnInit(): void {}

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

  async onSaveOrUpdate(): Promise<void> {
    this.store.startLoader();
    const id = generateCommereId(
      this.formGroup.controls.name.value,
      this.formGroup.controls.documentNo.value
    );
    const resp = await this.commerceService.findById(id);
    if (resp) {
      this.store.endLoader();
      return;
    }
    console.log(this.geoposition);
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
    await this.commerceService.save(commerce);
    this.store.endLoader();
  }
}
