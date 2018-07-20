import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../../../../node_modules/ngx-webstorage';
import { environment } from '../../../../environments/environment.prod';

@Component({
  selector: 'app-cropunitrecords',
  templateUrl: './cropunitrecords.component.html',
  styleUrls: ['./cropunitrecords.component.scss']
})
export class CropunitrecordsComponent implements OnInit {
  public records = [];
  constructor(
    private localstorageservice: LocalStorageService
  ) { }

  ngOnInit() {
    this.records = this.localstorageservice.retrieve(environment.loankey).LoanCropUnits;
  }

}
