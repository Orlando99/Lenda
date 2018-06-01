import { Component, OnInit } from '@angular/core';
import { loan_model, borrower_model } from '../../../models/loanmodel';
import { environment } from '../../../../environments/environment';
import { deserialize } from 'serializer.ts/Serializer';
import { JsonConvert } from 'json2typescript';
import { LocalStorageService } from 'ngx-webstorage';
import { LoggingService } from '../../../services/Logs/logging.service';


@Component({
  selector: 'app-financials',
  templateUrl: './financials.component.html',
  styleUrls: ['./financials.component.scss']
})
export class FinancialsComponent implements OnInit {
  private localborrowerobject:borrower_model;
  public allDataFetched=false;  
  constructor(public localstorageservice:LocalStorageService,public logging:LoggingService) { }
  
  ngOnInit() {
    this.localstorageservice.observe(environment.loankey).subscribe(res=>{
      // log
      this.logging.checkandcreatelog(1,'financials',"LocalStorage updated");
      //
      this.localborrowerobject=res.Borrower;
      this.allDataFetched=true;
    })
    this.getdataforgrid();
  }

  getdataforgrid(){
    
    let obj:any=this.localstorageservice.retrieve(environment.loankey);
    this.logging.checkandcreatelog(1,'financials',"LocalStorage retrieved");
    if(obj!=null && obj!=undefined)
    {
    this.localborrowerobject=obj.Borrower;
    this.allDataFetched=true;
    }
  }


}
