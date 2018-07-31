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
        params.Disc_CEI_Value = Math.max((Number(params.Market_Value)*(1-(Number(params.Disc_Value)/100)))-Number(params.Prior_Lien_Amount))
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

            
            this.computeTotalFSA(input);
            this.computeTotalEquip(input);
            this.computeTotallivestock(input);
            this.computeotherTotal(input);
            this.computerealstateTotal(input);
            this.computestoredcropTotal(input);
            let endtime = new Date().getTime();
            this.logging.checkandcreatelog(3, 'Calc_Coll_1', "LoanCalculation timetaken :" + (endtime - starttime).toString() + " ms");
            return input;
        } catch{
            return input;
        }
    }
    // this is for footer row of FSA
    computeTotalFSA(input:loan_model) {
        let starttime = new Date().getTime();
        // footer.Collateral_Category_Code = 'Total';
        let collateralFSA=input.LoanCollateral.filter(lc=>{ return lc.Collateral_Category_Code === "FSA" && lc.ActionStatus !== 3});
        input.LoanMaster[0].Net_Market_Value_FSA = this.totalNetMktValue(collateralFSA);
        input.LoanMaster[0].FC_FSA_Prior_Lien_Amount = this.totalPriorLien(collateralFSA);
        input.LoanMaster[0].FC_Market_Value_FSA = this.totalMktValue(collateralFSA);
        input.LoanMaster[0].Disc_value_FSA =this.totalDiscValue(collateralFSA);

        let endtime = new Date().getTime();
        this.logging.checkandcreatelog(3, 'Calc_Coll_2', "LoanCalculation timetaken :" + (endtime - starttime).toString() + " ms");
      }


       // this is for footer row of FSA
    computeTotalEquip(input:loan_model) {
        let starttime = new Date().getTime();
        // footer.Collateral_Category_Code = 'Total';
        let collateralEqip=input.LoanCollateral.filter(lc=>{ return lc.Collateral_Category_Code === "EQP" && lc.ActionStatus !== 3});
        input.LoanMaster[0].Net_Market_Value_Equipment = this.totalNetMktValue(collateralEqip);
        input.LoanMaster[0].FC_Equip_Prior_Lien_Amount = this.totalPriorLien(collateralEqip);
        input.LoanMaster[0].FC_Market_Value_Equip = this.totalMktValue(collateralEqip);
        input.LoanMaster[0].Disc_value_Equipment =this.totalDiscValue(collateralEqip
        );

        let endtime = new Date().getTime();
        this.logging.checkandcreatelog(3, 'Calc_Coll_3', "LoanCalculation timetaken :" + (endtime - starttime).toString() + " ms");
      }
   
    computeTotallivestock(input) {
        let starttime = new Date().getTime();
        let collaterallst=input.LoanCollateral.filter(lc=>{ return lc.Collateral_Category_Code === "LSK" && lc.ActionStatus !== 3});
        input.LoanMaster[0].FC_Market_Value_lst = this.totalMktValue(collaterallst);
        input.LoanMaster[0].FC_Lst_Prior_Lien_Amount = this.totalPriorLien(collaterallst);
        input.LoanMaster[0].Net_Market_Value_Livestock = this.totalNetMktValue(collaterallst);
        input.LoanMaster[0].Disc_value_Livestock = this.totalDiscValue(collaterallst);;
        input.LoanMaster[0].FC_total_Qty_lst = this.totalQty(collaterallst);
        input.LoanMaster[0].FC_total_Price_lst = this.totalPrice(collaterallst);
        let endtime = new Date().getTime();
        this.logging.checkandcreatelog(3, 'Calc_Coll_4', "LoanCalculation timetaken :" + (endtime - starttime).toString() + " ms");

      }

      computeotherTotal(input) {
        let starttime = new Date().getTime();
        let collateralother=input.LoanCollateral.filter(lc=>{ return lc.Collateral_Category_Code === "OTR" && lc.ActionStatus !== 3});
        input.LoanMaster[0].FC_Market_Value_other = this.totalMktValue(collateralother);
        input.LoanMaster[0].FC_other_Prior_Lien_Amount = this.totalPriorLien(collateralother);
        input.LoanMaster[0].Net_Market_Value__Other = this.totalNetMktValue(collateralother);
        input.LoanMaster[0].Disc_value_Other = this.totalDiscValue(collateralother);
        let endtime = new Date().getTime();
        this.logging.checkandcreatelog(3, 'Calc_Coll_5', "LoanCalculation timetaken :" + (endtime - starttime).toString() + " ms");
      }

      computerealstateTotal(input) {
        let starttime = new Date().getTime();
        let collateralrealstate=input.LoanCollateral.filter(lc=>{ return lc.Collateral_Category_Code === "RET" && lc.ActionStatus !== 3});       
        input.LoanMaster[0].FC_Market_Value_realstate = this.totalMktValue(collateralrealstate);
        input.LoanMaster[0].FC_realstate_Prior_Lien_Amount = this.totalPriorLien(collateralrealstate);
        input.LoanMaster[0].Net_Market_Value_Real_Estate = this.totalNetMktValue(collateralrealstate);
        input.LoanMaster[0].Disc_value_Real_Estate = this.totalDiscValue(collateralrealstate);
        input.LoanMaster[0].FC_total_Qty_Real_Estate = this.totalQty(collateralrealstate);
        let endtime = new Date().getTime();
        this.logging.checkandcreatelog(3, 'Calc_Coll_6', "LoanCalculation timetaken :" + (endtime - starttime).toString() + " ms");
      }

      computestoredcropTotal(input) {
        let starttime = new Date().getTime();
        let collateralrealstate=input.LoanCollateral.filter(lc=>{ return lc.Collateral_Category_Code === "SCP" && lc.ActionStatus !== 3});
        input.LoanMaster[0].FC_Market_Value_storedcrop = this.totalMktValue(collateralrealstate);
        input.LoanMaster[0].FC_storedcrop_Prior_Lien_Amount = this.totalPriorLien(collateralrealstate);
        input.LoanMaster[0].Net_Market_Value_Stored_Crops = this.totalNetMktValue(collateralrealstate);
        input.LoanMaster[0].Disc_value_Stored_Crops = this.totalDiscValue(collateralrealstate);;
        input.LoanMaster[0].FC_total_Qty_storedcrop = this.totalQty(collateralrealstate);
        input.LoanMaster[0].FC_total_Price_storedcrop = this.totalPrice(collateralrealstate);
        let endtime = new Date().getTime();
        this.logging.checkandcreatelog(3, 'Calc_Coll_7', "LoanCalculation timetaken :" + (endtime - starttime).toString() + " ms");

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
    totalMktValue(loanCollateral) {
        var total = 0;
        loanCollateral.forEach(lc => {
            total += Number(lc.Market_Value);
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
