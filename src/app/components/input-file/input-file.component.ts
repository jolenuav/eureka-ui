import { Component, Optional, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { noop } from 'rxjs';

@Component({
  selector: 'eu-input-file',
  templateUrl: './input-file.component.html',
  styleUrls: ['./input-file.component.scss'],
})
export class InputFileComponent implements ControlValueAccessor {
  fileToUpload: File = null;
  selectedFileNames = '';
  disabled = false;
  private _onChangeCallback: (_: any) => void = noop;

  constructor(@Self() @Optional() private ngControl: NgControl) {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  writeValue(obj: File): void {
    this.fileToUpload = obj;
  }
  registerOnChange(fn: any): void {
    this._onChangeCallback = fn;
  }
  registerOnTouched(fn: any): void {}
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  captureImage(e): void {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    this.fileToUpload = e.target.files.item(0);
    this.selectedFileNames = this.fileToUpload.name;
    this._onChangeCallback(this.fileToUpload);
  }
}
