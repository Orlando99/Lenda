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
  public cropRevenue  : Array<CropRevenueModel> = [];
  constructor(public localstorageservice:LocalStorageService,public logging:LoggingService) { }
  ngOnInit() {
    this.localstorageservice.observe(environment.loankey).subscribe(res=>{
      if(res!=undefined && res!=null)
      {
      // this.logging.checkandcreatelog(1,'Projected Income',"LocalStorage updated");
      this.localloanobject=res;
      this.allDataFetched=true;
      this.prepareData();
      }
    })
    this.getdataforgrid();
  }
  getdataforgrid(){
    
    let obj:any=this.localstorageservice.retrieve(environment.loankey);
    // this.logging.checkandcreatelog(1,'Projected Income',"LocalStorage retrieved");
    if(obj!=null && obj!=undefined)
    {
    this.localloanobject=obj;
    this.allDataFetched=true;
    }
    this.prepareData();

  }

  prepareData(){
    
  }

  

}

class  CropRevenueModel{
  Name : string;
  Acres : number;
  CropYield : number;
  Share : number;
  Price : number;
  Basic_Adj : number;
  Marketing_Adj : number;
  Rebate_Adj : number;
  Revenue : number;
}
