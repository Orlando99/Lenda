import { Component, OnInit, Output, Input, EventEmitter, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BorrowerEntityType, borrower_model } from '../../../../models/loanmodel';
import { LocalStorageService } from 'ngx-webstorage';
import { environment } from '../../../../../environments/environment.prod';
import { BorrowerService } from '../../borrower.service';
import { Preferred_Contact_Ind_Options } from '../../../../Workers/utility/aggrid/preferredcontactboxes';

@Component({
  selector: 'app-borrower-info-form',
  templateUrl: './borrower-info-form.component.html',
  styleUrls: ['./borrower-info-form.component.scss'],
  providers : [BorrowerService]
})
export class BorrowerInfoFormComponent implements OnInit,OnChanges {

  borrowerInfoForm: FormGroup;
  stateList: Array<any>;

  entityType = [];
  idTypes = [{key : IDType.SSN, value : 'SSN'}, {key : IDType.Tax_ID, value : 'Tax ID'}];
  individualEntities = [BorrowerEntityType.Individual, BorrowerEntityType.IndividualWithSpouse];
  orgnaizationEntities = [BorrowerEntityType.Partner, BorrowerEntityType.Joint,BorrowerEntityType.Corporation,BorrowerEntityType.LLC];
  EntityGroup : typeof EntityGroup = EntityGroup;
  BorrowerEntityType : typeof BorrowerEntityType = BorrowerEntityType;

  associationTypeCodes = [BorrowerEntityType.Partner,BorrowerEntityType.Joint,BorrowerEntityType.Corporation,BorrowerEntityType.LLC];

  Preferred_Contact_Ind_Options = Preferred_Contact_Ind_Options;
  @Output('onFormValueChange')
  onFormValueChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() borrowerInfo : borrower_model;

  constructor(private fb: FormBuilder,
  private localStorageService : LocalStorageService,
  private borrowerService : BorrowerService) {


  }

  ngOnInit() {
    this.stateList = this.localStorageService.retrieve(environment.referencedatakey).StateList;
    this.entityType = this.borrowerService.entityType;

    
  }
  ngOnChanges(){
    if (this.borrowerInfo) {

      this.borrowerInfo.Borrower_Entity_Type_Code = this.borrowerInfo.Borrower_Entity_Type_Code || BorrowerEntityType.Individual;
      this.borrowerInfo.Borrower_ID_Type = this.borrowerInfo.Borrower_ID_Type || IDType.SSN;
      this.createForm(this.borrowerInfo);
      
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

  createForm(formData) {
    this.borrowerInfoForm = this.fb.group({
      Borrower_First_Name: [formData.Borrower_First_Name || '', Validators.required],
      Borrower_MI: [formData.Borrower_MI || ''],
      Borrower_Last_Name: [formData.Borrower_Last_Name || ''],
      Borrower_ID_Type : [{value :formData.Borrower_ID_Type || '',disabled : true}, Validators.required],
      Borrower_SSN_Hash: [formData.Borrower_SSN_Hash || '', Validators.required],
      Borrower_Entity_Type_Code: [formData.Borrower_Entity_Type_Code || '', Validators.required],
      Borrower_DL_state : [formData.Borrower_DL_state || ''],
      Borrower_Dl_Num : [formData.Borrower_Dl_Num || ''],
      Borrower_Address: [formData.Borrower_Address || '', Validators.required],
      Borrower_City: [formData.Borrower_City || '', Validators.required],
      Borrower_State_ID: [formData.Borrower_State_ID || '', Validators.required],
      Borrower_Zip: [formData.Borrower_Zip || '', Validators.required],
      Borrower_Phone: [formData.Borrower_Phone || '', Validators.required],
      Borrower_email: [formData.Borrower_email || '', [Validators.required, Validators.email]],
      Borrower_DOB: [formData.Borrower_DOB ? this.formatDate(formData.Borrower_DOB) : '', Validators.required],
      Borrower_Preferred_Contact_Ind: [formData.Borrower_Preferred_Contact_Ind? (formData.Borrower_Preferred_Contact_Ind as number).toString() : '', Validators.required],
      Spouse_First_Name: [formData.Spouse_First_Name || ''],
      Spouse__MI: [formData.Spouse__MI || ''],
      Spouse_Last_name: [formData.Spouse_Last_name || ''],
      Spouse_Phone: [formData.Spouse_Phone || ''],
      Spouse_Email: [formData.Spouse_Email || ''],
      Spouse_Preffered_Contact_Ind: [formData.Spouse_Preffered_Contact_Ind ? (formData.Spouse_Preffered_Contact_Ind as number).toString() : ''],

    })
  }
  getEntityGroup(entityTypeCode : BorrowerEntityType){
    if(this.orgnaizationEntities.includes(entityTypeCode)){
      return EntityGroup.Organization;
    }else{
      return EntityGroup.Individual;
      
    }
  }
  onValueChange(){
    if(this.borrowerInfoForm.getRawValue()){
      this.borrowerInfo = Object.assign(this.borrowerInfo, this.borrowerInfoForm.getRawValue());
      this.onFormValueChange.emit({value : this.borrowerInfo, isValid : this.borrowerInfoForm.valid});
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
      this.onValueChange();
    }else if(this.orgnaizationEntities.includes(data.value)){
      this.borrowerInfoForm.controls['Borrower_ID_Type'].setValue(IDType.Tax_ID);
      this.onValueChange();
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
