import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Input, Optional, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { noop } from 'rxjs';

@Component({
  selector: 'eu-simple-chip',
  templateUrl: './simple-chip.component.html',
  styleUrls: ['./simple-chip.component.scss'],
})
export class SimpleChipComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = '';
  disabled = false;
  selecteds: string[];
  removable = true;

  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  private _onChangeCallback: (_: any) => void = noop;

  constructor(@Self() @Optional() private ngControl: NgControl) {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  writeValue(items: string[]): void {
    this.selecteds = items;
  }
  registerOnChange(fn: any): void {
    this._onChangeCallback = fn;
  }
  registerOnTouched(fn: any): void {}
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  @Input('disabled')
  set disabledSetter(disabled: boolean) {
    this.disabled = !!disabled;
    disabled
      ? this.ngControl.control.disable()
      : this.ngControl.control.enable();
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.selecteds.push(value);
    }
    event.input.value = null;
    this._onChangeCallback(this.selecteds);
  }

  remove(tag: string): void {
    const index = this.selecteds.indexOf(tag);
    if (index >= 0) {
      this.selecteds.splice(index, 1);
    }
    this._onChangeCallback(this.selecteds);
  }
}
