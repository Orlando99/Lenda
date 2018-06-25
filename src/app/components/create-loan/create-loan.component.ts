import { Component, OnInit } from '@angular/core';
import { loan_farmer, loan_borrower, loan_model } from '../../models/loanmodel';
import { LoanApiService } from '../../services/loan/loanapi.service';
import { ToastsManager } from 'ng2-toastr';

@Component({
  selector: 'app-create-loan',
  templateUrl: './create-loan.component.html',
  styleUrls: ['./create-loan.component.scss']
})
export class CreateLoanComponent implements OnInit {

  farmerInfo: farmer_params = new farmer_params();
  farmerSuccessCallback;
  useFarmer;
  borrowerInfo: borrower_params = new borrower_params();
  constructor(private loanApiService: LoanApiService, private toaster: ToastsManager) { }

  ngOnInit() {
  }
  onFarmerFormValueChange(data) {
    this.farmerInfo = Object.assign(new farmer_params(), data);

  }

  onBorrowerFormValueChange(data) {
    this.borrowerInfo = Object.assign(new borrower_params(), data);
  }

  farmerInfoCopy;

  useFarmerChange(e) {
    console.log(e)
    if (e) {
      this.farmerInfoCopy = this.farmerInfo;
      console.log(this.borrowerInfo)

    }
  }

  onSave(event:any) {


    let loanObj = Object.assign({}, this.farmerInfo.value, this.borrowerInfo.value);

    if (this.farmerInfo.valid && this.borrowerInfo.valid) {
      this.loanApiService.createLoan(loanObj).subscribe((successResponse) => {
        this.toaster.success("Farmer details saved successfully");
        this.farmerInfo.successCallback && this.farmerInfo.successCallback();
        this.borrowerInfo.successCallback && this.borrowerInfo.successCallback();
      }, (errorResponse) => {
        this.toaster.error("Error Occurered while saving Farmer details");

      });
      console.log(Object.assign({}, this.farmerInfo.value, this.borrowerInfo.value));
    } else {
      this.toaster.error("The data doesn't seem to have data in correct format, please correct them before saving.");
    }
  }

}

class farmer_params {
  valid: boolean = false;
  value: loan_farmer = new loan_farmer();
  successCallback: Function;
}

class borrower_params {
  valid: boolean = false;
  value: loan_borrower = new loan_borrower();
  successCallback: Function;
}
