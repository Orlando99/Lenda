import { Injectable } from '@angular/core';
import { borrower_model } from '../../models/loanmodel';

@Injectable()
export class Borrowercalculationworker {
  private input:borrower_model
  constructor() { }

  preparetotalassets(){
   this.input.FC_Borrower_TotalAssets=Math.round(this.input.Borrower_Fixed_Assets+this.input.Borrower_Intermediate_Assets+this.input.Borrower_Current_Assets);
  }
  preparetotalDebt(){
    this.input.FC_Borrower_TotalDebt= Math.round(this.input.Borrower_Fixed_Liabilities+this.input.Borrower_Intermediate_Liabilities+this.input.Borrower_Current_Liabilities);
  }
  preparetotalEquity(){
    this.input.FC_Borrower_TotalEquity= Math.round(this.input.FC_Borrower_TotalAssets-this.input.FC_Borrower_TotalDebt);
  }
  preparenetratio(){
    this.input.FC_Borrower_NetRatio= Math.round((this.input.FC_Borrower_TotalAssets/this.input.FC_Borrower_TotalDebt *100));
  }
  prepare_current_equity(){
    this.input.FC_Borrower_Current_Equity= Math.round(this.input.Borrower_Current_Assets-this.input.Borrower_Current_Liabilities);
  }
  prepare_intermediate_equity(){
    this.input.FC_Borrower_Intermediate_Equity= Math.round(this.input.Borrower_Intermediate_Assets-this.input.Borrower_Intermediate_Liabilities);
  }
  prepare_fixed_equity(){
    this.input.FC_Borrower_Fixed_Equity= Math.round(this.input.Borrower_Fixed_Assets-this.input.Borrower_Fixed_Liabilities);
  }
  prepare_current_ratio(){
    this.input.FC_Borrower_Current_Ratio= Math.round((this.input.Borrower_Current_Assets/this.input.Borrower_Current_Liabilities*100));
  }
  prepare_FICO(){
    this.input.FC_Borrower_FICO= 4;
  }
  prepareborrowermodel(input:borrower_model):borrower_model{
    debugger
    this.input=input;
    this.prepare_current_equity();
    this.prepare_intermediate_equity();
    this.prepare_fixed_equity();
    this.preparetotalassets();
    this.preparetotalDebt();
    this.preparetotalEquity();
    this.prepare_current_ratio();
    this.preparenetratio();
    this.prepare_FICO();
    return this.input;
  }


}
