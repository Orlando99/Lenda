import { Component, OnInit, HostListener } from '@angular/core';
import { environment } from '../../../environments/environment';
import { loan_model, borrower_model } from '../../models/loanmodel';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
  private localborrowerobject:borrower_model=new borrower_model();
  public allDataFetched=false;  
  constructor(public localstorageservice:LocalStorageService) { }
  ngOnInit() {
    this.localstorageservice.observe(environment.loankey).subscribe(res=>{
      debugger
      this.localborrowerobject=res.Borrower;
      this.allDataFetched=true;
    })
    this.getdataforgrid();
  }
  getdataforgrid(){
    debugger
    let obj:any=this.localstorageservice.retrieve(environment.loankey);
    if(obj!=null && obj!=undefined)
    {
    this.localborrowerobject=obj.Borrower;
    this.allDataFetched=true;
    }
  }
}
