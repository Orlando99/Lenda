import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { LocalStorageService } from 'ngx-webstorage';
import { LoancalculationWorker } from '../../../Workers/calculations/loancalculationworker';
import { ToastsManager } from 'ng2-toastr';
import { LoggingService } from '../../../services/Logs/logging.service';
import { environment } from '../../../../environments/environment';
import { loan_model } from '../../../models/loanmodel';

@Component({
  selector: 'app-farmer-info',
  templateUrl: './farmer-info.component.html',
  styleUrls: ['./farmer-info.component.scss']
})
export class FarmerInfoComponent implements OnInit {

  farmerInfoForm: FormGroup;
  localloanobj: loan_model;
  testControl: FormControl = new FormControl();
  stateList : Array<any>;


  constructor(private fb: FormBuilder, public localstorageservice: LocalStorageService,
    public loanserviceworker: LoancalculationWorker,
    public logging: LoggingService) {

    this.localloanobj = this.localstorageservice.retrieve(environment.loankey);
    if (this.localloanobj) {
      this.createForm(this.localloanobj.LoanMaster[0]);
    }

    this.stateList = this.localstorageservice.retrieve(environment.referencedatakey).StateList;
  }

  createForm(formData) {
    this.farmerInfoForm = this.fb.group({
      Farmer_First_Name: [formData.Farmer_First_Name || '', Validators.required],
      Farmer_MI: [formData.Farmer_MI || '', Validators.required],
      Farmer_Last_Name: [formData.Farmer_Last_Name || '', Validators.required],
      Farmer_SSN_Hash: [formData.Farmer_SSN_Hash || '', Validators.required],
      Farmer__Address: [formData.Farmer__Address || '', Validators.required],
      Farmer_City: [formData.Farmer_City || '', Validators.required],
      Farmer_State: [formData.Farmer_State || '', Validators.required],
      Farmer_Zip: [formData.Farmer_Zip || '', Validators.required],
      Farmer_Phone: [formData.Farmer_Phone || '', Validators.required],
      Farmer_Email: [formData.Farmer_Email || '', [Validators.required, Validators.email]],
      Farmer_DOB: [formData.Farmer_DOB ? this.formatDate(formData.Farmer_DOB) : '', [Validators.required,Validators.pattern]],
      Year_Begin_Farming: [formData.Year_Begin_Farming || '', Validators.required],
      Year_Begin_Client: [formData.Year_Begin_Client || '', Validators.required],
      
    })

    this.farmerInfoForm.valueChanges.forEach(
      (value: any) => {
        this.localloanobj.LoanMaster[0] = Object.assign(this.localloanobj.LoanMaster[0], value);
        this.loanserviceworker.performcalculationonloanobject(this.localloanobj);
      }
    );
  }

  formatDate(strDate) {
    if (strDate) {
      var date = new Date(strDate);
      return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
    } else {
      return '';
    }
  }
  ngOnInit() {
  }

}
