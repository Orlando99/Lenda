import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-work-in-progress-stats',
  templateUrl: './work-in-progress-stats.component.html',
  styleUrls: ['./work-in-progress-stats.component.scss']
})
export class WorkInProgressStatsComponent implements OnInit {

  conditionList: Array<string>;
  constructor() { }

  ngOnInit() {

    this.conditionList = ['Abc prerequisite doc', 'Promissory Note', 'Agreecutural Security Document'];
  }

}
