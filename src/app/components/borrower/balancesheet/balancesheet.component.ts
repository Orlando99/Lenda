import { Component, OnInit } from '@angular/core';
import { borrower_model, loan_model } from '../../../models/loanmodel';
import { environment } from '../../../../environments/environment';
import { JsonConvert } from 'json2typescript';
import { LocalStorageService } from 'ngx-webstorage';
import { LoancalculationWorker } from '../../../Workers/calculations/loancalculationworker';
import { modelparserfordb } from '../../../Workers/utility/modelparserfordb';
import { BorrowerapiService } from '../../../services/borrower/borrowerapi.service';
import { ToastsManager } from 'ng2-toastr';

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
  private toaster: ToastsManager
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
    if(obj!=null && obj!=undefined)
    {
    this.localloanobject=obj;
    this.allDataFetched=true;
    }
  }

  startediting(value:string){
   if(this.editarray[value]!=true)
  this.editarray[value]=true;
  }
  valueupdate(value:any,key:string){
    this.editarray[key]=false;
    this.localloanobject.Borrower[key]=parseInt(value);
    this.loanserviceworker.performcalculationonloanobject(this.localloanobject);
    this.syncenabled=true;
  }

   synctoDb(){
    var obj=modelparserfordb(this.localloanobject.Borrower);
    this.borrowerservice.saveupdateborrower(obj).subscribe(res=>{
      if(res.ResCode==1){
        this.toaster.success("Object Synced Successfully");
      }
      else{
        this.toaster.error("Error Encountered while Syncing");
       }
    });
   }

}
