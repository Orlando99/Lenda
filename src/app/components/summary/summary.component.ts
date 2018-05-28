import { Component, OnInit, HostListener } from '@angular/core';
import { LendaStorageService } from '../../services/localstorage/lendalocalstorageservice';
import { environment } from '../../../environments/environment';
import { loan_model, borrower_model } from '../../models/loanmodel';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
  private localborrowerobject:borrower_model=new borrower_model();
  public allDataFetched=false;  
  constructor(public localstorageservice:LendaStorageService) { }
  ngOnInit() {
    this.localstorageservice.changes.subscribe(res=>{
      if(res.key==environment.loankey)
      debugger
      this.localborrowerobject=res.value.Borrower;
      this.allDataFetched=true;
    })
  }
}
