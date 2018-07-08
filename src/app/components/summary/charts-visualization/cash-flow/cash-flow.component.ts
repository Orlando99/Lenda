import { Component, OnInit } from '@angular/core';
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
      backgroundColor: ['#7cc4d5', '#f79647', '#2a4d76', '#782c2b', '#5b7231', '#432f58', '#7e63a2', '#afc97b', 'rgb(255, 99, 132)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)', 'rgb(231,233,237)']
    }];

  public chartOptions: any = {
    legend: {
      position: 'right'
    },
    pieceLabel: {
      render: 'percentage',
      fontColor: '#fff',
      showActualPercentages: true
    }
  };

  constructor() { }

  ngOnInit() {
  }

}
