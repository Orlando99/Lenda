import { Component, OnInit } from '@angular/core';
import { loan_model } from '../../../models/loanmodel';
import { LocalStorageService } from 'ngx-webstorage';
import { LoggingService } from '../../../services/Logs/logging.service';
import { environment } from '../../../../environments/environment.prod';

@Component({
  selector: 'app-projectedincome',
  templateUrl: './projectedincome.component.html',
  styleUrls: ['./projectedincome.component.scss']
})
export class ProjectedincomeComponent implements OnInit {
  private localloanobject:loan_model=new loan_model();
  public allDataFetched=false;  
  constructor(public localstorageservice:LocalStorageService,public logging:LoggingService) { }
  ngOnInit() {
    this.localstorageservice.observe(environment.loankey).subscribe(res=>{
      this.logging.checkandcreatelog(1,'Projected Income',"LocalStorage updated");
      this.localloanobject=res;
      this.allDataFetched=true;
    })
    this.getdataforgrid();
  }
  getdataforgrid(){
    
    let obj:any=this.localstorageservice.retrieve(environment.loankey);
    this.logging.checkandcreatelog(1,'Projected Income',"LocalStorage retrieved");
    if(obj!=null && obj!=undefined)
    {
    this.localloanobject=obj;
    this.allDataFetched=true;
    }
  }


}
