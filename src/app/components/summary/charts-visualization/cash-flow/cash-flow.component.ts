import { Component, OnInit } from '@angular/core';
import { chartSettings } from './../../../../chart-settings';
import 'chart.piecelabel.js';

@Component({
  selector: 'app-cash-flow',
  templateUrl: './cash-flow.component.html',
  styleUrls: ['./cash-flow.component.scss']
})
export class CashFlowComponent implements OnInit {
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
      position: 'right'
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
