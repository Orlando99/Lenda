import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { LocalStorageService } from 'ngx-webstorage';
import { LoancalculationWorker } from '../../../Workers/calculations/loancalculationworker';
import { ToastsManager } from 'ng2-toastr';
import { LoggingService } from '../../../services/Logs/logging.service';
import { environment } from '../../../../environments/environment.prod';
import { loan_model, loan_farmer } from '../../../models/loanmodel';
import { LoanApiService } from '../../../services/loan/loanapi.service';
import { Page, PublishService } from '../../../services/publish.service';

@Component({
  selector: 'app-farmer-info',
  templateUrl: './farmer-info.component.html',
  styleUrls: ['./farmer-info.component.scss']
})
export class FarmerInfoComponent implements OnInit {

  farmerInfoForm: FormGroup;
  localloanobj: loan_model;
  testControl: FormControl = new FormControl();
  stateList: Array<any>;
  loan_id: number;
  isSubmitted: boolean; // to enable or disable the sync button as there is not support to un-dirty the form after submit
  @Input('allowIndividualSave')
  allowIndividualSave: boolean;

  @Input('mode')
  mode: string;

  @Output('onFormValueChange')
  onFormValueChange: EventEmitter<any> = new EventEmitter<any>();

  constructor(private fb: FormBuilder, public localstorageservice: LocalStorageService,
    public loanserviceworker: LoancalculationWorker,
    public logging: LoggingService,
    private loanApiService: LoanApiService,
    private toaster: ToastsManager,
  private publishService : PublishService) {

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
    this.farmerInfoForm = this.fb.group({
      Farmer_First_Name: [formData.Farmer_First_Name || '', Validators.required],
      Farmer_MI: [formData.Farmer_MI || ''],
      Farmer_Last_Name: [formData.Farmer_Last_Name || '', Validators.required],
      Farmer_SSN_Hash: [formData.Farmer_SSN_Hash || '', Validators.required],
      Farmer__Address: [formData.Farmer__Address || '', Validators.required],
      Farmer_City: [formData.Farmer_City || '', Validators.required],
      Farmer_State: [formData.Farmer_State || '', Validators.required],
      Farmer_Zip: [formData.Farmer_Zip || '', Validators.required],
      Farmer_Phone: [formData.Farmer_Phone || '', Validators.required],
      Farmer_Email: [formData.Farmer_Email || '', [Validators.required, Validators.email]],
      Farmer_DOB: [formData.Farmer_DOB ? this.formatDate(formData.Farmer_DOB) : '', [Validators.required, Validators.pattern]],
      Year_Begin_Farming: [formData.Year_Begin_Farming || '', Validators.required],
      Year_Begin_Client: [formData.Year_Begin_Client || '', Validators.required],

    })

    this.farmerInfoForm.valueChanges.forEach(
      (value: any) => {
        this.isSubmitted = false;
        if (this.mode === 'create') {
          this.onFormValueChange.emit({ value: value, valid: this.farmerInfoForm.valid, successCallback: this.savedByparentSuccessssCallback });
        } else {
          this.localloanobj.LoanMaster[0] = Object.assign(this.localloanobj.LoanMaster[0], value);
          this.loanserviceworker.performcalculationonloanobject(this.localloanobj);
        }
        this.publishService.enableSync(Page.borrower);
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
    if (this.farmerInfoForm.valid) {
      this.loanApiService.syncloanfarmer(this.loan_id, this.farmerInfoForm.value as loan_farmer).subscribe((successResponse) => {
        this.toaster.success("Farmer details saved successfully");
        this.isSubmitted = true;
      }, (errorResponse) => {
        this.toaster.error("Error Occurered while saving Farmer details");

      });
    } else {
      this.toaster.error("Farmer details form doesn't seem to have data in correct format, please correct them before saving.");
    }
  }

}
