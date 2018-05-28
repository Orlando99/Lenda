import { Component, OnInit } from '@angular/core';
import { loan_model, borrower_model } from '../../../models/loanmodel';
import { LendaStorageService } from '../../../services/localstorage/lendalocalstorageservice';
import { environment } from '../../../../environments/environment';
import { deserialize } from 'serializer.ts/Serializer';
import { plainToClass } from 'class-transformer';


@Component({
  selector: 'app-financials',
  templateUrl: './financials.component.html',
  styleUrls: ['./financials.component.scss']
})
export class FinancialsComponent implements OnInit {
  private localborrowerobject:borrower_model;
  public allDataFetched=false;  
  constructor(public localstorageservice:LendaStorageService) { }
  ngOnInit() {
    this.localstorageservice.changes.subscribe(res=>{
      if(res.key==environment.loankey)
      {
        
        this.localborrowerobject=res.value.Borrower;
      }

      this.allDataFetched=true;
    })
  }


}
