import { Component, OnInit, Input } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import * as d3 from 'd3';
import { chartSettings } from './../../../../../chart-settings';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-risk-chart',
  templateUrl: './risk-chart.component.html',
  styleUrls: ['./risk-chart.component.scss']
})
export class RiskChartComponent implements OnInit {
  @Input() viewMode;
  private info = {
    riskCushionAmount: '',
    riskCushionPercent: '',
    returnPercent: '',
    // TODO: Replace with real value for black and red diamond
    blackDiamond: 300,
    redDiamond: 400
  };

  constructor(
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit() {
    // Set bar
    this.setChart('#risk', 0, 100, chartSettings.riskAndReturns.riskBg);
    this.setChart('#cushion', 100, 200, chartSettings.riskAndReturns.cushionBg);
    this.setChart('#returnFirst', 200, 300, chartSettings.riskAndReturns.returnLightGreen);
    this.setChart('#returnSecond', 300, 400, chartSettings.riskAndReturns.returnDarkGreen);
    // Set diamond
    this.setValues();
    this.getRiskReturnValuesFromLocalStorage();
  }

  getRiskReturnValuesFromLocalStorage() {
    let loanMaster = this.localStorageService.retrieve(environment.loankey_copy).LoanMaster[0];
    this.info.riskCushionAmount = loanMaster.Risk_Cushion_Amount;
    this.info.riskCushionPercent = loanMaster.Risk_Cushion_Percent;
    this.info.returnPercent = loanMaster.Return_Percent;
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
      .attr('transform', (d, i) => {
        return 'translate(' + this.info.blackDiamond + ', 25)';
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
      .attr('transform', (d, i) => {
        return 'translate(' + this.info.redDiamond + ', 5)';
      })
      .attr('d', function (d) {
        symbolGenerator
          .type(d3[d]);

        return symbolGenerator();
      })
      .attr('fill', chartSettings.riskAndReturns.redDiamond);
  }
}
