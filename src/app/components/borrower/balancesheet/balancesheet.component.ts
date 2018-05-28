import { Component, OnInit } from '@angular/core';
import { borrower_model, loan_model } from '../../../models/loanmodel';
import { environment } from '../../../../environments/environment';
import { JsonConvert } from 'json2typescript';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-balancesheet',
  templateUrl: './balancesheet.component.html',
  styleUrls: ['./balancesheet.component.scss']
})
export class BalancesheetComponent implements OnInit {

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
    this.localborrowerobject=obj.Borrower;
    this.allDataFetched=true;
  }

}
