import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ["./alertify.style.scss"]
})

export class ConfirmComponent {
  onDataRecieved = new EventEmitter();
  constructor(
    public dialogRef: MatDialogRef<ConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onOkClick(): void {
    this.dialogRef.close();
    this.onDataRecieved.emit(true);
  }

  onCancelClick(): void {
    this.dialogRef.close();
    this.onDataRecieved.emit(false);
  }
}