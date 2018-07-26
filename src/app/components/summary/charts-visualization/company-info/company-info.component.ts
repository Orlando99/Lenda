import { Component, OnInit, Input } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { environment } from '../../../../../environments/environment';
import { loan_model } from '../../../../models/loanmodel';

@Component({
  selector: 'app-company-info',
  templateUrl: './company-info.component.html',
  styleUrls: ['./company-info.component.scss']
})
export class CompanyInfoComponent implements OnInit {
  @Input() viewMode:number;
  private info = {
    borrwerFirstName: '',
    borrowerLastName: '',
    farmerFirstName: '',
    farmerLastName: '',
    loanFullId: ''
  }

  public starsCount: number = 3.5;
  localLoanObject : loan_model;

  constructor(
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit() {

    this.localLoanObject = this.localStorageService.retrieve(environment.loankey);
    if(this.localLoanObject && this.localLoanObject.LoanMaster[0]){
      this.getCompanyInfo(this.localLoanObject.LoanMaster[0]);
    }

    this.localStorageService.observe(environment.loankey).subscribe(res=>{
      if(res){
        this.localLoanObject = res;
        if(this.localLoanObject && this.localLoanObject.LoanMaster[0]){
          this.getCompanyInfo(this.localLoanObject.LoanMaster[0]);
        }
      }

    })
  }

  getCompanyInfo(loanMaster) {
    this.info.borrwerFirstName = loanMaster.Borrower_First_Name;
    this.info.borrowerLastName = loanMaster.Borrower_Last_Name;
    this.info.farmerFirstName = loanMaster.Farmer_First_Name;
    this.info.farmerLastName = loanMaster.Farmer_Last_Name;
    this.info.loanFullId = loanMaster.Loan_Full_ID;
  }
}
