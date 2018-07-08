import { Component, OnInit } from '@angular/core';
import { chartSettings } from './../../../../chart-settings';
declare var Chart;

@Component({
  selector: 'app-company-info',
  templateUrl: './company-info.component.html',
  styleUrls: ['./company-info.component.scss']
})
export class CompanyInfoComponent implements OnInit {
  public starsCount: number = 3.5;

  // TODO: Replace this data with live API
  public doughnutChartLabels: string[] = ['Progress', 'Remaining'];
  public doughnutChartData: number[] = [75, 25];

  // Doughnut chart settings
  public doughnutChartType: string = 'doughnut';
  public chartColors: any[] = [
    {
      backgroundColor: [
        chartSettings.doughnut.theme.primary,
        chartSettings.doughnut.theme.secondary
      ]
    }];

  public chartOptions: any = {
    cutoutPercentage: 70,
    legend: {
      display: false
    },
    elements: {
      center: {
        text: this.doughnutChartData[0],
        color: chartSettings.doughnut.theme.primary,
        textStyle: chartSettings.doughnut.typography.textStyle,
        iconStyle: chartSettings.doughnut.typography.iconStyle,
        textSuffixStyle: chartSettings.doughnut.typography.textSuffixStyle
      }
    }
  };

  constructor() { }

  ngOnInit() {
    this.applyCustomStyleChartJs();
  }

  // Custom code for adding icon and text inside chartjs doughnut chart
  applyCustomStyleChartJs() {
    Chart.pluginService.register({
      beforeDraw: function (chart) {
        if (chart.config.options.elements.center) {
          // Get ctx from string
          var ctx = chart.chart.ctx;
          var centerConfig = chart.config.options.elements.center;
          var color = centerConfig.color;

          // Set properties
          ctx.fillStyle = color;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          // Set font settings to draw it correctly.
          var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
          var centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);

          // Set icon - shopping cart
          ctx.font = centerConfig.iconStyle;
          ctx.fillText('\uF100', centerX, centerY + 10);

          // Set text - percentage
          ctx.font = centerConfig.textStyle;
          ctx.fillText(centerConfig.text, centerX  - 5, centerY - 25);
          // Smaller font for % text
          ctx.font = centerConfig.textSuffixStyle;
          ctx.fillText('%',  centerX + 15, centerY - 25);
        }
      }
    });
  }

}
