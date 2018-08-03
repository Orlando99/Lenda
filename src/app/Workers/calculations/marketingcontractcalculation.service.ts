import { Injectable } from '@angular/core';
import { Loan_Marketing_Contract, loan_model } from '../../models/loanmodel';
import * as _ from "lodash";
import { LoggingService } from '../../services/Logs/logging.service';

@Injectable()
export class MarketingcontractcalculationService {

  constructor(public logging: LoggingService) { }

  // updateMarketingCalculation(localloanobject : loan_model){
  //   localloanobject.LoanMarketingContracts.forEach(contract => {
  //     this.updateMktValueAndContractPer(localloanobject, contract);
  //   });
  // }
   updateMktValueAndContractPer(localloanobject : loan_model, contract: Loan_Marketing_Contract) {
    let starttime = new Date().getTime();
    contract.Market_Value = contract.Price * contract.Quantity;
    let supplyQuantity = this.getCropContract(localloanobject,contract.Crop_Code, 'IRR') + this.getCropContract(localloanobject,contract.Crop_Code, 'NIR');

    if(supplyQuantity){
      contract.Contract_Per = (contract.Quantity / supplyQuantity)*100;
    }else{
      contract.Contract_Per = 0;
    }
    let endtime = new Date().getTime();
    this.logging.checkandcreatelog(3, 'Calc_CrpContract_1', "LoanCalculation timetaken :" + (endtime - starttime).toString() + " ms");
    
  }

  getCropContract(localloanobject : loan_model, cropCode : string, type : string){
    let starttime = new Date().getTime();
    if(localloanobject.LoanCropUnits && localloanobject.CropYield && localloanobject.Farms){

      let totalCUAcres= 0;
      let filteredCropUnits = localloanobject.LoanCropUnits.filter(lcu=>lcu.Crop_Code === cropCode && lcu.Crop_Practice_Type_Code === type);
      if(filteredCropUnits && filteredCropUnits.length > 0){
        filteredCropUnits.forEach(cu=>{
          let cuFarm = localloanobject.Farms.find(f=>f.Farm_ID == cu.Farm_ID);
          if(cuFarm){
            totalCUAcres += cu.CU_Acres * ((cuFarm.Percent_Prod || 100)/100);
          }
        })
      }

      let totalCropYield = 0
      let selectedCY = localloanobject.CropYield.find(cy=>cy.CropType === cropCode  && cy.IrNI === type);
      if(selectedCY){
        totalCropYield = selectedCY.CropYield;
      }
        let endtime = new Date().getTime();
        this.logging.checkandcreatelog(3, 'Calc_CrpContract_2', "LoanCalculation timetaken :" + (endtime - starttime).toString() + " ms");
        return totalCUAcres * totalCropYield;
    }else{
      return 0;
    }
    
  }

  performPriceCalculation(localloanobject : loan_model){
    let starttime = new Date().getTime();
    localloanobject.LoanCrops.forEach(crop =>{
      let matchingMC  = localloanobject.LoanMarketingContracts.find(mc=>mc.Crop_Code == crop.Crop_Code && mc.ActionStatus != 3);
      if(matchingMC){
        crop.Percent_booked = matchingMC.Contract_Per;
        crop.Contract_Price = matchingMC.Price;
        crop.Contract_Qty = matchingMC.Quantity;
        //the same caclulation is in price component, which should be shisted to common place
        crop.Marketing_Adj = (crop.Contract_Price - (crop.Basic_Adj + crop.Crop_Price))*(crop.Percent_booked/100);
        crop.Marketing_Adj = crop.Marketing_Adj ? parseFloat(crop.Marketing_Adj.toFixed(2)) : 0;
        crop.Adj_Price = (crop.Crop_Price || 0) + (crop.Basic_Adj || 0) + (crop.Marketing_Adj ||0) + (crop.Rebate_Adj || 0);
      }else{
        crop.Percent_booked = 0;
        crop.Contract_Price = 0;
        crop.Contract_Qty = 0;
        crop.Marketing_Adj =0;
        crop.Adj_Price = (crop.Crop_Price || 0) + (crop.Basic_Adj || 0) + (crop.Marketing_Adj ||0) + (crop.Rebate_Adj || 0);
        
      }
    });
    let endtime = new Date().getTime();
    this.logging.checkandcreatelog(3, 'Calc_CrpContract_3', "LoanCalculation timetaken :" + (endtime - starttime).toString() + " ms");
    // localloanobject.LoanMarketingContracts.forEach(mktContracts =>{
    //   let matchingCrop = localloanobject.LoanCrops.find(loanCrops=> loanCrops.Crop_Code === mktContracts.Crop_Code);
    //   if(matchingCrop){
    //     matchingCrop.Percent_booked = mktContracts.Contract_Per;
    //     matchingCrop.ActionStatus = 2;
    //   }
    // })

  }

}
