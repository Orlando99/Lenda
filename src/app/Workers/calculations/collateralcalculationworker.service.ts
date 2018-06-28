import { Injectable } from '@angular/core';
import { loan_model } from '../../models/loanmodel';
import { LoggingService } from '../../services/Logs/logging.service';


@Injectable()
export class Collateralcalculationworker {
    constructor(public logging:LoggingService) { }

    preparenetmktvalue(params){
        params.Net_Market_Value=(Number(params.Market_Value) - Number(params.Prior_Lien_Amount)).toFixed(2);
    }

    preparediscvalue(params){
        params.Disc_Value=Number(params.Market_Value) - (Number(params.Market_Value) * (Number(params.Disc_CEI_Value)/100));
    }

    preparemktvalue(params){
        params.Market_Value=Number(params.Qty) * Number(params.Price);
    }
        
    preparecollateralmodel(input:loan_model):loan_model{
        try{
            let starttime=new Date().getMilliseconds();
            for(let i =0;i<input.LoanCollateral.length;i++){
                
                if((input.LoanCollateral[i].Qty !== 0 && input.LoanCollateral[i].Qty !== null) || (input.LoanCollateral[i].Price !== 0 && input.LoanCollateral[i].Price !== null)){
                    this.preparemktvalue(input.LoanCollateral[i]);
                }
                this.preparenetmktvalue(input.LoanCollateral[i]);
                this.preparediscvalue(input.LoanCollateral[i]);
            }
            
            let endtime=new Date().getMilliseconds();
            this.logging.checkandcreatelog(3,'CalculationforCollateral',"LoanCalculation timetaken :" + (starttime-endtime).toString() + " ms");
            return input;
        }catch{
            return input;
        }
    }
}
