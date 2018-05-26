import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'alert',
  templateUrl: './alert.component.html',
  styleUrls: ["./alertify.style.scss"]
})
export class AlertComponent {
  onDataRecieved = new EventEmitter();
  constructor(
    public dialogRef: MatDialogRef<AlertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onOkClick(): void {
    this.dialogRef.close();
    this.onDataRecieved.emit(true);
  }
}