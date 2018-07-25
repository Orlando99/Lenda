import { Component, OnInit, Input } from '@angular/core';
enum ViewMode {
  concise,
  essential,
  complete,
  extra
};

@Component({
  selector: 'app-charts-visualization',
  templateUrl: './charts-visualization.component.html',
  styleUrls: ['./charts-visualization.component.scss']
})
export class ChartsVisualizationComponent implements OnInit {
  @Input() viewMode: number = ViewMode.extra;
  public viewClass: string;

  constructor() { }

  ngOnInit() {
    this.setView(this.viewMode);
  }

  public setView(viewMode) {
    this.viewMode = viewMode;
    if (viewMode == 0) {
      this.viewClass = 'concise';
    } else if (viewMode == 1) {
      this.viewClass = 'essential';
    } else if (viewMode == 2) {
      this.viewClass = 'complete';
    } else {
      this.viewClass = 'detailed';
    }
  }
}
