import { Component, OnInit, Input } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-rangebar',
  templateUrl: './rangebar.component.html',
  styleUrls: ['./rangebar.component.scss']
})
export class RangebarComponent implements OnInit {
  @Input() strong;
  @Input() stable;
  @Input() weak;
  @Input() value = 0;
  public valuePercent;
  constructor() { }

  ngOnInit() {
    this.calculateValuePercentage();
  }

  calculateValuePercentage() {
    this.valuePercent = `${this.value * 100 / Math.abs(this.strong - this.weak)}%`;
  }
}
