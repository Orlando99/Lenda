import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocalStorageService } from 'ngx-webstorage';
import { LoancalculationWorker } from '../../Workers/calculations/loancalculationworker';
import { LoanApiService } from '../../services/loan/loanapi.service';
import { environment } from '../../../environments/environment.prod';
import { loan_model } from '../../models/loanmodel';
import { ToastsManager } from 'ng2-toastr';
import { JsonConvert } from 'json2typescript';
import { Page, PublishService } from '../../services/publish.service';
import { CommitteeService } from './committee.service';

@Component({
  selector: 'app-committee',
  templateUrl: './committee.component.html',
  styleUrls: ['./committee.component.scss'],
  providers : [CommitteeService]
})
export class CommitteeComponent implements OnInit {

  public committeeForm: FormGroup;
  localloanobj: loan_model;
  isFormUpdated: boolean = false;
  currentPageName : Page = Page.committee;
  constructor(private fb: FormBuilder, public localstorageservice: LocalStorageService,
    public loanserviceworker: LoancalculationWorker,
    private loanapi: LoanApiService,
    private toaster: ToastsManager,
    private publishService : PublishService,
    private committeeService : CommitteeService

  ) { }

  ngOnInit() {

    this.localloanobj = this.localstorageservice.retrieve(environment.loankey);
    if (this.localloanobj) {

      if (this.localloanobj && this.localloanobj.LoanMaster && this.localloanobj.LoanMaster[0]) {
        this.createForm(this.localloanobj.LoanMaster[0]);

      }

    }

    this.localstorageservice.observe(environment.loankey).subscribe(res => {

      if (res) {
        this.localloanobj = res;
        if (this.localloanobj && this.localloanobj.LoanMaster && this.localloanobj.LoanMaster[0]) {
          this.createForm(this.localloanobj.LoanMaster[0]);

        }
      }

    });

  }

  createForm(formData) {

    this.committeeForm = this.fb.group({
      Maturity_Date: [formData.Maturity_Date ? this.formatDate(formData.Maturity_Date) : '',],
      Orgination_Fee_Percent: [formData.Orgination_Fee_Percent || 0],
      Orgination_Fee_Amount: [formData.Orgination_Fee_Amount || 0],
      Service_Fee_Percent: [formData.Service_Fee_Percent || 0],
      Service_Fee_Amount: [formData.Service_Fee_Amount || 0],
      Rate_Percent: [formData.Rate_Percent || 0],
      Rate_Fee_Amount: [formData.Rate_Fee_Amount || 0],
    });
    this.onChanges();
  }

  onChanges(): void {
    this.committeeForm.valueChanges.subscribe(val => {
      this.isFormUpdated = true;
      let loanMaster = this.localloanobj.LoanMaster[0];
    if (loanMaster) {
      this.committeeForm.value.Orgination_Fee_Amount = (this.committeeForm.value.Orgination_Fee_Percent / 100) * (loanMaster.ARM_Commitment || 0);
      this.committeeForm.value.Service_Fee_Amount = (this.committeeForm.value.Service_Fee_Percent / 100) * (loanMaster.ARM_Commitment || 0);
      //LoanMaster.Dist_Commitment+(LoanMaster.Rate_Percent*(LoanMaster.Estimated_Days/365)*LoanMaster_Dist_Commitment)+( LoanMaster.Rate_Percent*(LoanMaster.Estimated_Days/365)*LoanMaster_ARM_Commitment))
      this.committeeForm.value.Rate_Fee_Amount = ((this.committeeForm.value.Rate_Percent / 100) * (225/365) * (loanMaster.Dist_Commitment || 0) ) + ((this.committeeForm.value.Rate_Percent / 100) * (225/365) * (loanMaster.ARM_Commitment || 0));
      this.committeeForm.value.Orgination_Fee_Amount = parseFloat(this.committeeForm.value.Orgination_Fee_Amount.toFixed(2));
      this.committeeForm.value.Service_Fee_Amount = parseFloat(this.committeeForm.value.Service_Fee_Amount.toFixed(2));
      this.committeeForm.value.Rate_Fee_Amount = parseFloat(this.committeeForm.value.Rate_Fee_Amount.toFixed(2));
    }
    });
  }

  formatDate(strDate) {
    if (strDate) {
      var date = new Date(strDate);
      return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
    } else {
      return '';
    }
  }


  updateLocalStorage(){
    let loanMaster = this.localloanobj.LoanMaster[0];
    loanMaster.Maturity_Date = this.committeeForm.value.Maturity_Date;
    loanMaster.Orgination_Fee_Percent = this.committeeForm.value.Orgination_Fee_Percent
    loanMaster.Orgination_Fee_Amount = this.committeeForm.value.Orgination_Fee_Amount
    loanMaster.Service_Fee_Percent = this.committeeForm.value.Service_Fee_Percent
    loanMaster.Service_Fee_Amount = this.committeeForm.value.Service_Fee_Amount
    loanMaster.Rate_Percent = this.committeeForm.value.Rate_Percent;
    loanMaster.Rate_Fee_Amount = this.committeeForm.value.Rate_Fee_Amount;
    this.loanserviceworker.performcalculationonloanobject(this.localloanobj);
    this.publishService.enableSync(Page.committee);
  }

  /**
   * Sync to database - publish button event
   */
  synctoDb() {
    setTimeout(()=> { 
      // waiting for 0.5 sec to get the blur events excecuted meanwhile
      this.publishService.syncCompleted();
      this.committeeService.syncToDb(this.localstorageservice.retrieve(environment.loankey));
     }, 500);
    
  }
  // synctoDb() {

  //   this.loanapi.syncloanobject(this.localloanobj).subscribe(res => {
  //     if (res.ResCode == 1) {
  //       this.loanapi.getLoanById(this.localloanobj.Loan_Full_ID).subscribe(res => {
  //         if (res.ResCode == 1) {
  //           this.toaster.success("Records Synced");
  //           let jsonConvert: JsonConvert = new JsonConvert();
  //           this.loanserviceworker.performcalculationonloanobject(jsonConvert.deserialize(res.Data, loan_model));
  //         }
  //         else {
  //           this.toaster.error("Could not fetch Loan Object from API")
  //         }
  //       });
  //     }
  //     else {
  //       this.toaster.error("Error in Sync");
  //     }
  //   });
  // }

}
