import { Injectable } from '@angular/core';
import { loan_model } from '../../models/loanmodel';
import { LoggingService } from '../../services/Logs/logging.service';

@Injectable()
export class FarmcalculationworkerService {
  constructor(private logging:LoggingService) { }


  prepareLoanfarmmodel(input:loan_model):loan_model{
    try{
      let starttime = new Date().getTime(); 
      for(let i =0;i<input.Farms.length;i++){
        input.Farms[i].FC_Total_Acres=input.Farms[i].Irr_Acres+input.Farms[i].NI_Acres;
      }

      let endtime = new Date().getTime();
      this.logging.checkandcreatelog(3, 'Calc_LoanFarm', "LoanCalculation timetaken :" + (endtime - starttime).toString() + " ms");
      return input;
    }
    catch(e){
      this.logging.checkandcreatelog(3, 'Calc_LoanFarm', e);
      return input;
    }
  }
}
