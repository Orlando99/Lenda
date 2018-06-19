import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-work-in-progress',
  templateUrl: './work-in-progress.component.html',
  styleUrls: ['./work-in-progress.component.scss']
})
export class WorkInProgressComponent implements OnInit {

  exceptionList : Array<any>;
  conditionList: Array<string>;
  constructor() { }

  ngOnInit() {

    this.exceptionList = [
      {
        message : 'this is exception one',
        severity : 'high'
      },
      {
        message : 'this is exception two',
        severity : 'low'
      },
      {
        message : 'this is exception three',
        severity : 'low'
      },
      {
        message : 'this is exception four',
        severity : 'high'
      }
    ]

    this.conditionList= ['Abc prerequisite doc', 'Promissory Note','Agreecutural Security Document'];
  }



}
