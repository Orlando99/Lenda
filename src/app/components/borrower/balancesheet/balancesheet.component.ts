import { Component, OnInit } from '@angular/core';
import { borrower_model, loan_model } from '../../../models/loanmodel';
import { environment } from '../../../../environments/environment';
import { JsonConvert } from 'json2typescript';
import { LocalStorageService } from 'ngx-webstorage';
import { LoancalculationWorker } from '../../../Workers/calculations/loancalculationworker';

@Component({
  selector: 'app-balancesheet',
  templateUrl: './balancesheet.component.html',
  styleUrls: ['./balancesheet.component.scss']
})
export class BalancesheetComponent implements OnInit {

  private localloanobject:loan_model=new loan_model();
  public allDataFetched=false;  
  public editarray=[];
  constructor(public localstorageservice:LocalStorageService,
  public loanserviceworker:LoancalculationWorker
  ) { }
  ngOnInit() {
    this.localstorageservice.observe(environment.loankey).subscribe(res=>{
      debugger
      this.localloanobject=res;
      this.allDataFetched=true;
    })
    this.getdataforgrid();
  }
  getdataforgrid(){
    debugger
    let obj:any=this.localstorageservice.retrieve(environment.loankey);
    this.localloanobject=obj;
    this.allDataFetched=true;
  }

  startediting(value:string){
   if(this.editarray[value]!=true)
  this.editarray[value]=true;
  }
  valueupdate(value:any,key:string){
    this.editarray[key]=false;
    this.localloanobject.Borrower[key]=parseInt(value);
    this.loanserviceworker.performcalculationonloanobject(this.localloanobject);
  }

}
