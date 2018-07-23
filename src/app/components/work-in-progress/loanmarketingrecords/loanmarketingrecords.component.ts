import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../../../../node_modules/ngx-webstorage';
import { environment } from '../../../../environments/environment.prod';

@Component({
  selector: 'app-loanmarketingrecords',
  templateUrl: './loanmarketingrecords.component.html',
  styleUrls: ['./loanmarketingrecords.component.scss']
})
export class LoanMarketingRecordsComponent implements OnInit {
  public records = [];
  constructor(
    private localstorageservice: LocalStorageService
  ) { }

  ngOnInit() {
    this.records = this.localstorageservice.retrieve(environment.loankey).LoanMarketingContracts;
  }

}
