import { Component, OnInit } from '@angular/core';
enum ViewMode {
    concise,
    essential,
    complete
};

@Component({
  selector: 'app-charts-visualization',
  templateUrl: './charts-visualization.component.html',
  styleUrls: ['./charts-visualization.component.scss']
})
export class ChartsVisualizationComponent implements OnInit {
  public viewMode:number =  ViewMode.complete;
  public viewClass: string = 'complete';

  constructor() { }

  ngOnInit() {
  }

  public setView(viewMode) {
    this.viewMode = viewMode;
    if (viewMode == 0) {
      this.viewClass = 'concise';
    } else if (viewMode ==1) {
      this.viewClass = 'essential';
    } else if (viewMode ==2) {
      this.viewClass = 'complete';
    } else {
      this.viewClass = 'detailed';
    }
  }
}
