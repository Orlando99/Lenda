import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-company-info',
  templateUrl: './company-info.component.html',
  styleUrls: ['./company-info.component.scss']
})
export class CompanyInfoComponent implements OnInit {
  public starsCount: number = 3.5;
  // Doughnut
  // TODO: Replace this data with live API
  public doughnutChartLabels: string[] = ['Progress', 'Remaining'];
  public doughnutChartData: number[] = [75, 25];
  public doughnutChartType: string = 'doughnut';
  public chartColors: any[] = [
    {
      backgroundColor: ['#4871b7', '#e1e2e3']
    }];

  public chartOptions: any = {
    cutoutPercentage: 60,
    legend: {
      display: false
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
