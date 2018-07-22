import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { LocalStorageService } from 'ngx-webstorage';
import { LoancalculationWorker } from '../../../Workers/calculations/loancalculationworker';
import { ToastsManager } from 'ng2-toastr';
import { LoggingService } from '../../../services/Logs/logging.service';
import { environment } from '../../../../environments/environment.prod';
import { loan_model, loan_borrower, Loan_Association } from '../../../models/loanmodel';
import { LoanApiService } from '../../../services/loan/loanapi.service';
import { getNumericCellEditor } from '../../../Workers/utility/aggrid/numericboxes';
import { SelectEditor } from '../../../aggridfilters/selectbox';
import { DeleteButtonRenderer } from '../../../aggridcolumns/deletebuttoncolumn';
@Component({
  selector: 'app-borrower-info',
  templateUrl: './borrower-info.component.html',
  styleUrls: ['./borrower-info.component.scss']
})
export class BorrowerInfoComponent implements OnInit {

  borrowerInfoForm: FormGroup;
  localloanobj: loan_model;
  stateList: Array<any>;
  entityType = [
    {key : 'IND', value : 'Individual'},
    {key : 'INDWS', value : 'Individual w/ Spouse'},
    {key : 'PRP', value : 'Partner'},
    {key : 'JNT', value : 'Joint'},
    {key : 'COP', value : 'Corporation'},
    {key : 'LLC', value : 'LLC'},
  ];
  loan_id: number;
  isSubmitted: boolean; // to enable or disable the sync button as there is not support to un-dirty the form after submit
  public columnDefs = [];
  public components;
  public refdata;
  public frameworkcomponents;
  public context;
  public rowData : Array<Loan_Association> = [];
  public gridApi;
  public columnApi;

  @Input('allowIndividualSave')
  allowIndividualSave: boolean;
  @Input('mode')
  mode: string;
  @Output('onFormValueChange')
  onFormValueChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() set borrowerInfo(borrowerInfo) {
    if(borrowerInfo){
      let borrower = new loan_borrower();
      borrower.Borrower_First_Name = borrowerInfo.value.Farmer_First_Name ? borrowerInfo.value.Farmer_First_Name.slice() : "";
      borrower.Borrower_Last_Name = borrowerInfo.value.Farmer_Last_Name ? borrowerInfo.value.Farmer_Last_Name.slice() : "";
      borrower.Borrower_Address = borrowerInfo.value.Farmer__Address ? borrowerInfo.value.Farmer__Address.slice() : "";
      borrower.Borrower_City = borrowerInfo.value.Farmer_City ? borrowerInfo.value.Farmer_City.slice() : "";
      borrower.Borrower_DOB = borrowerInfo.value.Farmer_DOB ? borrowerInfo.value.Farmer_DOB.slice() : "";
      borrower.Borrower_Phone = borrowerInfo.value.Farmer_Phone ? borrowerInfo.value.Farmer_Phone.slice() : "";
      borrower.Borrower_Zip = borrowerInfo.value.Farmer_Zip ? borrowerInfo.value.Farmer_Zip.slice() : "";
      borrower.Borrower_email = borrowerInfo.value.Farmer_Email ? borrowerInfo.value.Farmer_Email.slice() : "";
      borrower.Borrower_MI = borrowerInfo.value.Farmer_MI ? borrowerInfo.value.Farmer_MI.slice() : "";
      borrower.Borrower_SSN_Hash = borrowerInfo.value.Farmer_SSN_Hash ? borrowerInfo.value.Farmer_SSN_Hash.slice() : "";
      borrower.Borrower_State_ID = borrowerInfo.value.Farmer_State ? borrowerInfo.value.Farmer_State.slice() : "";
      this.createForm(borrower);
    }
  }

  constructor(private fb: FormBuilder, public localstorageservice: LocalStorageService,
    public loanserviceworker: LoancalculationWorker,
    public logging: LoggingService,
    private loanApiService: LoanApiService,
    private toaster: ToastsManager) {

      
      this.components = { numericCellEditor: getNumericCellEditor()};
      this.refdata = this.localstorageservice.retrieve(environment.referencedatakey);
      this.frameworkcomponents = {selectEditor: SelectEditor, deletecolumn: DeleteButtonRenderer };

      this.columnDefs = [
        { headerName: 'Name', field: 'Assoc_Name',  cellClass: 'editable-color', editable: true,width : 150},
        { headerName: 'Contact', field: 'Contact',  cellClass: 'editable-color', editable: true,width : 150},
        { headerName: 'Location', field: 'Location',  cellClass: 'editable-color', editable: true,width : 150},
        { headerName: 'Phone', field: 'Phone',  cellClass: 'editable-color', editable: true,width : 150},
        { headerName: 'Email', field: 'Email',  cellClass: 'editable-color', editable: true,width : 150},
        { headerName: 'Co Borrower', field: 'Co Borrower',  cellClass: 'editable-color', editable: true,width : 100,
        cellRenderer: params => {
            return `<input type='checkbox' ${params.value ? 'checked' : ''} />`;
        }},
        { headerName: '', field: '', cellRenderer: "deletecolumn" },

        
      ];

      this.context = { componentParent: this };

  }

