import { Component, OnInit, HostListener } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { loan_model, borrower_model } from '../../models/loanmodel';
import { LocalStorageService } from 'ngx-webstorage';
import { LoggingService } from '../../services/Logs/logging.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
  private localborrowerobject:borrower_model=new borrower_model();
  public allDataFetched=false;
  loading;
  constructor(public localstorageservice:LocalStorageService,public logging:LoggingService) { }
  ngOnInit() {
    this.loading = true;
    this.localstorageservice.observe(environment.loankey).subscribe(res=>{
      if(res!=undefined && res!=null)
      {
      this.logging.checkandcreatelog(1,'Summary',"LocalStorage updated");
      this.loading = false;
      this.localborrowerobject=res.LoanMaster[0];
      this.allDataFetched=true;
    }
    })
    this.getdataforgrid();
  }
  getCurrentDate(){
    return new Date();
  }
  getdataforgrid(){

    let obj:any=this.localstorageservice.retrieve(environment.loankey);
    this.logging.checkandcreatelog(1,'Summary',"LocalStorage retrieved");
    if(obj!=null && obj!=undefined)
    {

    this.localborrowerobject=obj.LoanMaster[0];
    this.allDataFetched=true;
    }
  }
}
