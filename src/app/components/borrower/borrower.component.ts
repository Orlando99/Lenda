import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../../../node_modules/ngx-webstorage';
import { environment } from '../../../environments/environment.prod';
import { loan_model } from '../../models/loanmodel';
import { LoancalculationWorker } from '../../Workers/calculations/loancalculationworker';
import { ToastsManager } from '../../../../node_modules/ng2-toastr';

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
  }

  updatecreditvalues(){
    var loan:loan_model=this.localstorage.retrieve(environment.loankey);
    loan.LoanMaster[0].Credit_Score=this.creditscore;
    loan.LoanMaster[0].Credit_Score_Date=this.creditdate.toDateString();
    this.loancalservice.performcalculationonloanobject(loan,false);
    this.taoster.success("Saved Successfully");
  }

}