  ngOnInit() {

    if (this.mode === 'create') {
      this.createForm({});
    } else {
      this.localloanobj = this.localstorageservice.retrieve(environment.loankey);
      if (this.localloanobj && this.localloanobj.LoanMaster && this.localloanobj.LoanMaster[0]) {
        this.createForm(this.localloanobj.LoanMaster[0]);
        this.loan_id = this.localloanobj.LoanMaster[0].Loan_ID;
      }
    }
    this.stateList = this.localstorageservice.retrieve(environment.referencedatakey).StateList;
  }


  createForm(formData) {
    console.log(formData)
    this.borrowerInfoForm = this.fb.group({
      Borrower_First_Name: [formData.Borrower_First_Name || '', Validators.required],
      Borrower_MI: [formData.Borrower_MI || ''],
      Borrower_Last_Name: [formData.Borrower_Last_Name || '', Validators.required],
      Borrower_SSN_Hash: [formData.Borrower_SSN_Hash || '', Validators.required],
      Borrower_Entity_Type_Code: [formData.Borrower_Entity_Type_Code || '', Validators.required],
      Borrower_Address: [formData.Borrower_Address || '', Validators.required],
      Borrower_City: [formData.Borrower_City || '', Validators.required],
      Borrower_State_ID: [formData.Borrower_State_ID || '', Validators.required],
      Borrower_Zip: [formData.Borrower_Zip || '', Validators.required],
      Borrower_Phone: [formData.Borrower_Phone || '', Validators.required],
      Borrower_email: [formData.Borrower_email || '', [Validators.required, Validators.email]],
      Borrower_DOB: [formData.Borrower_DOB ? this.formatDate(formData.Borrower_DOB) : '', Validators.required],
      Spouse_First_Name: [formData.Spouse_First_Name || '', Validators.required],
      Spouse__MI: [formData.Spouse__MI || '', Validators.required],
      Spouse_Last_name: [formData.Spouse_Last_name || '', Validators.required],
      Spouse_Phone: [formData.Spouse_Phone || ''],
      Spouse_Email: [formData.Spouse_Email || ''],

    })

    this.borrowerInfoForm.valueChanges.forEach(
      (value: any) => {
        this.isSubmitted = false;
        if (this.mode === 'create') {
          this.onFormValueChange.emit({ value: value, valid: this.borrowerInfoForm.valid, successCallback: this.savedByparentSuccessssCallback });
        } else {
          this.localloanobj.LoanMaster[0] = Object.assign(this.localloanobj.LoanMaster[0], value);
          this.loanserviceworker.performcalculationonloanobject(this.localloanobj);
        }
      }
    );
  }


  savedByparentSuccessssCallback = () => {
    this.createForm({});
  }

  formatDate(strDate) {
    if (strDate) {
      var date = new Date(strDate);
      return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
    } else {
      return '';
    }
  }

  synctoDb() {
    if (this.borrowerInfoForm.valid) {
      this.loanApiService.syncloanborrower(this.loan_id, this.borrowerInfoForm.value as loan_borrower).subscribe((successResponse) => {
        this.toaster.success("Borrower details saved successfully");
        this.isSubmitted = true;
      }, (errorResponse) => {
        this.toaster.error("Error Occurered while saving borrower details");

      });
    } else {
      this.toaster.error("Borrower details form doesn't seem to have data in correct format, please correct them before saving.");
    }
  }

  addrow(){
    let newAssocialtion = new Loan_Association();
    this.rowData.push(newAssocialtion);
  }

  rowvaluechanged(value : Loan_Association){
    if(value.Assoc_ID == undefined){
      value.Assoc_ID = 0;
      value.ActionStatus = 1;
    }else{
      value.ActionStatus =2;
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    
  }

  onGridSizeChanged(Event: any) {
     this.gridApi.sizeColumnsToFit();
  }


  // DeleteClicked(rowIndex: any) {
  //   let association = this.rowData[rowIndex];
  //   if(!association.Assoc_ID){
  //     this.rowData.splice(rowIndex,1);
  //   }else{
  //     this.rowData.
  //   }
  // }

}
