import { Component, OnInit } from '@angular/core';
import { borrower_model, loan_model } from '../../../models/loanmodel';
import { environment } from '../../../../environments/environment';
import { JsonConvert } from 'json2typescript';
import { LocalStorageService } from 'ngx-webstorage';
import { LoancalculationWorker } from '../../../Workers/calculations/loancalculationworker';
import { modelparserfordb } from '../../../Workers/utility/modelparserfordb';
import { BorrowerapiService } from '../../../services/borrower/borrowerapi.service';
import { ToastsManager } from 'ng2-toastr';
import { LoggingService } from '../../../services/Logs/logging.service';

@Component({
  selector: 'app-balancesheet',
  templateUrl: './balancesheet.component.html',
  styleUrls: ['./balancesheet.component.scss']
})
export class BalancesheetComponent implements OnInit {

  private localloanobject:loan_model=new loan_model();
  public allDataFetched=false;  
  public editarray=[];
  public syncenabled=false;
  constructor(public localstorageservice:LocalStorageService,
  public loanserviceworker:LoancalculationWorker,
  public borrowerservice:BorrowerapiService,
  private toaster: ToastsManager,
  public logging:LoggingService
  ) { }
  ngOnInit() {
    this.localstorageservice.observe(environment.loankey).subscribe(res=>{
      this.logging.checkandcreatelog(1,'BalanceSheet',"LocalStorage updated");
      this.localloanobject=res;
      this.allDataFetched=true;
    })
    this.getdataforgrid();
  }
  getdataforgrid(){
    let obj:any=this.localstorageservice.retrieve(environment.loankey);
    this.logging.checkandcreatelog(1,'BalanceSheet',"LocalStorage retrieved");
    if(obj!=null && obj!=undefined)
    {
    this.localloanobject=obj;
    this.allDataFetched=true;
    }
  }

  startediting(value:string){
  this.editarray=[];
  this.editarray[value]=true;
  }
  valueupdate(value:any,key:string){
    debugger
    this.editarray[key]=false;
    if(value==""){
      value="0";
    }
    this.localloanobject.Borrower[key]=parseInt(value);
    this.logging.checkandcreatelog(3,'BalanceSheet',"Field Edited -"+key);
    this.loanserviceworker.performcalculationonloanobject(this.localloanobject);
    this.syncenabled=true;
  }

   synctoDb(){
    var obj=modelparserfordb(this.localloanobject.Borrower);
    this.borrowerservice.saveupdateborrower(obj).subscribe(res=>{
      this.logging.checkandcreatelog(3,'BalanceSheet',"Code Synced to DB with ResCode "+res.ResCode);
      if(res.ResCode==1){
        this.toaster.success("Object Synced Successfully");
      }
      else{
        this.toaster.error("Error Encountered while Syncing");
       }
    });
   }

}
