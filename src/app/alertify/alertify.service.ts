import { Injectable } from '@angular/core';
import { AlertComponent } from './components/alert.component'
import { ConfirmComponent } from './components/confirm.component'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class AlertifyService {
  constructor(public dialog: MatDialog) { }

  alert(title, description): Observable<any> {
    let dialogRef = this.dialog.open(AlertComponent, {
      height: 'auto',
      width: '570px',
      role: 'alertdialog',
      position: { top: '100px' },
      data: { title: title, description: description }
    });
    return dialogRef.componentInstance.onDataRecieved
  }

  confirm(title, description): Observable<any> {
    let dialogRef = this.dialog.open(ConfirmComponent, {
      height: 'auto',
      width: '570px',
      role: 'alertdialog',
      position: { top: '100px' },
      data: { title: title, description: description }
    });
    return dialogRef.componentInstance.onDataRecieved
  }

}

