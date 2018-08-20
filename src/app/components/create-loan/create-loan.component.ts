import { Component, OnInit } from '@angular/core';
import { loan_farmer, loan_model, BorrowerEntityType, borrower_model } from '../../models/loanmodel';
import { LoanApiService } from '../../services/loan/loanapi.service';
import { ToastsManager } from 'ng2-toastr';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.prod';
import { LoancalculationWorker } from '../../Workers/calculations/loancalculationworker';
import { JsonConvert } from 'json2typescript';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-create-loan',
  templateUrl: './create-loan.component.html',
  styleUrls: ['./create-loan.component.scss']
})
export class CreateLoanComponent implements OnInit {

  private farmerParamsObj: farmer_params = new farmer_params();
  farmerSuccessCallback;
  useFarmer;
  private borrowerParamsObj: borrower_params = new borrower_params();
  borrowerInfo : borrower_model = new borrower_model();
  cropYear : number;
  constructor(private loanApiService: LoanApiService, private toaster: ToastsManager, private route : Router,
    private loancalculationservice: LoancalculationWorker,
    private localstorageservice: LocalStorageService) { }

  ngOnInit() {

    let localLoanObject = this.localstorageservice.retrieve(environment.loankey);
    if(localLoanObject){
      this.localstorageservice.clear(environment.loankey);
    }
    this.borrowerInfo.Borrower_Entity_Type_Code = BorrowerEntityType.Individual;
  }
  onFarmerFormValueChange(data) {
    this.farmerParamsObj = Object.assign(new farmer_params(), data);

  }

  onBorrowerFormValueChange(data) {
    this.borrowerParamsObj = Object.assign(new borrower_params(), data);
    this.borrowerInfo = this.borrowerParamsObj.value;
  }

  useFarmerChange(e) {
    if (e) {
      this.borrowerParamsObj.value.Borrower_First_Name = this.farmerParamsObj.value.Farmer_First_Name;
      this.borrowerParamsObj.value.Borrower_MI = this.farmerParamsObj.value.Farmer_MI;
      this.borrowerParamsObj.value.Borrower_Last_Name = this.farmerParamsObj.value.Farmer_Last_Name;
      this.borrowerParamsObj.value.Borrower_SSN_Hash = this.farmerParamsObj.value.Farmer_SSN_Hash;
      this.borrowerParamsObj.value.Borrower_DL_state = this.farmerParamsObj.value.Farmer_DL_State;
      this.borrowerParamsObj.value.Borrower_Dl_Num = this.farmerParamsObj.value.Farmer_DL_Num;
      this.borrowerParamsObj.value.Borrower_Address = this.farmerParamsObj.value.Farmer__Address;
      this.borrowerParamsObj.value.Borrower_City = this.farmerParamsObj.value.Farmer_City;
      this.borrowerParamsObj.value.Borrower_State_ID = this.farmerParamsObj.value.Farmer_State;
      this.borrowerParamsObj.value.Borrower_Zip = this.farmerParamsObj.value.Farmer_Zip;
      this.borrowerParamsObj.value.Borrower_Phone = this.farmerParamsObj.value.Farmer_Phone;
      this.borrowerParamsObj.value.Borrower_email = this.farmerParamsObj.value.Farmer_Email;
      this.borrowerParamsObj.value.Borrower_DOB = this.farmerParamsObj.value.Farmer_DOB;
      this.borrowerParamsObj.value.Borrower_Preferred_Contact_Ind = this.farmerParamsObj.value.Farmer_Preferred_Contact_Ind;
      this.borrowerInfo = Object.assign(new borrower_model(), this.borrowerParamsObj.value);
      //this.borrowerInfoObj.value = Object.assign(this.borrowerInfoObj.value, this.farmerInfo.value);
      this.borrowerParamsObj.isValid = Object.assign(this.borrowerParamsObj.isValid, this.farmerParamsObj.isValid);

    }
  }

  onSave(event:any) {


    let loanObj = Object.assign({}, this.farmerParamsObj.value, this.borrowerParamsObj.value,{Crop_Year : this.cropYear});

    if (this.farmerParamsObj.isValid && this.borrowerParamsObj.isValid) {
      this.loanApiService.createLoan(loanObj).subscribe((successResponse) => {
        this.toaster.success("Details saved successfully, navigating to Loan Dashboard...");
        this.loanApiService.getLoanById(successResponse.Data).subscribe(res => {
         
          if (res.ResCode == 1) {
  
            let jsonConvert: JsonConvert = new JsonConvert();
            this.loancalculationservice.performcalculationonloanobject(jsonConvert.deserialize(res.Data, loan_model));
            //we are making a copy of it also
            this.localstorageservice.store(environment.loankey_copy, res.Data);
            this.route.navigateByUrl("/home/loanoverview/"+successResponse.Data.replace("-","/")+"/borrower");
          }
          else {
            this.toaster.error("Could not fetch Loan Object from API")
          }
          
        });
        
      }, (errorResponse) => {
        this.toaster.error("Error Occurered while saving Farmer details");

      });
      console.log(Object.assign({}, this.farmerParamsObj.value, this.borrowerParamsObj.value));
    } else {
      this.toaster.error("The data doesn't seem to have data in correct format, please correct them before saving.");
    }
  }

}

class farmer_params {
  isValid: boolean = false;
  value: loan_farmer = new loan_farmer();
  successCallback: Function;
}

class borrower_params {
  isValid: boolean = false;
  value: borrower_model = new borrower_model();
  successCallback: Function;
}
