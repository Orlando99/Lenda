import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { LocalStorageService } from 'ngx-webstorage';
import { LoancalculationWorker } from '../../../Workers/calculations/loancalculationworker';
import { ToastsManager } from 'ng2-toastr';
import { LoggingService } from '../../../services/Logs/logging.service';
import { environment } from '../../../../environments/environment.prod';
import { loan_model, loan_borrower, Loan_Association, borrower_model, BorrowerEntityType } from '../../../models/loanmodel';
import { LoanApiService } from '../../../services/loan/loanapi.service';
import { getNumericCellEditor } from '../../../Workers/utility/aggrid/numericboxes';
import { SelectEditor } from '../../../aggridfilters/selectbox';
import { DeleteButtonRenderer } from '../../../aggridcolumns/deletebuttoncolumn';
import { AlertifyService } from '../../../alertify/alertify.service';
import { JsonConvert } from 'json2typescript';
import { Page, PublishService } from '../../../services/publish.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
@Component({
  selector: 'app-borrower-info',
  templateUrl: './borrower-info.component.html',
  styleUrls: ['./borrower-info.component.scss']
})
export class BorrowerInfoComponent implements OnInit {

  localloanobj: loan_model;
  selectedAssociaionTypeCode : string = '';
  loan_id: number;
  borrowerInfo : any; //Will contain loan_master for now
  
  @Input() currentPageName: Page;
  @Input('allowIndividualSave')
  allowIndividualSave: boolean;
  @Input('mode')
  mode: string;
  
  constructor(private fb: FormBuilder, public localstorageservice: LocalStorageService,
    public loanserviceworker: LoancalculationWorker,
    public logging: LoggingService,
    public loanapi: LoanApiService,
    private publishService : PublishService,
    public dialog: MatDialog,) {
  }

  ngOnInit() {
    if (this.mode === 'create') {
      this.borrowerInfo = {};
    }
    this.localloanobj = this.localstorageservice.retrieve(environment.loankey);
    if (this.localloanobj) {
      
      this.prepateFormAndVariables();
    }

    this.localstorageservice.observe(environment.loankey).subscribe(res => {
      if (res) {

        this.localloanobj = res;
        this.prepateFormAndVariables();
      }

    });


  }

  private prepateFormAndVariables() {
    if (this.localloanobj && this.localloanobj.Borrower) {
      this.borrowerInfo = this.localloanobj.Borrower;
      this.loan_id = this.localloanobj.LoanMaster[0].Loan_ID;
    }
  }

  onAddCoBorrower(){
    const dialogRef = this.dialog.open(CoBorrowerDialogComponent, {
      width: '250px',
      data: {coBorrowerInfo:{ }}
    });

    dialogRef.afterClosed().subscribe(result => {
      debugger;
    });
  }
 
  // coBorrowerCountChange = (data)=>{
  //   if(this.localloanobj && this.localloanobj.LoanMaster[0]){
  //     this.localloanobj.LoanMaster[0].Co_Borrower_Count = data.count;
  //     this.loanserviceworker.performcalculationonloanobject(this.localloanobj,false);
  //     this.publishService.enableSync(this.currentPageName);
  //   }
  // }

  onFormValueChange(data){
    if(this.localloanobj.LoanMaster[0]){
      this.localloanobj.LoanMaster[0] = Object.assign(this.localloanobj.LoanMaster[0] , data.value);
      this.loanserviceworker.performcalculationonloanobject(this.localloanobj,false);
      this.publishService.enableSync(this.currentPageName);
    }
  }

  getNewBorrowerInstance(){
    let borrower = new borrower_model();
    borrower.Borrower_Entity_Type_Code = BorrowerEntityType.Individual;
  }
}

@Component({
  templateUrl: 'coborrower-info.dialog.component.html',
})
export class CoBorrowerDialogComponent {

  coBorrowerInfo : borrower_model;
  constructor(
    public dialogRef: MatDialogRef<CoBorrowerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { coBorrowerInfo}) {
      if(data.coBorrowerInfo){
        this.coBorrowerInfo = data.coBorrowerInfo;
      }
    }

  onNoClick(): void {
    this.dialogRef.close();
  }


}

