import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
declare var Chart: any;
declare var ctx: any;

@Component({
  selector: 'app-risk-and-return',
  templateUrl: './risk-and-return.component.html',
  styleUrls: ['./risk-and-return.component.scss']
})
export class RiskAndReturnComponent implements OnInit {
  constructor() { }

  ngOnInit() {
    // Set bar
    this.setChart('#risk', 0, 100, '#ffc000');
    this.setChart('#cushion', 100, 200, '#ffff00');
    this.setChart('#returnFirst', 200, 300, '#92d050');
    this.setChart('#returnSecond', 300, 400, '#339933');
    // Set diamond
    this.setValues();
  }

  setChart(item, rangeStart, rangeEnd, color) {
    var linearScale = d3.scaleLinear()
      .domain([0, 100])
      .range([rangeStart, rangeEnd]);

    var myData = d3.range(0, 100);

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
      .attr('width', 5)
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
      }).attr('fill', '#1c1c1c');;

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
      .attr('fill', '#ff1b1b');
  }

}
