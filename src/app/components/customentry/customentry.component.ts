import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { environment } from '../../../environments/environment.prod';
import { loan_model } from '../../models/loanmodel';
import { LoancalculationWorker } from '../../Workers/calculations/loancalculationworker';

@Component({
  selector: 'app-customentry',
  templateUrl: './customentry.component.html',
  styleUrls: ['./customentry.component.scss']
})
export class CustomentryComponent implements OnInit {

  public Borrowercreditscore:number=0;
  public CPA_Prepared:number=0;
  constructor(private localstorage:LocalStorageService,
  private loancalculationservice:LoancalculationWorker) { }

  ngOnInit() {
  }

  update(){
    let obj:loan_model=this.localstorage.retrieve(environment.loankey);
    obj.Borrower.FC_Borrower_FICO=this.Borrowercreditscore;
    obj.LoanMaster.CPA_Prepared_Financials=this.CPA_Prepared;
    this.loancalculationservice.performcalculationonloanobject(obj);
  }

}
