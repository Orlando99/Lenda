import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { chartSettings } from './../../../../../chart-settings';

@Component({
  selector: 'app-risk-chart',
  templateUrl: './risk-chart.component.html',
  styleUrls: ['./risk-chart.component.scss']
})
export class RiskChartComponent implements OnInit {
  constructor() { }

  ngOnInit() {
    // Set bar
    this.setChart('#risk', 0, 100, chartSettings.riskAndReturns.riskBg);
    this.setChart('#cushion', 100, 200, chartSettings.riskAndReturns.cushionBg);
    this.setChart('#returnFirst', 200, 300, chartSettings.riskAndReturns.returnLightGreen);
    this.setChart('#returnSecond', 300, 400, chartSettings.riskAndReturns.returnDarkGreen);
    // Set diamond
    this.setValues();
  }

  setChart(item, rangeStart, rangeEnd, color) {
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
        return 'translate(0, 10)';
      })
      .attr('width', 100)
      .attr('height', 10)
      .attr('fill', color);
  }

  setValues() {
    var symbolGenerator = d3.symbol()
      .size(30);

    var symbolTypes = ['symbolDiamond'];

    var xScale = d3.scaleLinear().range([0, 400]);

    d3.select('#blackDiamond')
      .selectAll('path')
      .data(symbolTypes)
      .enter()
      .append('path')
      .attr('transform', function (d, i) {
        return 'translate(' + 300 + ', 25)';
      })
      .attr('d', function (d) {
        symbolGenerator
          .type(d3[d]);

        return symbolGenerator();
      }).attr('fill', chartSettings.riskAndReturns.blackDiamond);

    d3.select('#redDiamond')
      .selectAll('path')
      .data(symbolTypes)
      .enter()
      .append('path')
      .attr('transform', function (d, i) {
        return 'translate(' + 400 + ', 5)';
      })
      .attr('d', function (d) {
        symbolGenerator
          .type(d3[d]);

        return symbolGenerator();
      })
      .attr('fill', chartSettings.riskAndReturns.redDiamond);
  }
}
