import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { environment } from '../../../environments/environment.prod';
import { loan_model } from '../../models/loanmodel';
import { LoancalculationWorker } from '../../Workers/calculations/loancalculationworker';
import { ToastsManager } from 'ng2-toastr';
import { PublishService, Page } from '../../services/publish.service';
import { BorrowerService } from './borrower.service';

@Component({
  selector: 'app-borrower',
  templateUrl: './borrower.component.html',
  styleUrls: ['./borrower.component.scss'],
  providers : [BorrowerService]
})
export class BorrowerComponent implements OnInit {

  public creditscore;
  public creditdate:Date;
  public currentPageName: string = Page.borrower;
  constructor(private borrowerService : BorrowerService,
    private localStorageService : LocalStorageService,private publishService : PublishService,
  private loanCalculationService : LoancalculationWorker,private taoster:ToastsManager) { }

  ngOnInit() {
    var loan:loan_model=this.localStorageService.retrieve(environment.loankey);
    if(loan!=null || loan!=undefined){
      this.creditdate=loan.LoanMaster[0].Credit_Score_Date;
      this.creditscore=loan.LoanMaster[0].Credit_Score;
    }
  }

  updatecreditvalues(){
    var loan:loan_model=this.localStorageService.retrieve(environment.loankey);
    loan.LoanMaster[0].Credit_Score=this.creditscore;
    loan.LoanMaster[0].Credit_Score_Date=this.creditdate.toDateString();
    this.loanCalculationService.performcalculationonloanobject(loan,false);
    this.taoster.success("Saved Successfully");
  }

  
   /**
   * Sync to database - publish button event
   */
  synctoDb() {
    this.publishService.syncCompleted();
    this.borrowerService.syncToDb(this.localStorageService.retrieve(environment.loankey));
  }

}
