import { Injectable } from '@angular/core';
import { loan_model } from '../../models/loanmodel';
import { LoggingService } from '../../services/Logs/logging.service';
import { LocalStorageService } from 'ngx-webstorage';
import { environment } from '../../../environments/environment.prod';
import { Loan_Crop_Unit } from '../../models/cropmodel';
import * as _ from "lodash";
import { Loan_Farm } from '../../models/farmmodel.';


@Injectable()
export class Collateralcalculationworker {
    constructor(public logging: LoggingService, public localStorageService : LocalStorageService) { }

    preparenetmktvalue(params) {
        params.Net_Market_Value = (Number(params.Market_Value) - Number(params.Prior_Lien_Amount)).toFixed(2);
    }

    preparediscvalue(params) {
        // params.Disc_Value=Number(params.Market_Value) - (Number(params.Market_Value) * (Number(params.Disc_CEI_Value)/100));
        
        params.Disc_Value = Math.max((Number(params.Market_Value)*(1-(Number(params.Disc_Pct)/100)))-Number(params.Prior_Lien_Amount))
    }

    preparemktvalue(params) {
        params.Market_Value = Number(params.Qty) * Number(params.Price);
    }

    preparecollateralmodel(input: loan_model): loan_model {
        try {
            let starttime = new Date().getTime();
            for (let i = 0; i < input.LoanCollateral.length; i++) {

                if ((input.LoanCollateral[i].Qty !== 0 && input.LoanCollateral[i].Qty !== null) || (input.LoanCollateral[i].Price !== 0 && input.LoanCollateral[i].Price !== null)) {
                    //this.preparemktvalue(input.LoanCollateral[i]);
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
            this.logging.checkandcreatelog(1, 'Calc_Collateral', "LoanCalculation timetaken :" + (endtime - starttime).toString() + " ms");
            return input;
        } catch(e){
            this.logging.checkandcreatelog(1, 'Calc_Collateral', e);
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
        this.logging.checkandcreatelog(1, 'Calc_Collateral_FSA', "LoanCalculation timetaken :" + (endtime - starttime).toString() + " ms");
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
        this.logging.checkandcreatelog(1, 'Calc_Collateral_EQP', "LoanCalculation timetaken :" + (endtime - starttime).toString() + " ms");
      }
   
    computeTotallivestock(input) {
        
        let starttime = new Date().getTime();
        let collaterallst=input.LoanCollateral.filter(lc=>{ return lc.Collateral_Category_Code === "LSK" && lc.ActionStatus !== 3});
        debugger
        input.LoanMaster[0].FC_Market_Value_lst = this.totalMktValue(collaterallst);
        input.LoanMaster[0].FC_Lst_Prior_Lien_Amount = this.totalPriorLien(collaterallst);
        input.LoanMaster[0].Net_Market_Value_Livestock = this.totalNetMktValue(collaterallst);
        input.LoanMaster[0].Disc_value_Livestock = this.totalDiscValue(collaterallst);;
        input.LoanMaster[0].FC_total_Qty_lst = this.totalQty(collaterallst);
        input.LoanMaster[0].FC_total_Price_lst = this.totalPrice(collaterallst);
        let endtime = new Date().getTime();
        this.logging.checkandcreatelog(1, 'Calc_Collateral_LST', "LoanCalculation timetaken :" + (endtime - starttime).toString() + " ms");

      }

      computeotherTotal(input) {
        let starttime = new Date().getTime();
        let collateralother=input.LoanCollateral.filter(lc=>{ return lc.Collateral_Category_Code === "OTR" && lc.ActionStatus !== 3});
        input.LoanMaster[0].FC_Market_Value_other = this.totalMktValue(collateralother);
        input.LoanMaster[0].FC_other_Prior_Lien_Amount = this.totalPriorLien(collateralother);
        input.LoanMaster[0].Net_Market_Value__Other = this.totalNetMktValue(collateralother);
        input.LoanMaster[0].Disc_value_Other = this.totalDiscValue(collateralother);
        let endtime = new Date().getTime();
        this.logging.checkandcreatelog(1, 'Calc_Collateral_OTR', "LoanCalculation timetaken :" + (endtime - starttime).toString() + " ms");
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
        this.logging.checkandcreatelog(1, 'Calc_Collateral_RET', "LoanCalculation timetaken :" + (endtime - starttime).toString() + " ms");
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
        this.logging.checkandcreatelog(1, 'Calc_Collateral_SCP', "LoanCalculation timetaken :" + (endtime - starttime).toString() + " ms");

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
    
    performMarketValueCalculations(loanObject : loan_model){
        try{
            let starttime = new Date().getTime(); 
            let cropPractices = loanObject.LoanCropPractices;
            cropPractices.forEach(cp => {
                let cropPractice = this.getCropAndPracticeType(cp.Crop_Practice_ID);
                let acres = this.getAcresForCrop(loanObject,cropPractice.cropCode,cropPractice.practiceTypeCode);
                let cropyield = this.getCropYieldForCropPractice(loanObject,cropPractice.cropCode,cropPractice.practiceTypeCode);
                let share = this.getShare(loanObject,cropPractice.cropCode,cropPractice.practiceTypeCode );
                let crop = this.getCrop(loanObject,cropPractice.cropCode);
                cp.Market_Value = (acres * cropyield * share/100)*(crop.Crop_Price+crop.Basic_Adj+crop.Marketing_Adj+crop.Rebate_Adj);
                cp.Disc_Market_Value = cp.Market_Value* (1 - (47.5/100));
                cp.ActionStatus =2;
            });

            if(loanObject.LoanMaster && loanObject.LoanMaster[0]){
                loanObject.LoanMaster[0].Net_Market_Value_Crops = _.sumBy(cropPractices,(cp)=> cp.Market_Value);
                loanObject.LoanMaster[0].Disc_value_Crops = _.sumBy(cropPractices,(cp)=> cp.Disc_Market_Value);
            }
            let crops = loanObject.LoanCrops;
        
            crops.forEach(crop => {
                crop.Acres = this.getAcresForCrop(loanObject, crop.Crop_Code);
                crop.W_Crop_Yield = this.getCropYieldForCrop(loanObject,crop.Crop_Code);
                crop.LC_Share = this.getShare(loanObject,crop.Crop_Code);
                let IRRCropPracticeID = this.getCropPracticeID(crop.Crop_Code, 'IRR');
                let NIRCropPracticeID = this.getCropPracticeID(crop.Crop_Code,'NIR');
                crop.Revenue = 0;
                if(IRRCropPracticeID){
                    let cp = cropPractices.find(cp=>cp.Crop_Practice_ID == IRRCropPracticeID);
                    crop.Revenue +=  cp ? cp.Market_Value : 0 
                }

                if(NIRCropPracticeID){
                    let cp = cropPractices.find(cp=>cp.Crop_Practice_ID == NIRCropPracticeID);
                    crop.Revenue +=  cp ? cp.Market_Value : 0 
                }
                crop.ActionStatus =2;
                
            });

            let toVerify = _.sumBy(crops,(c)=> c.Revenue);
            if(loanObject.LoanMaster && loanObject.LoanMaster[0]){
                loanObject.LoanMaster[0].Total_Crop_Acres = _.sumBy(crops,(cp)=> cp.Acres);
                
            }
            let endtime = new Date().getTime();
            this.logging.checkandcreatelog(1, 'Calc_MarketValue', "LoanCalculation timetaken :" + (endtime - starttime).toString() + " ms");
            return loanObject;
        }catch(e){
            this.logging.checkandcreatelog(1, 'Calc_MarketValue', e);
            return loanObject;
        }

    }

    getCrop(localObject : loan_model,cropCode){
        if(localObject.LoanCrops && localObject.LoanCrops.length > 0)
        {
            return localObject.LoanCrops.find(c=>c.Crop_Code == cropCode);
        }
        return undefined;
    }
    getCropAndPracticeType(cropPracticeID){
        let refdata = this.localStorageService.retrieve(environment.referencedatakey);
        if(refdata.CropList){
            let cropPractice = refdata.CropList.find(cl=>cl.Crop_And_Practice_ID == cropPracticeID);
            if(cropPractice){
                return {
                    cropCode : cropPractice.Crop_Code,
                    practiceTypeCode : cropPractice.Practice_type_code
                }
            }else{
                return undefined;
            }
        }
    }
    getCropPracticeID(cropCode,practiceType){
        let refdata = this.localStorageService.retrieve(environment.referencedatakey);
        if(refdata.CropList){
            let cropPractice = refdata.CropList.find(cl=>cl.Crop_Code == cropCode && cl.Practice_type_code == practiceType);
            if(cropPractice){
                return cropPractice.Crop_And_Practice_ID;
               
            }else{
                return undefined;
            }
        }
    }
    
    performMarketValueCalculationsAtCropLevel(loanObject : loan_model){
        
    }

   
  getAcresForCrop(loanObject : loan_model,cropCode, practiceType = undefined){
    let totalAcres :number= 0;
    if(loanObject.LoanCropUnits && loanObject.LoanCropUnits.length > 0 ){
      let unitsForCrop : Array<Loan_Crop_Unit>;
      if(practiceType){
        unitsForCrop = loanObject.LoanCropUnits.filter(cu=>cu.Crop_Code == cropCode &&  cu.Crop_Practice_Type_Code == practiceType);
      }else{
        unitsForCrop = loanObject.LoanCropUnits.filter(cu=>cu.Crop_Code == cropCode);
      }
      
      if(unitsForCrop && unitsForCrop.length > 0){
       totalAcres  = _.sumBy(unitsForCrop, (cu)=> cu.CU_Acres); 
      }
    }
    return totalAcres;

  }

  getCropYieldForCropPractice(loanObject : loan_model,cropCode, practice){
    if(cropCode && practice){
      if(loanObject.CropYield && loanObject.CropYield.length > 0){
        let cropPracticeYield = loanObject.CropYield.find(cy=>cy.CropType == cropCode && cy.IrNI == practice);
        return cropPracticeYield ? cropPracticeYield.CropYield : 0;
      }else{
        return 0;
      }
    }
  }
  getCropYieldForCrop(loanObject : loan_model,cropCode,cropPractice=undefined){
   
    let IRRAcres = this.getAcresForCrop(loanObject,cropCode,'IRR');
    let NIRAcres = this.getAcresForCrop(loanObject,cropCode,'NIR');
    let IRRYield = this.getCropYieldForCropPractice(loanObject,cropCode, 'IRR');
    let NIRYield = this.getCropYieldForCropPractice(loanObject,cropCode,'NIR');
    if(IRRAcres+NIRAcres >0){
        return ((IRRAcres*IRRYield) + (NIRAcres*NIRYield))/(IRRAcres+NIRAcres);
    }else{
        return 0;
       
    }
    
    
  }

  getShare(loanObject : loan_model,cropCode,practiceType =undefined){

    let totalAcres = 0;
    let shareAcres= 0;
    let cropUnits = [];
    if(loanObject.LoanCropUnits && loanObject.LoanCropUnits.length > 0 ){
        if(practiceType){
            cropUnits = loanObject.LoanCropUnits.filter(cu=>cu.Crop_Code == cropCode && cu.Crop_Practice_Type_Code == practiceType);
        }else{
            cropUnits = loanObject.LoanCropUnits.filter(cu=>cu.Crop_Code == cropCode);
        }
      
      cropUnits.forEach(cu => {
        let perProd = this.getPerProdForFarm(loanObject,cu.Farm_ID);
        totalAcres += cu.CU_Acres;
        shareAcres += (cu.CU_Acres*perProd)/100;

      });
    }
    if(totalAcres > 0){
      return (shareAcres/totalAcres)*100;
    }else{
      return 0;
    }
  }

  getPerProdForFarm(loanObject : loan_model,farmID){
    let farm : Loan_Farm;
    if(loanObject.Farms && loanObject.Farms.length > 0 ){
      farm = loanObject.Farms.find(f=>f.Farm_ID == farmID);
      return farm ? farm.Percent_Prod : 0;
    }else{
      return 0;
    }
  }
}
