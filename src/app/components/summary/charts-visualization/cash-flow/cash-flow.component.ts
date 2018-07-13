import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { chartSettings } from './../../../../chart-settings';
import 'chart.piecelabel.js';

@Component({
  selector: 'app-cash-flow',
  templateUrl: './cash-flow.component.html',
  styleUrls: ['./cash-flow.component.scss']
})
export class CashFlowComponent implements OnInit {
  @Input() viewMode;
  @Input() viewClass;

  // Doughnut
  // TODO: Replace this data with live API
  public doughnutChartLabels: string[] = ['Seed', 'Cash Rent', 'Fertilizer', 'Herbicide', 'Harvesting', 'Fuel', 'Insecticide', 'Custom', 'Labor', 'Repairs'];
  public doughnutChartData: number[] = [5, 10, 15, 8, 2, 14, 16, 17, 8, 15];

  public doughnutChartType: string = 'doughnut';
  public chartColors: any[] = [
    {
      backgroundColor: chartSettings.doughnut.backgroundColors
    }];

  public chartOptions: any = {
    legend: {
      position: 'right',
      labels: {
        fontColor: chartSettings.doughnut.legendColor,
        fontSize: 11,
        usePointStyle: true
      }
    },
    pieceLabel: {
      render: 'percentage',
      fontColor: chartSettings.doughnut.textColor,
      showActualPercentages: true
    }
  };

  constructor() { }

  ngOnInit() {
  }
}
