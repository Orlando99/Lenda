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
        // params.Disc_Value=Number(params.Market_Value) - (Number(params.Market_Value) * (Number(params.Disc_CEI_Value)/100));
        params.Disc_CEI_Value = Math.max(Number(params.Market_Value)*(1-Number(params.Disc_Value)/100)-Number(params.Prior_Lien_Amount))
    }

    preparemktvalue(params){
        params.Market_Value=Number(params.Qty) * Number(params.Price);
    }
        
    preparecollateralmodel(input:loan_model):loan_model{
        try{
            let starttime=new Date().getTime();
            for(let i =0;i<input.LoanCollateral.length;i++){
                
                if((input.LoanCollateral[i].Qty !== 0 && input.LoanCollateral[i].Qty !== null) || (input.LoanCollateral[i].Price !== 0 && input.LoanCollateral[i].Price !== null)){
                    this.preparemktvalue(input.LoanCollateral[i]);
                }
                this.preparenetmktvalue(input.LoanCollateral[i]);
                this.preparediscvalue(input.LoanCollateral[i]);
            }
            
            let endtime=new Date().getTime();
            this.logging.checkandcreatelog(3,'Calc_Coll_1',"LoanCalculation timetaken :" + (endtime-starttime).toString() + " ms");
            return input;
        }catch{
            return input;
        }
    }
}
