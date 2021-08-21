import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor(private snackBar: MatSnackBar) {}

  errorAlert(msg: string): void {
    this.snackBar.open(msg, null, {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: `error-alert`,
    });
  }

  successAlert(msg: string): void {
    this.snackBar.open(msg, null, {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: `success-alert`,
    });
  }
}
