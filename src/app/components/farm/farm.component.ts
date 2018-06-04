import { Component, OnInit } from '@angular/core';
import { loan_model } from '../../models/loanmodel';
import { LocalStorageService } from 'ngx-webstorage';
import { LoancalculationWorker } from '../../Workers/calculations/loancalculationworker';
import { ToastsManager } from 'ng2-toastr';
import { LoggingService } from '../../services/Logs/logging.service';
import { environment } from '../../../environments/environment';
import { modelparserfordb } from '../../Workers/utility/modelparserfordb';

@Component({
  selector: 'app-farm',
  templateUrl: './farm.component.html',
  styleUrls: ['./farm.component.scss']
})
export class FarmComponent implements OnInit {

  private localloanobject: loan_model = new loan_model();
  public allDataFetched = false;
  public editarray = [];
  public syncenabled = false;
  constructor(public localstorageservice: LocalStorageService,
    public loanserviceworker: LoancalculationWorker,
    // public farmservice:FarmapiService,
    private toaster: ToastsManager,
    public logging: LoggingService
  ) { }
  ngOnInit() {
    this.localstorageservice.observe(environment.loankey).subscribe(res => {
      this.logging.checkandcreatelog(1, 'LoanFarms', "LocalStorage updated");
      this.localloanobject = res;
      this.allDataFetched = true;
    })
    this.getdataforgrid();
  }
  getdataforgrid() {
    let obj: any = this.localstorageservice.retrieve(environment.loankey);
    this.logging.checkandcreatelog(1, 'LoanFarms', "LocalStorage retrieved");
    if (obj != null && obj != undefined) {
      this.localloanobject = obj;
      this.allDataFetched = true;
    }
  }

  startediting(value: string) {
    if (this.editarray[value] != true)
      this.editarray[value] = true;
  }
  valueupdate(value: any, key: string) {
    this.editarray[key] = false;
    this.localloanobject.Borrower[key] = parseInt(value);
    this.logging.checkandcreatelog(3, 'LoanFarms', "Field Edited -" + key);
    this.loanserviceworker.performcalculationonloanobject(this.localloanobject);
    this.syncenabled = true;
  }

  synctoDb() {
    var obj = modelparserfordb(this.localloanobject.Borrower);
    // this.borrowerservice.saveupdateborrower(obj).subscribe(res=>{
    //   this.logging.checkandcreatelog(3,'BalanceSheet',"Code Synced to DB with ResCode "+res.ResCode);
    //   if(res.ResCode==1){
    //     this.toaster.success("Object Synced Successfully");
    //   }
    //   else{
    //     this.toaster.error("Error Encountered while Syncing");
    //    }
    // });
  }
}
