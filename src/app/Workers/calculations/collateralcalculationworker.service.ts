import { Injectable } from '@angular/core';
import { loan_model } from '../../models/loanmodel';
import { LoggingService } from '../../services/Logs/logging.service';


@Injectable()
export class Collateralcalculationworker {
    constructor(public logging: LoggingService) { }

    preparenetmktvalue(params) {
        params.Net_Market_Value = (Number(params.Market_Value) - Number(params.Prior_Lien_Amount)).toFixed(2);
    }

    preparediscvalue(params) {
        // params.Disc_Value=Number(params.Market_Value) - (Number(params.Market_Value) * (Number(params.Disc_CEI_Value)/100));
        params.Disc_CEI_Value = Math.max((Number(params.Market_Value) * (Number(params.Disc_Value) / 100)) - Number(params.Prior_Lien_Amount), 0)
    }

    preparemktvalue(params) {
        params.Market_Value = Number(params.Qty) * Number(params.Price);
    }

    preparecollateralmodel(input: loan_model): loan_model {
        try {
            let starttime = new Date().getTime();
            for (let i = 0; i < input.LoanCollateral.length; i++) {

                if ((input.LoanCollateral[i].Qty !== 0 && input.LoanCollateral[i].Qty !== null) || (input.LoanCollateral[i].Price !== 0 && input.LoanCollateral[i].Price !== null)) {
                    this.preparemktvalue(input.LoanCollateral[i]);
                }
                this.preparenetmktvalue(input.LoanCollateral[i]);
                this.preparediscvalue(input.LoanCollateral[i]);
            }

            let endtime = new Date().getTime();
            this.computeTotalFSA(input);
            this.logging.checkandcreatelog(3, 'Calc_Coll_1', "LoanCalculation timetaken :" + (endtime - starttime).toString() + " ms");
            return input;
        } catch{
            return input;
        }
    }
    // this is for footer row of FSA 
    computeTotalFSA(input:loan_model) {
        // footer.Collateral_Category_Code = 'Total';
        let collateralFSA=input.LoanCollateral.filter(lc=>{ return lc.Collateral_Category_Code === "FSA" && lc.ActionStatus !== 3});
        input.LoanMaster[0].Net_Market_Value_FSA = this.totalMarketValue(collateralFSA);
        input.LoanMaster[0].FSA_Prior_Lien_Amount = this.totalPriorLien(collateralFSA);
        //footer.Net_Market_Value = this.totalNetMktValue(collateralFSA);
        //footer.Disc_Value = 0;
        input.LoanMaster[0].Disc_value_FSA =this.totalDiscValue(collateralFSA);
      }

     totalMarketValue(loanCollateral) {
        var total = 0;
        loanCollateral.forEach(lc => {
            total += Number(lc.Market_Value);
        });
    
        return total;
    }

     totalDiscValue(loanCollateral) {
        var total = 0;
        loanCollateral.forEach(lc => {
            total += Number(lc.Disc_CEI_Value);
        });
    
        return total;
    }
    
     totalPriorLien(loanCollateral) {
        var total = 0;
        loanCollateral.forEach(lc => {
            total += Number(lc.Prior_Lien_Amount);
        });
    
        return total;
    }
    
     totalNetMktValue(loanCollateral) {
        var total = 0;
        loanCollateral.forEach(lc => {
            total += Number(lc.Net_Market_Value);
        });
        return total;
    }
    
     totalQty(loanCollateral) {
        var total = 0;
        loanCollateral.forEach(lc => {
            total += Number(lc.Qty);
        });
        return total;
    }
    
     totalPrice(loanCollateral) {
        var total = 0;
        loanCollateral.forEach(lc => {
            total += Number(lc.Price);
        });
        return total;
    }
}
