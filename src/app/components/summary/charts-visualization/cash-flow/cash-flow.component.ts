import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';

import { environment } from '../../../../../environments/environment';
import { chartSettings } from '../../../../chart-settings';
import 'chart.piecelabel.js';
import { loan_model } from '../../../../models/loanmodel';
import { PriceFormatter } from '../../../../Workers/utility/aggrid/formatters';

@Component({
  selector: 'app-cash-flow',
  templateUrl: './cash-flow.component.html',
  styleUrls: ['./cash-flow.component.scss']
})
export class CashFlowComponent implements OnInit {
  @Input() viewMode;
  @Input() viewClass;
  private info = {
    budget: '',
    cashFlow: '',
    breakEven: ''
  };
  localLoanObject : loan_model;
  // Doughnut
  // TODO: Replace this data with live API
  public doughnutChartLabels: string[] = [];
  public doughnutChartData: string[] = [];
  public generatedColors: string[] = [];

  public doughnutChartType: string = 'doughnut';
  public chartColors: any[] = [
    {
      backgroundColor:
      // this.generatedColors
      chartSettings.doughnut.backgroundColors
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
    },
    tooltips: {
      callbacks: {
        label: (tooltipItem, data) => {
          let datasetLabel = data.datasets[tooltipItem.datasetIndex].label || 'Other';
          let label = data.labels[tooltipItem.index];
          let value = parseInt(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]).toLocaleString();
          return `${label}: ${value}`;
        }
      }
    }
  };

  constructor(
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit() {
    

    this.localLoanObject = this.localStorageService.retrieve(environment.loankey);
    if(this.localLoanObject && this.localLoanObject.LoanMaster[0] && this.localLoanObject.LoanBudget){
      this.getLoanBudgetFromLocalStorage(this.localLoanObject.LoanBudget);
      this.getLoanSummary(this.localLoanObject.LoanMaster[0]);

    }

    this.localStorageService.observe(environment.loankey).subscribe(res=>{
      if(res){
        this.localLoanObject = res;
        if(this.localLoanObject && this.localLoanObject.LoanMaster[0] && this.localLoanObject.LoanBudget){
          this.getLoanBudgetFromLocalStorage(this.localLoanObject.LoanBudget);
          this.getLoanSummary(this.localLoanObject.LoanMaster[0]);
        }
      }

    })

    
  }

  getLoanSummary(loanMaster) {
    this.info.budget = loanMaster.Total_Commitment ? PriceFormatter(loanMaster.Total_Commitment) : '$ 0';
    this.info.cashFlow = loanMaster.Cash_Flow_Amount ? PriceFormatter(loanMaster.Cash_Flow_Amount) : '$ 0';
    // TOOD: Replace with real value form local storage
    this.info.breakEven = loanMaster.Break_Even_Percent;
  }

  getLoanBudgetFromLocalStorage(loanBudgets) {
    
    let index = 0;
    for (let budget of loanBudgets) {
      if (budget.Total_Budget_Crop_ET !== 0 && budget.Crop_Practice_ID === 2) {
        this.doughnutChartLabels.push(
          this.getBudgetExpenseType(budget.Expense_Type_ID)
        );
        this.doughnutChartData.push(budget.Total_Budget_Crop_ET);
        this.generatedColors.push(this.dynamicColors());
      }
    }
  }

  getBudgetExpenseType(expenseType) {
    let budgetExpenseTypes = this.localStorageService.retrieve(environment.referencedatakey);
    for (let type of budgetExpenseTypes.BudgetExpenseType) {
      if (type.Budget_Expense_Type_ID === expenseType) {
        return type.Budget_Expense_Name;
      }
    }
    return 'UNDEFINED';
  }

  dynamicColors() {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return "rgba(" + r + "," + g + "," + b + ", 0.85)";
  }
}
