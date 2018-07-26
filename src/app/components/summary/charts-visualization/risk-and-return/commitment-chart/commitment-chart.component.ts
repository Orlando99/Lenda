import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { LocalStorageService } from 'ngx-webstorage';
import { environment } from '../../../../../../environments/environment';
import { chartSettings } from './../../../../../chart-settings';
import { PriceFormatter } from '../../../../../Workers/utility/aggrid/formatters';
import { loan_model } from '../../../../../models/loanmodel';

@Component({
  selector: 'app-commitment-chart',
  templateUrl: './commitment-chart.component.html',
  styleUrls: ['./commitment-chart.component.scss']
})
export class CommitmentChartComponent implements OnInit {
  public info = {
    armCommitment: '',
    distCommitment: '',
    totalCommitment: '',
    excessIns: '',
    excessInsPercent: 0
  };
  localLoanObject : loan_model;
  armCommit = chartSettings.commitmentExcessIns.armCommit;
  distCommit = chartSettings.commitmentExcessIns.distCommit;
  excessIns = chartSettings.commitmentExcessIns.excessIns;

  constructor(
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit() {

    this.localLoanObject = this.localStorageService.retrieve(environment.loankey);
    if(this.localLoanObject && this.localLoanObject.LoanMaster[0]){
      this.processInfo(this.localLoanObject.LoanMaster[0]);
    }

    this.localStorageService.observe(environment.loankey).subscribe(res=>{
      if(res){
        this.localLoanObject = res;
        if(this.localLoanObject && this.localLoanObject.LoanMaster[0]){
          this.processInfo(this.localLoanObject.LoanMaster[0]);
        }
      }

    })
    
  }

  processInfo(loanMaster){
    this.getCommitment(loanMaster);
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

  getCommitment(loanMaster) {
    this.info.armCommitment = loanMaster.ARM_Commitment ? PriceFormatter(loanMaster.ARM_Commitment) : '$ 0';
    this.info.distCommitment = loanMaster.Dist_Commitment ? PriceFormatter(loanMaster.ARM_Commitment) : '$ 0';
    let totalCmt = loanMaster.ARM_Commitment + loanMaster.Dist_Commitment;
    this.info.totalCommitment = totalCmt ? PriceFormatter(totalCmt) : '$ 0';
    // TODO: Get excessin value from local storage
    let excessIns = 313095;
    this.info.excessIns = excessIns ? PriceFormatter(excessIns) : '$ 0';
    let excessInsPercent: any = (excessIns) * 100 / parseFloat(totalCmt);
    this.info.excessInsPercent = excessInsPercent.toFixed(1);
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
