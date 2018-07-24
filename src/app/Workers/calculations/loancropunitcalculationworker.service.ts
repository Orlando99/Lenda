import { Injectable } from '@angular/core';
import { loan_model } from '../../models/loanmodel';
import { Loan_Crop_Unit } from '../../models/cropmodel';
import { forEach } from '@angular/router/src/utils/collection';
import { LoggingService } from '../../services/Logs/logging.service';

@Injectable()
export class LoancropunitcalculationworkerService {
  public input: loan_model;
  constructor(private logging: LoggingService) { }
  prepare_crops_revenue() {

    for (let entry of this.input.LoanCropUnits) {
      entry.FC_Revenue = entry.CU_Acres * 200 * .95 * (entry.Z_Price + entry.Z_Basis_Adj + entry.Z_Marketing_Adj + entry.Z_Rebate_Adj);
    }
  }
  prepare_crops_subtotalacres() {
    this.input.LoanCropUnitFCvalues.FC_SubTotalAcres = this.input.LoanCropUnits.reduce(function (prev, cur) {
      return prev + cur.CU_Acres;
    }, 0);
  }
  prepare_crops_subtotalrevenue() {
    this.input.LoanCropUnitFCvalues.FC_SubtotalCropRevenue = this.input.LoanCropUnits.reduce(function (prev, cur) {
      return prev + cur.FC_Revenue;
    }, 0);
  }
  prepare_crops_totalrevenue() {
    this.input.LoanCropUnitFCvalues.FC_TotalRevenue = this.input.LoanCropUnitFCvalues.FC_SubtotalCropRevenue;
  }
  prepare_crops_totalbudget() {
    //still needs calculations
    this.input.LoanCropUnitFCvalues.FC_TotalBudget = 0;
  }
  prepare_crops_estimatedinterest() {
    //still needs calculations
    this.input.LoanCropUnitFCvalues.FC_EstimatedInterest = 0;
  }
  prepare_crops_totalcashflow() {
    this.input.LoanCropUnitFCvalues.FC_TotalCashFlow = this.input.LoanCropUnitFCvalues.FC_TotalRevenue - this.input.LoanCropUnitFCvalues.FC_TotalBudget - this.input.LoanCropUnitFCvalues.FC_EstimatedInterest
  }
  prepareLoancropunitmodel(input: loan_model): loan_model {
    try {
      this.input = input;
      let starttime = new Date().getMilliseconds();
      this.prepare_crops_revenue();
      this.prepare_crops_subtotalacres();
      this.prepare_crops_subtotalrevenue();
      this.prepare_crops_totalrevenue();
      this.prepare_crops_totalbudget();
      this.prepare_crops_estimatedinterest();
      this.prepare_crops_totalcashflow();
      let endtime = new Date().getMilliseconds();
      this.logging.checkandcreatelog(3, 'CalculationforCropunit', "LoanCalculation timetaken :" + (starttime - endtime).toString() + " ms");
      return this.input;
    }
    catch{
      return input;
    }
  }

