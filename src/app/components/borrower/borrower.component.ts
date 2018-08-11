import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { environment } from '../../../environments/environment.prod';
import { loan_model } from '../../models/loanmodel';
import { LoancalculationWorker } from '../../Workers/calculations/loancalculationworker';
import { ToastsManager } from 'ng2-toastr';

@Component({
  selector: 'app-borrower',
  templateUrl: './borrower.component.html',
  styleUrls: ['./borrower.component.scss']
})
export class BorrowerComponent implements OnInit {

  public creditscore;
  public creditdate:Date;
  constructor(private localstorage:LocalStorageService,private loancalservice:LoancalculationWorker,private taoster:ToastsManager) { }

  ngOnInit() {
    var loan:loan_model=this.localstorage.retrieve(environment.loankey);
    if(loan!=null || loan!=undefined){
      this.creditdate=loan.LoanMaster[0].Credit_Score_Date;
      this.creditscore=loan.LoanMaster[0].Credit_Score;
    }
  }

  updatecreditvalues(){
    var loan:loan_model=this.localstorage.retrieve(environment.loankey);
    loan.LoanMaster[0].Credit_Score=this.creditscore;
    loan.LoanMaster[0].Credit_Score_Date=this.creditdate.toDateString();
    this.loancalservice.performcalculationonloanobject(loan,false);
    this.taoster.success("Saved Successfully");
  }

}
