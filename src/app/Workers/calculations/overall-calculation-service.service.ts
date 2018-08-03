import { Injectable } from '@angular/core';
import { loan_model } from '../../models/loanmodel';
import { LoggingService } from '../../services/Logs/logging.service';
@Injectable()
export class OverallCalculationServiceService {

  constructor(public logging: LoggingService) { }

  balancesheet_calc(loanObject: loan_model) {
    try{
      let starttime = new Date().getTime();
      if(loanObject.LoanMaster && loanObject.LoanMaster.length > 0){
      let loanMaster = loanObject.LoanMaster[0];

      loanMaster.FC_Current_Adjvalue = loanMaster.Current_Assets * (1 - loanMaster.Current_Assets_Disc_Percent / 100);
      
      loanMaster.FC_Inter_Adjvalue = loanMaster.Inter_Assets * (1 - loanMaster.Inter_Assets_Disc_Percent / 100);
      
      loanMaster.FC_Fixed_Adjvalue = loanMaster.Fixed_Assets * (1 - loanMaster.Fixed_Assets_Disc_Percent / 100);
      
      
      loanMaster.Current_Disc_Net_Worth = loanMaster.FC_Current_Adjvalue - loanMaster.Current_Liabilities;
      
      
      loanMaster.Inter_Disc_Net_Worth = loanMaster.FC_Inter_Adjvalue - loanMaster.Inter_Liabilities;
      
      
      loanMaster.Fixed_Disc_Net_Worth = loanMaster.FC_Fixed_Adjvalue - loanMaster.Fixed_Liabilities;
      
      loanMaster.Total_Assets = loanMaster.Current_Assets + loanMaster.Inter_Assets +  loanMaster.Fixed_Assets;
      loanMaster.FC_Total_AdjValue = loanMaster.FC_Current_Adjvalue + loanMaster.FC_Inter_Adjvalue +  loanMaster.FC_Fixed_Adjvalue;
      loanMaster.Total_Liabilities = loanMaster.Current_Liabilities + loanMaster.Inter_Liabilities +  loanMaster.Fixed_Liabilities;
      loanMaster.Total_Disc_Net_Worth = loanMaster.Current_Disc_Net_Worth + loanMaster.Inter_Disc_Net_Worth +  loanMaster.Fixed_Disc_Net_Worth;
    }
    
      let endtime = new Date().getTime();
      this.logging.checkandcreatelog(3, 'Calc_BalanceSheet', "LoanCalculation timetaken :" + (endtime - starttime).toString() + " ms");
      return loanObject;
    }catch(e){
      this.logging.checkandcreatelog(3, 'Calc_BalanceSheet', e);
      return loanObject;
    }
  }

}
