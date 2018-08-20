import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { LocalStorageService } from 'ngx-webstorage';
import { LoancalculationWorker } from '../../../Workers/calculations/loancalculationworker';
import { ToastsManager } from 'ng2-toastr';
import { LoggingService } from '../../../services/Logs/logging.service';
import { environment } from '../../../../environments/environment.prod';
import { loan_model,  borrower_model, BorrowerEntityType } from '../../../models/loanmodel';
import { LoanApiService } from '../../../services/loan/loanapi.service';
import { getNumericCellEditor } from '../../../Workers/utility/aggrid/numericboxes';
import { SelectEditor } from '../../../aggridfilters/selectbox';
import { DeleteButtonRenderer } from '../../../aggridcolumns/deletebuttoncolumn';
import { AlertifyService } from '../../../alertify/alertify.service';
import { JsonConvert } from 'json2typescript';
import { Page, PublishService } from '../../../services/publish.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { BorrowerService } from '../borrower.service';
import { Preferred_Contact_Ind_Options } from '../../../Workers/utility/aggrid/preferredcontactboxes';
@Component({
  selector: 'app-borrower-info',
  templateUrl: './borrower-info.component.html',
  styleUrls: ['./borrower-info.component.scss'],
  providers : [BorrowerService]
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
  coborrowers : Array<borrower_model> = [];
  
  constructor(private fb: FormBuilder, public localstorageservice: LocalStorageService,
    public loanserviceworker: LoancalculationWorker,
    public logging: LoggingService,
    public loanapi: LoanApiService,
    private publishService : PublishService,
    public dialog: MatDialog,
    private borrowerService : BorrowerService,
    private alertify : AlertifyService,) {
  }

  ngOnInit() {
    if (this.mode === 'create' || !this.borrowerInfo) {
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
      this.coborrowers = this.localloanobj.CoBorrower.filter(cb=>cb.ActionStatus !=3);
      this.loan_id = this.localloanobj.LoanMaster[0].Loan_ID;
    }
  }

  onAddCoBorrower(){
    let borrower = this.getNewBorrowerInstance();
    const dialogRef = this.dialog.open(CoBorrowerDialogComponent, {
            panelClass: 'borrower-dialog',
      data: {coBorrowerInfo: borrower}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.doneEditingCoborrowerInfo(result);
      }
    });
  }

  onEditCoBorrower(coborrower, index){
    
    const dialogRef = this.dialog.open(CoBorrowerDialogComponent, {
            panelClass: 'borrower-dialog',
      data: {coBorrowerInfo: coborrower}
    });

    dialogRef.afterClosed().subscribe((result :borrower_model) => {
      if(result){
        if(result.CoBorrower_ID){
          coborrower.ActionStatus = 2;
        }else{
          coborrower.ActionStatus = 1;
        }
        this.doneEditingCoborrowerInfo(result,index);
      }
    });
  }
 
  onDeleteCoborrower(coborrower : borrower_model, index){

    this.alertify.confirm("Confirm", "Do you Really Want to Delete this Record?").subscribe(res => {
      if(res){
        if(coborrower.CoBorrower_ID){
          coborrower.ActionStatus = 3;
        }else{
          this.localloanobj.CoBorrower.splice(index,1);
        }
        this.loanserviceworker.performcalculationonloanobject(this.localloanobj,false);
        this.publishService.enableSync(this.currentPageName);
      }
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
    if(this.localloanobj.LoanMaster[0] && this.localloanobj.Borrower){
      this.localloanobj.Borrower = Object.assign(this.localloanobj.Borrower , data.value);
      this.localloanobj.Borrower.ActionStatus =2;
      this.localloanobj.LoanMaster[0] = Object.assign(this.localloanobj.LoanMaster[0] , data.value);
      this.loanserviceworker.performcalculationonloanobject(this.localloanobj,false);
      this.publishService.enableSync(this.currentPageName);
    }
  }

  getNewBorrowerInstance(){
    let borrower = new borrower_model();
    borrower.ActionStatus = 1;
    borrower.Borrower_Entity_Type_Code = BorrowerEntityType.Individual;
    borrower.Loan_Full_ID = this.localloanobj.Loan_Full_ID;
    return borrower;
  }

  doneEditingCoborrowerInfo(coborrower : borrower_model, index : number = undefined){

    if(coborrower.CoBorrower_ID){
      coborrower.ActionStatus = 2;
    }else if(coborrower.ActionStatus!=3){
      coborrower.ActionStatus =1;
    }
    if(index == 0 || index){
      this.localloanobj.CoBorrower.splice(index,1,coborrower);
    }else{
      if(!this.localloanobj.CoBorrower){
        this.localloanobj.CoBorrower = [];
      }
      this.localloanobj.CoBorrower.push(coborrower);
    }
    this.loanserviceworker.performcalculationonloanobject(this.localloanobj,false);
    this.publishService.enableSync(this.currentPageName);
  }

  getBorrowerTypeName(code){
    return this.borrowerService.getTypeNameOfCB(code);
  }
  getPreferredContactValue(preferenceKey){
    let selectedPref = Preferred_Contact_Ind_Options.find(p=>p.key == preferenceKey);
    return selectedPref ? selectedPref.value : 'NA'
  }
}

@Component({
  templateUrl: 'coborrower-info.dialog.component.html',
})
export class CoBorrowerDialogComponent {

  coBorrowerInfo : borrower_model;
  isFormValid : boolean;
  constructor(
    public dialogRef: MatDialogRef<CoBorrowerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      if(data.coBorrowerInfo){
        this.coBorrowerInfo = data.coBorrowerInfo;
        
      }
    }

    onFormValueChange(data ){
      if(data){
        this.coBorrowerInfo = data.value;
        this.isFormValid = data.isValid;
      }
    }

  onNoClick(): void {
    this.dialogRef.close();
  }


}

