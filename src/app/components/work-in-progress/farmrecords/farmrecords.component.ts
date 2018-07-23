import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../../../../node_modules/ngx-webstorage';
import { environment } from '../../../../environments/environment.prod';

@Component({
  selector: 'app-farmrecords',
  templateUrl: './farmrecords.component.html',
  styleUrls: ['./farmrecords.component.scss']
})
export class FarmRecordsComponent implements OnInit {
  public records = [];
  constructor(
    private localstorageservice: LocalStorageService
  ) { }

  ngOnInit() {
    this.records = this.localstorageservice.retrieve(environment.loankey).Farms;
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
