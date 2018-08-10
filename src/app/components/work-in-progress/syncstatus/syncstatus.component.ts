import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
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

  changeColor(params){
    if(params.ActionStatus === 3){
      return { 'background-color': 'red'};
    }else if(params.ActionStatus === 2){
      return { 'background-color': 'yellow'};
    }else if(params.ActionStatus === 1){
      return { 'background-color': 'green'};
    }
  }

}
