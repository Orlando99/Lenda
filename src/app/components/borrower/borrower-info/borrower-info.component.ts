import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { LocalStorageService } from 'ngx-webstorage';
import { LoancalculationWorker } from '../../../Workers/calculations/loancalculationworker';
import { ToastsManager } from 'ng2-toastr';
import { LoggingService } from '../../../services/Logs/logging.service';
import { environment } from '../../../../environments/environment.prod';
import { loan_model, loan_borrower, Loan_Association, AssocitionTypeCode } from '../../../models/loanmodel';
import { LoanApiService } from '../../../services/loan/loanapi.service';
import { getNumericCellEditor } from '../../../Workers/utility/aggrid/numericboxes';
import { SelectEditor } from '../../../aggridfilters/selectbox';
import { DeleteButtonRenderer } from '../../../aggridcolumns/deletebuttoncolumn';
import { AlertifyService } from '../../../alertify/alertify.service';
import { JsonConvert } from 'json2typescript';
import { Page, PublishService } from '../../../services/publish.service';
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
    { key: 'IND', value: 'Individual' },
    { key: 'INDWS', value: 'Individual w/ Spouse' },
    { key: AssocitionTypeCode.Partner, value: 'Partner' },
    { key: AssocitionTypeCode.Joint, value: 'Joint' },
    { key: AssocitionTypeCode.Corporation, value: 'Corporation' },
    { key: AssocitionTypeCode.LLC, value: 'LLC' },
  ];
  idTypes = [{key : IDType.SSN, value : 'SSN'}, {key : IDType.Tax_ID, value : 'Tax ID'}];
  individualEntities = ['IND','INDWS',AssocitionTypeCode.Partner];
  orgnaizationEntities = [AssocitionTypeCode.Joint,AssocitionTypeCode.Corporation,AssocitionTypeCode.LLC];
  selectedEntityGroups : EntityGroup = EntityGroup.Individual;
  EntityGroup : typeof EntityGroup = EntityGroup;

  associationTypeCodes = [AssocitionTypeCode.Partner,AssocitionTypeCode.Joint,AssocitionTypeCode.Corporation,AssocitionTypeCode.LLC];
  selectedAssociaionTypeCode : string = '';
  loan_id: number;
  isSubmitted: boolean; // to enable or disable the sync button as there is not support to un-dirty the form after submit
  public columnDefs = [];
  public components;
  public refdata;
  public frameworkcomponents;
  public context;
  public rowData = [];
  public gridApi;
  public columnApi;

  //in this case local storage Associaltion list have other rows as well, so simply lading picking the record from rowIndex won't work
  private latestUpdatedObject;

  @Input() currentPageName: Page;
  @Input('allowIndividualSave')
  allowIndividualSave: boolean;
  @Input('mode')
  mode: string;
  @Output('onFormValueChange')
  onFormValueChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() set borrowerInfo(borrowerInfo) {
    if (borrowerInfo) {
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
      borrower.Borrower_ID_Type = borrowerInfo.value.Borrower_ID_Type ? borrowerInfo.value.Borrower_ID_Type : '' ,
      borrower.Borrower_SSN_Hash = borrowerInfo.value.Farmer_SSN_Hash ? borrowerInfo.value.Farmer_SSN_Hash.slice() : "";
      borrower.Borrower_State_ID = borrowerInfo.value.Farmer_State ? borrowerInfo.value.Farmer_State.slice() : "";
      borrower.Borrower_DL_state = borrowerInfo.value.Borrower_DL_state ? borrowerInfo.value.Borrower_DL_state.slice() : "";
      borrower.Borrower_Dl_Num = borrowerInfo.value.Borrower_Dl_Num ? borrowerInfo.value.Borrower_Dl_Num.slice() : "";
      this.createForm(borrower);
    }
  }

  constructor(private fb: FormBuilder, public localstorageservice: LocalStorageService,
    public loanserviceworker: LoancalculationWorker,
    public logging: LoggingService,
    private loanApiService: LoanApiService,
    private toaster: ToastsManager,
    private alertify: AlertifyService, public loanapi: LoanApiService,
    private publishService : PublishService) {


  }

  ngOnInit() {


    if (this.mode === 'create') {
      this.createForm({});
    }
    this.localloanobj = this.localstorageservice.retrieve(environment.loankey);
    if (this.localloanobj) {
      
      this.prepateFormAndVariables();
      this.stateList = this.localstorageservice.retrieve(environment.referencedatakey).StateList;
     
    }

    this.localstorageservice.observe(environment.loankey).subscribe(res => {
      if (res) {

        this.localloanobj = res;
        this.prepateFormAndVariables();
      }

    });


  }

  private prepateFormAndVariables() {
    if (this.localloanobj && this.localloanobj.LoanMaster && this.localloanobj.LoanMaster[0]) {
      this.createForm(this.localloanobj.LoanMaster[0]);
      this.loan_id = this.localloanobj.LoanMaster[0].Loan_ID;
    }
  }

  getPlaceholder(){
    let selectedIdType = this.idTypes.find(i=>i.key === this.borrowerInfoForm.controls['Borrower_ID_Type'].value)
    if(selectedIdType){
      return selectedIdType.value || selectedIdType.key;
    }else{
      throw "Invalid Entity Group";
      
    }
  }
  getTypeNameOfCB(cbTypeID){
    let entity = this.entityType.find(et=>et.key == cbTypeID);
    return entity ? entity.value : '';
  }
  createForm(formData) {
    console.log(formData)
    this.borrowerInfoForm = this.fb.group({
      Borrower_First_Name: [formData.Borrower_First_Name || '', Validators.required],
      Borrower_MI: [formData.Borrower_MI || ''],
      Borrower_Last_Name: [formData.Borrower_Last_Name || '', Validators.required],
      Borrower_ID_Type : [formData.Borrower_ID_Type || '', Validators.required],
      Borrower_SSN_Hash: [formData.Borrower_SSN_Hash || '', Validators.required],
      Co_Borrower_ID: [formData.Co_Borrower_ID || '', Validators.required],
      Borrower_DL_state : [formData.Borrower_DL_state || '',Validators.required],
      Borrower_Dl_Num : [formData.Borrower_Dl_Num || '',Validators.required],
      Borrower_Address: [formData.Borrower_Address || '', Validators.required],
      Borrower_City: [formData.Borrower_City || '', Validators.required],
      Borrower_State_ID: [formData.Borrower_State_ID || '', Validators.required],
      Borrower_Zip: [formData.Borrower_Zip || '', Validators.required],
      Borrower_Phone: [formData.Borrower_Phone || '', Validators.required],
      Borrower_email: [formData.Borrower_email || '', [Validators.required, Validators.email]],
      Borrower_DOB: [formData.Borrower_DOB ? this.formatDate(formData.Borrower_DOB) : '', Validators.required],
      Crop_Year : [formData.Crop_Year || (this.mode === 'create' ? (new Date()).getFullYear() : ''), Validators.required],
      Spouse_First_Name: [formData.Spouse_First_Name || ''],
      Spouse__MI: [formData.Spouse__MI || ''],
      Spouse_Last_name: [formData.Spouse_Last_name || ''],
      Spouse_Phone: [formData.Spouse_Phone || ''],
      Spouse_Email: [formData.Spouse_Email || ''],

    })
    if(this.associationTypeCodes.indexOf(formData.Co_Borrower_ID)>-1){
      this.selectedAssociaionTypeCode =  formData.Co_Borrower_ID;
    }
    if(this.individualEntities.includes(formData.Co_Borrower_ID)){
      this.selectedEntityGroups = EntityGroup.Individual;
    }else if(this.orgnaizationEntities.includes(formData.Co_Borrower_ID)){
      this.selectedEntityGroups = EntityGroup.Organization;
    }else{
      throw "Invalid Co_Borrower_ID";
      
    }

    this.borrowerInfoForm.valueChanges.forEach(
      (value: any) => {
        this.isSubmitted = false;
        if (this.mode === 'create') {
          this.onFormValueChange.emit({ value: value, valid: this.borrowerInfoForm.valid, successCallback: this.savedByparentSuccessssCallback });
        } else {
          this.localloanobj.LoanMaster[0] = Object.assign(this.localloanobj.LoanMaster[0], value);
        }
      }
    );
  }

  updateLocalStorage(){
    this.loanserviceworker.performcalculationonloanobject(this.localloanobj);
    this.publishService.enableSync(this.currentPageName);
  }
  coBorrowerCountChange = (data)=>{
    if(this.localloanobj && this.localloanobj.LoanMaster[0]){
      this.localloanobj.LoanMaster[0].Co_Borrower_Count = data.count;
      this.loanserviceworker.performcalculationonloanobject(this.localloanobj,false);
      this.publishService.enableSync(this.currentPageName);
    }
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

  onEntityTypeChange(data) {
    

    // let entities = this.associationTypeCodes.slice(0); //clone
    // let valueIndex = entities.indexOf(data.value);
    // if(valueIndex >-1){
    //   entities.splice(valueIndex,1);
    //   let existingAssociations = this.localloanobj.Association.filter(as=> entities.indexOf(as.Assoc_Type_Code) > -1 );
    //   existingAssociations.forEach(assoc => {
    //     assoc.Assoc_Type_Code = data.value;
    //     assoc.ActionStatus = assoc.ActionStatus || 2;
    //   });
    //   this.loanserviceworker.performcalculationonloanobject(this.localloanobj,false);
    //   this.publishService.enableSync(this.currentPageName);
    //   this.selectedAssociaionTypeCode = data.value;
    // }

    if(this.individualEntities.includes(data.value)){
      this.borrowerInfoForm.controls['Borrower_ID_Type'].setValue(IDType.SSN);
      this.selectedEntityGroups = EntityGroup.Individual;
    }else if(this.orgnaizationEntities.includes(data.value)){
      this.borrowerInfoForm.controls['Borrower_ID_Type'].setValue(IDType.Tax_ID);
      this.selectedEntityGroups = EntityGroup.Organization;
    }else{
      throw "Invalid Co_Borrower_ID";
    }
    this.loanserviceworker.performcalculationonloanobject(this.localloanobj,false);
    this.publishService.enableSync(this.currentPageName);
    this.selectedAssociaionTypeCode = data.value;


  }


}

export enum IDType{
  SSN = 1,
  Tax_ID = 2
}
export enum EntityGroup{
  Individual = 'Individual',
  Organization= 'Organization'
}
