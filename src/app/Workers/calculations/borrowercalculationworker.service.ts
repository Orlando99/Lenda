import { Injectable } from '@angular/core';
import { borrower_model, borrower_income_history_model, loan_model } from '../../models/loanmodel';
import { LoggingService } from '../../services/Logs/logging.service';

@Injectable()
export class Borrowercalculationworker {
  private input: borrower_model
  private input2: Array<borrower_income_history_model>
  constructor(public logging: LoggingService) { }

  preparetotalassets() {
    this.input.FC_Borrower_TotalAssets = Math.round(this.input.Borrower_Fixed_Assets + this.input.Borrower_Intermediate_Assets + this.input.Borrower_Current_Assets);
  }
  preparetotalDebt() {
    this.input.FC_Borrower_TotalDebt = Math.round(this.input.Borrower_Fixed_Liabilities + this.input.Borrower_Intermediate_Liabilities + this.input.Borrower_Current_Liabilities);
  }
  preparetotalEquity() {
    this.input.FC_Borrower_TotalEquity = Math.round(this.input.FC_Borrower_TotalAssets - this.input.FC_Borrower_TotalDebt);
  }
  preparenetratio() {
    this.input.FC_Borrower_NetRatio = Math.round((this.input.FC_Borrower_TotalAssets / this.input.FC_Borrower_TotalDebt * 100));
  }
  prepare_current_equity() {
    this.input.FC_Borrower_Current_Equity = Math.round(this.input.Borrower_Current_Assets - this.input.Borrower_Current_Liabilities);
  }
  prepare_intermediate_equity() {
    this.input.FC_Borrower_Intermediate_Equity = Math.round(this.input.Borrower_Intermediate_Assets - this.input.Borrower_Intermediate_Liabilities);
  }
  prepare_fixed_equity() {
    this.input.FC_Borrower_Fixed_Equity = Math.round(this.input.Borrower_Fixed_Assets - this.input.Borrower_Fixed_Liabilities);
  }
  prepare_current_ratio() {
    this.input.FC_Borrower_Current_Ratio = Math.round((this.input.Borrower_Current_Assets / this.input.Borrower_Current_Liabilities * 100));
  }
  prepare_FICO() {
    this.input.FC_Borrower_FICO = 4;
  }
  


  //ends here
  prepareborrowermodel(input: borrower_model): borrower_model {
    try {
      this.input = input;
      let starttime = new Date().getTime();
      this.prepare_current_equity();
      this.prepare_intermediate_equity();
      this.prepare_fixed_equity();
      this.preparetotalassets();
      this.preparetotalDebt();
      this.preparetotalEquity();
      this.prepare_current_ratio();
      this.preparenetratio();
      this.prepare_FICO();
      let endtime = new Date().getTime();
      this.logging.checkandcreatelog(3, 'Calc_BORW_1', "LoanCalculation timetaken :" + (endtime - starttime).toString() + " ms");
      return this.input;
    }
    catch{
      return input;
    }
  }


  prepareborrowerincomehistorymodel(input2: loan_model): loan_model {
    try {
      let starttime = new Date().getTime();
      for (let i = 0; i < input2.LoanCollateral.length; i++) {
          this.prepare_fc_borrower_income(input2.BorrowerIncomeHistory[i]);
      }

      let endtime = new Date().getTime();
      this.logging.checkandcreatelog(3, 'Calc_Coll_1', "LoanCalculation timetaken :" + (endtime - starttime).toString() + " ms");
      return input2;
  } catch{
      return input2;
  }
  }


  prepare_fc_borrower_income(params){
    params.FC_Borrower_Income = params.Borrower_Revenue - params.Borrower_Expense;
  }


}
