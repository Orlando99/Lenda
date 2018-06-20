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

  farmerInfo: farmer_info = new farmer_info();
  borrowerInfo: borrower_info= new borrower_info();
  constructor(private loanApiService: LoanApiService, private toaster: ToastsManager) { }

  ngOnInit() {
  }
  onFarmerFormValueChange(data) {
    this.farmerInfo = Object.assign(new farmer_info(), data);

  }

  onBorrowerFormValueChange(data) {
    this.borrowerInfo = Object.assign(new borrower_info(), data);

  }
  onSave() {


    let loanObj = Object.assign({}, this.farmerInfo.value, this.borrowerInfo.value);

    if (this.farmerInfo.valid && this.borrowerInfo.valid) {
      this.loanApiService.createLoan(loanObj).subscribe((successResponse) => {
        this.toaster.success("Farmer details saved successfully");
      }, (errorResponse) => {
        this.toaster.error("Error Occurered while saving Farmer details");

      });
      console.log(Object.assign({}, this.farmerInfo.value, this.borrowerInfo.value));
    } else {
      this.toaster.error("The data doesn't seem to have data in correct format, please correct them before saving.");
    }
  }

}

class farmer_info {
  valid: boolean = false;
  value: loan_farmer = new loan_farmer();
}

class borrower_info {
  valid: boolean = false;
  value: loan_borrower = new loan_borrower();
}