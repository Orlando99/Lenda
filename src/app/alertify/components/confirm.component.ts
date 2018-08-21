import { Component, OnInit, EventEmitter, Inject, NgZone } from '@angular/core';
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
    @Inject(MAT_DIALOG_DATA) public data: any,private ngZone: NgZone
  ) { }

  onOkClick(): void {
    
    this.dialogRef.afterClosed().subscribe(res=>{
      //console.error(res)
    })
    this.dialogRef.beforeClose().subscribe(res=>{
      //console.error(res)
    })
    this.ngZone.run(() => {
      this.dialogRef.close();
   });
    this.onDataRecieved.emit(true);
  }

  onCancelClick(): void {
    this.ngZone.run(() => {
      this.dialogRef.close();
   });
    this.onDataRecieved.emit(false);
  }
}