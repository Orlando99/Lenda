import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { chartSettings } from './../../../../../chart-settings';

@Component({
  selector: 'app-commitment-chart',
  templateUrl: './commitment-chart.component.html',
  styleUrls: ['./commitment-chart.component.scss']
})
export class CommitmentChartComponent implements OnInit {
  armCommit = chartSettings.commitmentExcessIns.armCommit;
  excessIns = chartSettings.commitmentExcessIns.excessIns;

  constructor() { }

  ngOnInit() {
    // Set bars
    this.setChart('#arm', 0, 100, chartSettings.commitmentExcessIns.armCommit, 10);
    this.setChart('#dist', 100, 200, chartSettings.commitmentExcessIns.distCommit, 10);
    this.setChart('#excess', 200, 350, chartSettings.commitmentExcessIns.excessIns, 25);

    // Set gridlines
    for (let i = 0; i < 9; i++) {
      this.setGrid('#grid-' + i, 'rgba(0, 0, 0, 0.04)', i * 50);
    }
  }

  setChart(item, rangeStart, rangeEnd, color, translateY) {
    var linearScale = d3.scaleLinear()
      .domain([0, 1])
      .range([rangeStart, rangeEnd]);

    var myData = d3.range(0, 1);

    d3.select(item)
      .selectAll('rect')
      .data(myData)
      .enter()
      .append('rect')
      .attr('x', function (d) {
        return linearScale(d);
      })
      .attr('transform', function (d, i) {
        return 'translate(0, ' + translateY + ')';
      })
      .attr('width', rangeEnd - rangeStart)
      .attr('height', 15)
      .attr('fill', color);
  }

  setGrid(item, color, translateX) {
    var linearScale = d3.scaleLinear()
      .domain([0, 1])
      .range([0, 100]);

    var myData = d3.range(0, 1);

    d3.select(item)
      .selectAll('rect')
      .data(myData)
      .enter()
      .append('rect')
      .attr('x', function (d) {
        return linearScale(d);
      })
      .attr('transform', function (d, i) {
        return 'translate(' + translateX + ', 0)';
      })
      .attr('width', 1)
      .attr('height', 50)
      .attr('fill', color);
  }
}
