import { Injectable } from '@angular/core';
import { loan_model } from '../../models/loanmodel';
import { LoggingService } from '../../services/Logs/logging.service';

@Injectable()
export class FarmcalculationworkerService {
  constructor(private logging:LoggingService) { }


  prepareLoanfarmmodel(input:loan_model):loan_model{
    try{
    let starttime=new Date().getMilliseconds();  
    for(let i =0;i<input.Farms.length;i++){
      input.Farms[i].FC_Total_Acres=input.Farms[i].Irr_Acres+input.Farms[i].NI_Acres;
    }
    let endtime=new Date().getMilliseconds();
    this.logging.checkandcreatelog(3,'CalculationforFarms',"LoanCalculation timetaken :" + (starttime-endtime).toString() + " ms");
    return input;
  }
  catch{
    return input;
  }
  }
}
