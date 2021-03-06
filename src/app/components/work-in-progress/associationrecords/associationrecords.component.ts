import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { environment } from '../../../../environments/environment.prod';

@Component({
  selector: 'app-associationrecords',
  templateUrl: './associationrecords.component.html',
  styleUrls: ['./associationrecords.component.scss']
})
export class AssociationRecordsComponent implements OnInit {
  public records = [];
  constructor(
    private localstorageservice: LocalStorageService
  ) { }

  ngOnInit() {
    this.records = this.localstorageservice.retrieve(environment.loankey).Association;
    let groups = {};

    for (var i = 0; i < this.records.length; i++) {
      var groupName = this.records[i].Assoc_Type_Code;
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(this.records[i]);
    }

    console.log('groups', groups);

    // this.records = [];
    // for (var groupName in groups) {
    //   this.records.push({group: groupName, color: groups[groupName]});
    // }

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
