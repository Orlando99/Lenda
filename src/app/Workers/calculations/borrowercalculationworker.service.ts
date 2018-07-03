import { Injectable } from '@angular/core';
import { borrower_model } from '../../models/loanmodel';
import { LoggingService } from '../../services/Logs/logging.service';

@Injectable()
export class Borrowercalculationworker {
  private input:borrower_model
  constructor(public logging:LoggingService) { }

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
  //Balance sheet item calculations
  prepare_current_Adjvalue(){
   this.input.FC_Borrower_Current_Adjvalue=this.input.Borrower_Current_Assets * this.input.Borrower_Current_Assets_Disc/100;
  }
  prepare_Intermediate_Adjvalue(){
    this.input.FC_Borrower_Intermediate_Adjvalue=this.input.Borrower_Intermediate_Assets * this.input.Borrower_Intermediate_Assets_Disc/100;
  }
  prepare_Fixed_Adjvalue(){
    this.input.FC_Borrower_Fixed_Adjvalue=this.input.Borrower_Fixed_Assets * this.input.Borrower_Fixed_Assets_Disc/100;
  }
  prepare_current_DiscValue(){
    this.input.FC_Borrower_Current_Discvalue=this.input.FC_Borrower_Current_Adjvalue - this.input.Borrower_Current_Liabilities;
   }
   prepare_Intermediate_DiscValue(){
     this.input.FC_Borrower_Intermediate_Discvalue=this.input.FC_Borrower_Intermediate_Adjvalue - this.input.Borrower_Intermediate_Liabilities;
   }
   prepare_Fixed_DiscValue(){
     this.input.FC_Borrower_Fixed_Discvalue=this.input.FC_Borrower_Fixed_Adjvalue - this.input.Borrower_Fixed_Liabilities;
   }
   prepare_total_DiscValue(){
     this.input.FC_Borrower_Total_Discvalue=this.input.FC_Borrower_Fixed_Discvalue+ this.input.FC_Borrower_Intermediate_Discvalue+  this.input.FC_Borrower_Current_Discvalue;
   }
   prepare_total_Adjvalue(){
    this.input.FC_Borrower_Total_Adjvalue=this.input.FC_Borrower_Current_Adjvalue+ this.input.FC_Borrower_Intermediate_Adjvalue+  this.input.FC_Borrower_Fixed_Adjvalue;
  }
  

  //ends here
  prepareborrowermodel(input:borrower_model):borrower_model{
    try{
    this.input=input;
      let starttime=new Date().getTime();
    this.prepare_current_equity();
    this.prepare_intermediate_equity();
    this.prepare_fixed_equity();
    this.preparetotalassets();
    this.preparetotalDebt();
    this.preparetotalEquity();
    this.prepare_current_ratio();
    this.preparenetratio();
    this.prepare_FICO();
    this.prepare_current_Adjvalue()
    this.prepare_Intermediate_Adjvalue()
    this.prepare_Fixed_Adjvalue()
    this.prepare_current_DiscValue()
    this.prepare_Intermediate_DiscValue()
    this.prepare_Fixed_DiscValue()
    this.prepare_total_DiscValue()
    this.prepare_total_Adjvalue()
    let endtime=new Date().getTime();
    this.logging.checkandcreatelog(3,'Calc_BORW_1',"LoanCalculation timetaken :" + (endtime-starttime).toString() + " ms");
    return this.input;
  }
  catch{
    return input;
  }
  }


}
