import { Injectable } from '@angular/core';
import { borrower_model, borrower_income_history_model, loan_model } from '../../models/loanmodel';
import { LoggingService } from '../../services/Logs/logging.service';

@Injectable()
export class Borrowerincomehistoryworker {
  private input: loan_model
  constructor(public logging: LoggingService) { }


  prepareborrowerincomehistorymodel(input: loan_model): loan_model {
    try {
      this.input = input
      let starttime = new Date().getTime();
        for (let i = 0; i < this.input.BorrowerIncomeHistory.length; i++) {
            this.prepare_fc_borrower_income(this.input.BorrowerIncomeHistory[i]);
        }
      let endtime = new Date().getTime();
      this.logging.checkandcreatelog(3, 'Calc_BorrowIncomeHistory', "LoanCalculation timetaken :" + (endtime - starttime).toString() + " ms");this.logging.checkandcreatelog(3, 'Calc_BorrowIncomeHistory_1', "LoanCalculation timetaken :" + (endtime - starttime).toString() + " ms");
      return this.input;
    } catch(e){
      this.logging.checkandcreatelog(3, 'Calc_BorrowIncomeHistory', e);
      return this.input;
    }
  }

  prepare_fc_borrower_income(params){
    params.FC_Borrower_Income = params.Borrower_Revenue - params.Borrower_Expense;
  }
    


}