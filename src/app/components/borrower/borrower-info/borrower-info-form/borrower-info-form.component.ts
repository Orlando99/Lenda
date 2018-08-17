import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BorrowerEntityType, loan_borrower } from '../../../../models/loanmodel';
import { LocalStorageService } from 'ngx-webstorage';
import { environment } from '../../../../../environments/environment.prod';

@Component({
  selector: 'app-borrower-info-form',
  templateUrl: './borrower-info-form.component.html',
  styleUrls: ['./borrower-info-form.component.scss']
})
export class BorrowerInfoFormComponent implements OnInit {

  borrowerInfoForm: FormGroup;
  stateList: Array<any>;
  entityType = [
    { key: BorrowerEntityType.Individual, value: 'Individual' },
    { key: BorrowerEntityType.IndividualWithSpouse, value: 'Individual w/ Spouse' },
    { key: BorrowerEntityType.Partner, value: 'Partner' },
    { key: BorrowerEntityType.Joint, value: 'Joint' },
    { key: BorrowerEntityType.Corporation, value: 'Corporation' },
    { key: BorrowerEntityType.LLC, value: 'LLC' },
  ];
  idTypes = [{key : IDType.SSN, value : 'SSN'}, {key : IDType.Tax_ID, value : 'Tax ID'}];
  individualEntities = [BorrowerEntityType.Individual, BorrowerEntityType.IndividualWithSpouse,BorrowerEntityType.Partner];
  orgnaizationEntities = [BorrowerEntityType.Joint,BorrowerEntityType.Corporation,BorrowerEntityType.LLC];
  selectedEntityGroups : EntityGroup = EntityGroup.Individual;
  EntityGroup : typeof EntityGroup = EntityGroup;
  BorrowerEntityType : typeof BorrowerEntityType = BorrowerEntityType;

  associationTypeCodes = [BorrowerEntityType.Partner,BorrowerEntityType.Joint,BorrowerEntityType.Corporation,BorrowerEntityType.LLC];
  @Output('onFormValueChange')
  onFormValueChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() set borrowerInfo(borrowerInfo) {
    if (borrowerInfo) {
      // let borrower = new loan_borrower();
      // borrower.Borrower_First_Name = borrowerInfo.value.Farmer_First_Name ? borrowerInfo.value.Farmer_First_Name.slice() : "";
      // borrower.Borrower_Last_Name = borrowerInfo.value.Farmer_Last_Name ? borrowerInfo.value.Farmer_Last_Name.slice() : "";
      // borrower.Borrower_Address = borrowerInfo.value.Farmer__Address ? borrowerInfo.value.Farmer__Address.slice() : "";
      // borrower.Borrower_City = borrowerInfo.value.Farmer_City ? borrowerInfo.value.Farmer_City.slice() : "";
      // borrower.Borrower_DOB = borrowerInfo.value.Farmer_DOB ? borrowerInfo.value.Farmer_DOB.slice() : "";
      // borrower.Borrower_Phone = borrowerInfo.value.Farmer_Phone ? borrowerInfo.value.Farmer_Phone.slice() : "";
      // borrower.Borrower_Zip = borrowerInfo.value.Farmer_Zip ? borrowerInfo.value.Farmer_Zip.slice() : "";
      // borrower.Borrower_email = borrowerInfo.value.Farmer_Email ? borrowerInfo.value.Farmer_Email.slice() : "";
      // borrower.Borrower_MI = borrowerInfo.value.Farmer_MI ? borrowerInfo.value.Farmer_MI.slice() : "";
      // borrower.Borrower_ID_Type = borrowerInfo.value.Borrower_ID_Type ? borrowerInfo.value.Borrower_ID_Type : '' ,
      // borrower.Borrower_SSN_Hash = borrowerInfo.value.Farmer_SSN_Hash ? borrowerInfo.value.Farmer_SSN_Hash.slice() : "";
      // borrower.Borrower_State_ID = borrowerInfo.value.Farmer_State ? borrowerInfo.value.Farmer_State.slice() : "";
      // borrower.Borrower_DL_state = borrowerInfo.value.Borrower_DL_state ? borrowerInfo.value.Borrower_DL_state.slice() : "";
      // borrower.Borrower_Dl_Num = borrowerInfo.value.Borrower_Dl_Num ? borrowerInfo.value.Borrower_Dl_Num.slice() : "";
      this.createForm(borrowerInfo);
    }else{
      this.createForm({});
    }
  }

  constructor(private fb: FormBuilder,
  private localStorageService : LocalStorageService) {


  }

  ngOnInit() {
    this.stateList = this.localStorageService.retrieve(environment.referencedatakey).StateList;
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
    this.borrowerInfoForm = this.fb.group({
      Borrower_First_Name: [formData.Borrower_First_Name || '', Validators.required],
      Borrower_MI: [formData.Borrower_MI || ''],
      Borrower_Last_Name: [formData.Borrower_Last_Name || '', Validators.required],
      Borrower_ID_Type : [{value :formData.Borrower_ID_Type || '',disabled : true}, Validators.required],
      Borrower_SSN_Hash: [formData.Borrower_SSN_Hash || '', Validators.required],
      Borrower_Entity_Type_Code: [formData.Borrower_Entity_Type_Code || '', Validators.required],
      Borrower_DL_state : [formData.Borrower_DL_state || '',Validators.required],
      Borrower_Dl_Num : [formData.Borrower_Dl_Num || '',Validators.required],
      Borrower_Address: [formData.Borrower_Address || '', Validators.required],
      Borrower_City: [formData.Borrower_City || '', Validators.required],
      Borrower_State_ID: [formData.Borrower_State_ID || '', Validators.required],
      Borrower_Zip: [formData.Borrower_Zip || '', Validators.required],
      Borrower_Phone: [formData.Borrower_Phone || '', Validators.required],
      Borrower_email: [formData.Borrower_email || '', [Validators.required, Validators.email]],
      Borrower_DOB: [formData.Borrower_DOB ? this.formatDate(formData.Borrower_DOB) : '', Validators.required],
      Crop_Year : [formData.Crop_Year || (formData=={} ? (new Date()).getFullYear() : ''), Validators.required],
      Spouse_First_Name: [formData.Spouse_First_Name || ''],
      Spouse__MI: [formData.Spouse__MI || ''],
      Spouse_Last_name: [formData.Spouse_Last_name || ''],
      Spouse_Phone: [formData.Spouse_Phone || ''],
      Spouse_Email: [formData.Spouse_Email || ''],

    })
    if(this.individualEntities.includes(formData.Borrower_Entity_Type_Code)){
      this.selectedEntityGroups = EntityGroup.Individual;
    }else if(this.orgnaizationEntities.includes(formData.Borrower_Entity_Type_Code)){
      this.selectedEntityGroups = EntityGroup.Organization;
    }else{
      throw "Invalid Borrower_Entity_Type_Code";
      
    }

  }
  onValueChange(){
    if(this.borrowerInfoForm.value){
      this.onFormValueChange.emit({value : this.borrowerInfoForm.value, isFormValid : this.borrowerInfoForm.valid});
    }
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
    
    if(this.individualEntities.includes(data.value)){
      this.borrowerInfoForm.controls['Borrower_ID_Type'].setValue(IDType.SSN);
      this.selectedEntityGroups = EntityGroup.Individual;
    }else if(this.orgnaizationEntities.includes(data.value)){
      this.borrowerInfoForm.controls['Borrower_ID_Type'].setValue(IDType.Tax_ID);
      this.selectedEntityGroups = EntityGroup.Organization;
    }else{
      throw "Invalid Borrower_Entity_Type_Code";
    }
    
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
