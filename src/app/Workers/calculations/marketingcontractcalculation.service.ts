import { Injectable } from '@angular/core';
import { Loan_Marketing_Contract, loan_model } from '../../models/loanmodel';
import * as _ from "lodash";

@Injectable()
export class MarketingcontractcalculationService {

  constructor() { }

  // updateMarketingCalculation(localloanobject : loan_model){
  //   localloanobject.LoanMarketingContracts.forEach(contract => {
  //     this.updateMktValueAndContractPer(localloanobject, contract);
  //   });
  // }
   updateMktValueAndContractPer(localloanobject : loan_model, contract: Loan_Marketing_Contract) {
    contract.Market_Value = contract.Price * contract.Quantity;
    let supplyQuantity = this.getCropContract(localloanobject,contract.Crop_Code, 'IRR') + this.getCropContract(localloanobject,contract.Crop_Code, 'NIR');

    if(supplyQuantity){
      contract.Contract_Per = (contract.Quantity / supplyQuantity)*100;
    }else{
      contract.Contract_Per = 0;
    }
    
  }

  getCropContract(localloanobject : loan_model, cropCode : string, type : string){
    if(localloanobject.LoanCropUnits && localloanobject.CropYield && localloanobject.Farms){
        let totalCUAcres = _.sumBy(localloanobject.LoanCropUnits.filter(lcu=>lcu.Crop_Code === cropCode && lcu.Crop_Practice_Type_Code === type), 'CU_Acres');
        let totalCropYield = _.sumBy(localloanobject.CropYield.filter(cy=>cy.CropType === cropCode  && cy.IrNI === type), 'CropYield' );
        let totalPerProd = _.sumBy(localloanobject.Farms, 'Percent_Prod')  || 1;
        return totalCUAcres * totalCropYield * totalPerProd;
    }else{
      return 0;
    }
    
  }

  performPriceCalculation(localloanobject : loan_model){

    localloanobject.LoanCrops.forEach(crop =>{
      let matchingMC  = localloanobject.LoanMarketingContracts.find(mc=>mc.Crop_Code == crop.Crop_Code && mc.ActionStatus != 3);
      if(matchingMC){
        crop.Percent_booked = matchingMC.Contract_Per;
        crop.Marketing_Adj = (crop.Contract_Price - (crop.Basic_Adj + crop.Crop_Price))*(crop.Percent_booked/100);
        crop.Adj_Price = crop.Crop_Price + crop.Basic_Adj + crop.Marketing_Adj + crop.Rebate_Adj;
      }else{
        crop.Percent_booked = 0;
      }
    });

    // localloanobject.LoanMarketingContracts.forEach(mktContracts =>{
    //   let matchingCrop = localloanobject.LoanCrops.find(loanCrops=> loanCrops.Crop_Code === mktContracts.Crop_Code);
    //   if(matchingCrop){
    //     matchingCrop.Percent_booked = mktContracts.Contract_Per;
    //     matchingCrop.ActionStatus = 2;
    //   }
    // })

  }

}
