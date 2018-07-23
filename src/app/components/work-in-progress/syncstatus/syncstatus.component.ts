import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../../../../node_modules/ngx-webstorage';
import { environment } from '../../../../environments/environment.prod';

@Component({
  selector: 'app-syncstatus',
  templateUrl: './syncstatus.component.html',
  styleUrls: ['./syncstatus.component.scss']
})
export class SyncStatusComponent implements OnInit {
  public records = [];
  constructor(
    private localstorageservice: LocalStorageService
  ) { }

  ngOnInit() {
    this.records = [this.localstorageservice.retrieve(environment.loankey).SyncStatus];
  }

}
