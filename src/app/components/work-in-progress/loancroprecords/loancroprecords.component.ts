import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../../../../node_modules/ngx-webstorage';
import { environment } from '../../../../environments/environment.prod';

@Component({
  selector: 'app-loancroprecords',
  templateUrl: './loancroprecords.component.html',
  styleUrls: ['./loancroprecords.component.scss']
})
export class LoanCropsRecordsComponent implements OnInit {
  public records = [];
  constructor(
    private localstorageservice: LocalStorageService
  ) { }

  ngOnInit() {
    this.records = this.localstorageservice.retrieve(environment.loankey).LoanCrops;
  }

}