  calculateAPHForCropYield(localLoanObject : loan_model){
    let cropYields = localLoanObject.CropYield;
    if(cropYields){
      cropYields.forEach(cy => {
        let sumOfAcresIntoAPH=0;
          let sumOfAcres=0;
        let cropUnits = localLoanObject.LoanCropUnits.filter(cu=>cu.Crop_Code == cy.CropType && cu.Crop_Practice_Type_Code == cy.IrNI);
        if(cropUnits){
          
          cropUnits.forEach(cu=>{
            sumOfAcresIntoAPH += cu.CU_Acres * cu.Ins_APH;
            sumOfAcres += cu.CU_Acres;
          });
        }

        if(sumOfAcres && sumOfAcresIntoAPH){
          cy.APH = sumOfAcresIntoAPH/sumOfAcres;
          cy.APH = parseFloat(cy.APH.toFixed(2));
        }else{
          cy.APH = 0;
        }
        
      });
    }
    return localLoanObject;
  }
  fillFCValuesforCropunits(input: loan_model) {
    input.LoanCropUnits.forEach(element => {
      let farm = input.Farms.find(p => p.Farm_ID == element.Farm_ID);
      if (farm != undefined && farm != null) {
        element.FC_CountyID = farm.Farm_County_ID;
        element.FC_FSN = farm.FSN;
        element.FC_Rating = farm.Rated;
        element.FC_Section = farm.Section;
      }
      let insurancepolicy = input.InsurancePolicies.find(p => p.Crop_Practice_Id == element.Crop_Practice_ID && p.County_Id == farm.Farm_County_ID);

      if (insurancepolicy != undefined && insurancepolicy != null) {
        element.FC_Ins_Policy_ID = insurancepolicy.Policy_id;
        element.FC_Ins_Unit = insurancepolicy.Unit;
        element.FC_Primary_limit = insurancepolicy.Level;


        //Mkt Value
        try {
          //z price to be flipped to Adj_price
          // Ins_Aph flipped to Crop yield
          element.Mkt_Value = element.Ins_APH * element.CU_Acres * element.Z_Price * farm.Percent_Prod / 100;
          element.Disc_Mkt_Value = element.Mkt_Value * 47.5 / 100;
          if (insurancepolicy.MPCI_Subplan == "ARH") {
            //Then MPCI Leveli %= Loan_InsurancePolicy.Level_PCT* Loan_InsurancePolicy.Yield_PCT * Loan_InsurancePolicy.Price_PCT
            element.FC_Level1Perc = insurancepolicy.Level;
          }
          else {
            element.FC_Level1Perc = insurancepolicy.Level;
          }
          if (farm.Permission_To_Insure == 1) {
            element.FC_Insurance_Share = 100;
          }
          else {
            element.FC_Insurance_Share = farm.Percent_Prod;
          }
          //APH Calculations for APH Modification
          if (insurancepolicy.MPCI_Subplan == "ARH") {
            //Change to CU_APH
            element.FC_ModifiedAPH = element.Ins_APH;
          }
          else {
            element.FC_ModifiedAPH = element.Ins_APH * element.Z_Price;
          }
          ///MPCI VALUES  is ins value
          element.FC_MPCIvalue = ((element.FC_ModifiedAPH * element.FC_Level1Perc / 100) - insurancepolicy.Premium) * element.CU_Acres * element.FC_Insurance_Share / 100;
          element.FC_Disc_MPCI_value = element.FC_MPCIvalue * 85 / 100;
          //Insurance value --sum of all insurance mpci values
          element.Ins_Value = element.FC_MPCIvalue;
          //MPCI type only as if now--We dont have secondary 
          element.Disc_Ins_value = element.FC_Disc_MPCI_value;
          
          // Insurance Sub Policies Calculations
          let subpolicies = insurancepolicy.Subpolicies;
          subpolicies.forEach(subpolicy => {
            
            if (subpolicy.Ins_Type.toLowerCase() == "hmax") {
              //Hmax calculations
              if (subpolicy.Lower_Limit != undefined && subpolicy.Lower_Limit <= insurancepolicy.Level) {
                let band = subpolicy.Upper_Limit - subpolicy.Lower_Limit;
                let CoveragetoMPCI = subpolicy.Upper_Limit - insurancepolicy.Level;
                let HmaxlevelPerc = CoveragetoMPCI / 100 * (CoveragetoMPCI / band);
                element.FC_HmaxPremium = 0;
                element.FC_Hmaxvalue = ((HmaxlevelPerc * element.Ins_APH * element.Z_Price) - element.FC_HmaxPremium) * (element.CU_Acres) * element.FC_Insurance_Share / 100;
              }
              else {
                element.FC_Hmaxvalue = 0;
              }
            }
            else if (subpolicy.Ins_Type.toLowerCase() == "sco") {
              //Starts here
              subpolicy.Upper_Limit = 86;
              if (insurancepolicy.Level < subpolicy.Upper_Limit) {
                let liability = element.Z_Price * subpolicy.Yield;
                let CoveragetoMPCI = subpolicy.Upper_Limit - insurancepolicy.Level;
                //premium is not included in Calculation
                element.FC_Scovalue = CoveragetoMPCI / 100 * liability * element.CU_Acres * element.FC_Insurance_Share / 100;
              }
              else
                element.FC_Scovalue = 0;
            }
            else if (subpolicy.Ins_Type.toLowerCase() == "stax") {
              //Starts here
              subpolicy.Upper_Limit = 90;
              if (insurancepolicy.Level < subpolicy.Upper_Limit) {
                // 1 is protection factor not yet added and 100 is STAXYield_PCT
                let liability = element.Z_Price * subpolicy.Yield * 1 * 100/100;
                let CoveragetoMPCI = subpolicy.Upper_Limit - insurancepolicy.Level;
                //premium is not included in Calculation
                element.FC_Staxvalue = CoveragetoMPCI / 100 * liability * element.CU_Acres * element.FC_Insurance_Share / 100;
              }
              else
                element.FC_Staxvalue = 0;
            }
          });

        }
        catch (ex) {
          
          console.error("Error in Cropunit Calculations")
          element.Mkt_Value = 0;
        }

        //Insurance Value
        try {
          element.Ins_Value = element.Mkt_Value * element.FC_Primary_limit / 100;
        }
        catch{
          element.Ins_Value = 0;
          console.error("Error in Cropunit Calculations fro ins value")
        }

        //CEI Value
        try {
          element.CEI_Value = element.Mkt_Value - element.Ins_Value;
        }
        catch{
          element.CEI_Value = 0;
          console.error("Error in Cropunit Calculations fro CEI_Value")
        }
      }
    });

    return input;
  }
}
