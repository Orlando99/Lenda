import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { environment } from '../../../../environments/environment.prod';
import { BudgetHelperService } from '../../budget/budget-helper.service';
import { Loan_Budget, Loan_Crop_Practice, loan_model } from '../../../models/loanmodel';

@Component({
  selector: 'app-budget-report',
  templateUrl: './budget-report.component.html',
  styleUrls: ['./budget-report.component.scss']
})
export class BudgetReportComponent implements OnInit {
  
  constructor(public localstorageservice: LocalStorageService,
  public budgetService : BudgetHelperService) {
 
  }
  budgets: Array<any>;
  totalRevenue : number;
  

  ngOnInit() {    

    this.localstorageservice.observe(environment.loankey).subscribe(res => {
      if(res!=undefined && res!=null)
      {
        let loanObject : loan_model = res;
        if(loanObject && loanObject.LoanCropPractices && loanObject.LoanBudget && loanObject.LoanMaster){
          this.totalRevenue = loanObject.LoanMaster[0].FC_Total_Revenue;
          this.prepareData(loanObject.LoanCropPractices,loanObject.LoanBudget);
        }       
       
      }
    });
  
    let loanObject : loan_model= this.localstorageservice.retrieve(environment.loankey);
    if(loanObject && loanObject.LoanCropPractices && loanObject.LoanBudget && loanObject.LoanMaster ){
          
      this.totalRevenue = loanObject.LoanMaster[0].FC_Total_Revenue;
      this.prepareData(loanObject.LoanCropPractices,loanObject.LoanBudget);
    }  
  }

  prepareData(cropPractices : Array<Loan_Crop_Practice>, loanBudget : Array<Loan_Budget>): any {
    let preparedCP = this.budgetService.prepareCropPractice(cropPractices);
    this.budgets = this.budgetService.getTotalTableData(loanBudget, preparedCP);
    this.budgets.push(this.budgetService.getTotals(this.budgets)[0]);

    this.budgets.forEach(budget=>{
      budget.Per_Revenue =  (100*budget.Total_Budget_Crop_ET)/this.totalRevenue;
      budget.Per_Revenue = parseFloat(budget.Per_Revenue.toFixed(1));
    });
  }

}
