import { Injectable } from '@angular/core';
import { loan_model } from '../../models/loanmodel';
import { Loan_Crop_Unit } from '../../models/cropmodel';
import { forEach } from '@angular/router/src/utils/collection';
import { LoggingService } from '../../services/Logs/logging.service';
import * as _ from 'lodash';
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
      this.logging.checkandcreatelog(1, 'Calc_CropUnit', "LoanCalculation timetaken :" + (starttime - endtime).toString() + " ms");
      return this.input;
    }
    catch(e){
      this.logging.checkandcreatelog(1, 'Calc_CropUnit', e);
      return input;
    }
  }

  calculateAPHForCropYield(localLoanObject : loan_model){
    try{
      let starttime = new Date().getTime();
      let cropYields = localLoanObject.CropYield;
      if (cropYields) {
        cropYields.forEach(cy => {
          let sumOfAcresIntoAPH = 0;
          let sumOfAcres = 0;
          let cropUnits = localLoanObject.LoanCropUnits.filter(cu => cu.Crop_Code == cy.CropType && cu.Crop_Practice_Type_Code == cy.IrNI);
          if (cropUnits) {

            cropUnits.forEach(cu => {
              sumOfAcresIntoAPH += cu.CU_Acres * cu.Ins_APH;
              sumOfAcres += cu.CU_Acres;
            });
          }

          if (sumOfAcres && sumOfAcresIntoAPH) {
            cy.APH = sumOfAcresIntoAPH / sumOfAcres;
            cy.APH = parseFloat(cy.APH.toFixed(2));
          } else {
            cy.APH = 0;
          }

        });
      }

      let endtime = new Date().getTime();
      this.logging.checkandcreatelog(1, 'Calc_CropUnit_APH', "LoanCalculation timetaken :" + (endtime - starttime).toString() + " ms");
      return localLoanObject;
    }catch(e){
      this.logging.checkandcreatelog(1, 'Calc_CropUnit_APH', e);
      return localLoanObject;
    }
  }

  fillFCValuesforCropunits(input: loan_model) {
     
    try{
      let starttime = new Date().getTime();
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

          let crop_adj_price=input.LoanCrops.find(p=>p.Crop_Code==element.Crop_Code).Adj_Price;
          //Mkt Value
          try {
            //z price to be flipped to Adj_price
            // Ins_Aph flipped to Crop yield
            element.Mkt_Value = element.Ins_APH * element.CU_Acres * crop_adj_price * farm.Percent_Prod / 100;
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
              element.FC_ModifiedAPH = element.Ins_APH * insurancepolicy.Price;
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
            element.FC_Icevalue=0;
            element.FC_Staxvalue=0;
            element.FC_Scovalue=0;
            element.FC_Hmaxvalue=0;
            element.FC_Abcvalue=0;
            element.FC_Pcivalue=0;
            element.FC_Rampvalue=0;
            element.FC_Crophailvalue=0;
            subpolicies.forEach(subpolicy => {
              
              if (subpolicy.Ins_Type.toLowerCase() == "hmax") {
                //Hmax calculations
                try {
                  if (subpolicy.Lower_Limit != undefined && subpolicy.Lower_Limit <= insurancepolicy.Level) {
                    let band = subpolicy.Upper_Limit - subpolicy.Lower_Limit;
                    let CoveragetoMPCI = subpolicy.Upper_Limit - insurancepolicy.Level;
                    let HmaxlevelPerc = CoveragetoMPCI / 100 * (CoveragetoMPCI / band);
                    element.FC_HmaxPremium = subpolicy.Premium;
                    let deduct_pct = 0;
                    let deduct_amt = 0; // these are hardcoded values and will be aded to Db soon
                    // using insurance aph instead of CU_APH
                    element.FC_Hmaxvalue = ((((HmaxlevelPerc - (_.max([deduct_pct, (element.Ins_APH == 0 ? 0 : (deduct_amt / element.Ins_APH))]))) - (element.Ins_APH == 0 ? 0 : (subpolicy.Deduct / element.Ins_APH))) * element.Ins_APH * insurancepolicy.Price) - element.FC_HmaxPremium) * (element.CU_Acres) * element.FC_Insurance_Share / 100;
                    element.FC_Disc_Hmaxvalue=element.FC_Hmaxvalue * 85/100;
                  }
                  else {
                    element.FC_Hmaxvalue = 0;
                  }
                }
                catch{
                  element.FC_Hmaxvalue = 0;
                }
              }
              else if (subpolicy.Ins_Type.toLowerCase() == "sco") {
                //Starts here
                subpolicy.Upper_Limit = 86;
                try {
                  if (insurancepolicy.Level < subpolicy.Upper_Limit) {
                    let liability = insurancepolicy.Price * subpolicy.Yield;
                    let CoveragetoMPCI = subpolicy.Upper_Limit - insurancepolicy.Level;
                    element.FC_Scovalue = ((CoveragetoMPCI / 100 * liability) - subpolicy.Premium) * element.CU_Acres * element.FC_Insurance_Share / 100;
                    element.FC_Disc_Scovalue=element.FC_Scovalue * 80/100;
                  }
                  else
                    element.FC_Scovalue = 0;
                }
                catch{
                  element.FC_Scovalue = 0;
                }
              }
              else if (subpolicy.Ins_Type.toLowerCase() == "stax") {
                //Starts here
                try {
                  subpolicy.Upper_Limit = 90;
                  if (insurancepolicy.Level < subpolicy.Upper_Limit) {
                    let liability = insurancepolicy.Price * subpolicy.Yield * subpolicy.Prot_Factor * subpolicy.Yield_Pct / 100;
                    let CoveragetoMPCI = subpolicy.Upper_Limit - insurancepolicy.Level;
                    element.FC_Staxvalue = ((CoveragetoMPCI / 100 * liability) - subpolicy.Premium) * element.CU_Acres * element.FC_Insurance_Share / 100;
                    element.FC_Disc_Staxvalue=element.FC_Staxvalue * 80/100;
                  }
                  else
                    element.FC_Staxvalue = 0;
                }
                catch{
                  element.FC_Staxvalue = 0;
                }
              }
              else if (subpolicy.Ins_Type.toLowerCase() == "ramp") {
                try {
                  if (subpolicy.Lower_Limit != undefined && subpolicy.Lower_Limit <= insurancepolicy.Level) {
                    let band = subpolicy.Upper_Limit - subpolicy.Lower_Limit;
                    let CoveragetoMPCI = subpolicy.Upper_Limit - insurancepolicy.Level;
                    let RamplevelPerc = CoveragetoMPCI / 100 * (CoveragetoMPCI / band) * subpolicy.Price_Pct / 100 * subpolicy.Liability;
                    element.FC_RampPremium = subpolicy.Premium;
                    element.FC_Rampvalue = ((RamplevelPerc * element.Ins_APH * insurancepolicy.Price) - element.FC_RampPremium) * (element.CU_Acres) * element.FC_Insurance_Share / 100;
                    element.FC_Disc_Rampvalue=element.FC_Rampvalue * 85/100;
                  }
                  else {
                    element.FC_Rampvalue = 0;
                  }
                }
                catch{
                  element.FC_Rampvalue = 0;
                }
              }
              else if (subpolicy.Ins_Type.toLowerCase() == "ice") {
                subpolicy.Upper_Limit = 95;
                subpolicy.Lower_Limit = 85;
                try {
                  let deduct_pct = 5;
                  let deduct_amt = 0;
                  switch (subpolicy.Ins_SubType) {
                    case "BY":
                      subpolicy.Upper_Limit = 90;
                      subpolicy.Lower_Limit = 80;
                      deduct_pct = 10;
                      if (element.Crop_Code.toLowerCase() == "crn") //hardcoded values for Soy and Corn
                        deduct_amt = 10;
                      if (element.Crop_Code.toLowerCase() == "soy") //hardcoded values for Soy and Corn
                        deduct_amt = 6;
                      break;
                    case "BR":
                      subpolicy.Upper_Limit = 90;
                      subpolicy.Lower_Limit = 80;
                      deduct_pct = 10;
                      if (element.Crop_Code.toLowerCase() == "crn") //hardcoded values for Soy and Corn
                        deduct_amt = 10;
                      if (element.Crop_Code.toLowerCase() == "soy") //hardcoded values for Soy and Corn
                        deduct_amt = 6;
                      break;
                    case "CY":
                      if (element.Crop_Code.toLowerCase() == "crn") //hardcoded values for Soy and Corn
                        deduct_amt = 5;
                      if (element.Crop_Code.toLowerCase() == "soy") //hardcoded values for Soy and Corn
                        deduct_amt = 3;
                      break;
                    case "RR":
                      if (element.Crop_Code.toLowerCase() == "crn") //hardcoded values for Soy and Corn
                        deduct_amt = 5;
                      if (element.Crop_Code.toLowerCase() == "soy") //hardcoded values for Soy and Corn
                        deduct_amt = 3;
                      break;
                  }
                  //User inputs Processing here
                  if (subpolicy.Lower_Limit != undefined && subpolicy.Lower_Limit <= insurancepolicy.Level) {
                    let band = subpolicy.Upper_Limit - subpolicy.Lower_Limit;
                    let CoveragetoMPCI = subpolicy.Upper_Limit - insurancepolicy.Level;
                    let icelevelPerc = CoveragetoMPCI / 100 * (CoveragetoMPCI / band) * subpolicy.Yield_Pct / 100 * subpolicy.Price_Pct / 100;
                    element.FC_IcePremium = subpolicy.Premium;
                    // not using Liability as if now in calculation
                    element.FC_Icevalue = ((((icelevelPerc - (_.max([deduct_pct, (element.Ins_APH == 0 ? 0 : (deduct_amt / element.Ins_APH))]))) - (element.Ins_APH == 0 ? 0 : (subpolicy.Deduct / element.Ins_APH))) * element.Ins_APH * insurancepolicy.Price) - element.FC_IcePremium) * (element.CU_Acres) * element.FC_Insurance_Share / 100;
                    element.FC_Disc_Icevalue=element.FC_Icevalue * 85/100;
                  }
                  else {
                    element.FC_Icevalue = 0;
                  }
                }
                catch{
                  element.FC_Icevalue = 0;
                }
              }
              else if (subpolicy.Ins_Type.toLowerCase() == "abc") {
                try {
                  if (subpolicy.Lower_Limit != undefined && subpolicy.Lower_Limit <= insurancepolicy.Level) {
                    let band = subpolicy.Upper_Limit - subpolicy.Lower_Limit;
                    let CoveragetoMPCI = subpolicy.Upper_Limit - insurancepolicy.Level;
                    let AbclevelPerc = CoveragetoMPCI / 100 * (CoveragetoMPCI / band);
                    element.FC_AbcPremium = subpolicy.Premium;
                    // not using Liability as if now in calculation and change zprice to insadjusted price
                    element.FC_Abcvalue = ((AbclevelPerc * element.Ins_APH * insurancepolicy.Price) - element.FC_AbcPremium) * (element.CU_Acres) * element.FC_Insurance_Share / 100;
                    element.FC_Disc_Abcvalue=element.FC_Abcvalue * 85/100;
                  }
                  else {
                    element.FC_Abcvalue = 0;
                  }
                }
                catch{
                  element.FC_Abcvalue = 0;
                }
              }
              else if (subpolicy.Ins_Type.toLowerCase() == "pci") {

                try {
                  let array = [1, 2, 3, 4, 5];
                  let iccvalue = _.sumBy(input.LoanBudget.filter(p => p.Crop_Practice_ID == element.Crop_Practice_ID && array.includes(p.Expense_Type_ID)), "Total_Budget_Acre");
                  subpolicy.Icc=iccvalue;
                  let liability = iccvalue + subpolicy.FCMC;
                  element.FC_Pcivalue = (liability - subpolicy.Premium) * element.CU_Acres * element.FC_Insurance_Share / 100;
                  element.FC_Disc_Pcivalue=element.FC_Pcivalue * 85/100;
                  3
                }
                catch{
                  element.FC_Pcivalue = 0;
                }
              } 
              else if (subpolicy.Ins_Type.toLowerCase() == "crophail") {
                try {
                  let band = subpolicy.Upper_Limit - subpolicy.Lower_Limit;
                  let CoveragetoMPCI = subpolicy.Upper_Limit - insurancepolicy.Level;
                  let crophaillevelpct = CoveragetoMPCI * (CoveragetoMPCI / band) * subpolicy.Price_Pct;
                  if (subpolicy.Ins_SubType == "Basic") {
                    element.FC_Crophailvalue = (subpolicy.Liability - subpolicy.Premium) * element.CU_Acres * element.FC_Insurance_Share / 100;
                  }
                  if (subpolicy.Ins_SubType == "Prod Plan" || subpolicy.Ins_SubType == "Comp Plan") {
                    let deduct_pct = 0;
                    element.FC_Crophailvalue = ((element.Ins_APH * insurancepolicy.Price * (element.FC_Level1Perc - deduct_pct)) - subpolicy.Premium) * element.CU_Acres * element.FC_Insurance_Share / 100;
                  }
                  element.FC_Disc_Crophailvalue=element.FC_Crophailvalue * 80/100;
                }
                catch{
                  element.FC_Crophailvalue = 0;
                }
              }
            });
            
          }
          catch (ex) {

            console.error("Error in Cropunit Calculations")
            element.Mkt_Value = 0;
          }

        //Insurance Value
        try {
          
          element.Ins_Value = element.Ins_Value + element.FC_Icevalue + element.FC_Hmaxvalue +element.FC_Crophailvalue +element.FC_Scovalue +element.FC_Staxvalue + element.FC_Abcvalue + element.FC_Rampvalue+element.FC_Pcivalue;
          element.Disc_Ins_value = (element.Disc_Ins_value || 0 )+(element.FC_Disc_Icevalue || 0 )+(element.FC_Disc_Hmaxvalue || 0 )+(element.FC_Disc_Crophailvalue || 0 )+(element.FC_Disc_Scovalue || 0 )+(element.FC_Disc_Staxvalue+ element.FC_Disc_Abcvalue || 0 )+(element.FC_Disc_Rampvalue || 0 )+(element.FC_Disc_Pcivalue || 0); 
        }
        catch{
          element.Ins_Value = 0;
          console.error("Error in Cropunit Calculations fro ins value")
        }

          //CEI Value
          try {
            element.CEI_Value = element.Mkt_Value - element.Ins_Value;
            if(element.CEI_Value<0){
              element.CEI_Value=0;
            }
          }
          catch{
            element.CEI_Value = 0;
            console.error("Error in Cropunit Calculations fro CEI_Value")
          }
        
        }
      });
      

      //Loan Master
      if(input.LoanMaster && input.LoanMaster[0]){
        input.LoanMaster[0].Net_Market_Value_Insurance=_.sumBy(input.LoanCropUnits.filter(p=>!isNaN(p.Ins_Value)),"Ins_Value");
        input.LoanMaster[0].Disc_value_Insurance=_.sumBy(input.LoanCropUnits.filter(p=>!isNaN(p.Ins_Value)),"Disc_Ins_value");
      }

        input.LoanCropPractices.forEach(element => {
          var itemsincropunit=input.LoanCropUnits.filter(p=>p.Crop_Practice_ID==element.Crop_Practice_ID);
          itemsincropunit.forEach(crp => {
            let ppercent_Prod = input.Farms.find(p=>p.Farm_ID==crp.Farm_ID).Percent_Prod;
            element.LCP_Acres=element.LCP_Acres + (crp.CU_Acres * ppercent_Prod/100);
          });

          // element.FC_Agg_Mkt_Value=_.sumBy(input.LoanCropUnits,"Ins_Value");
          // element.FC_Agg_Disc_Mkt_Value=
          // element.FC_Agg_Disc_Ins_Value=
          // element.FC_Agg_Ins_Value=
          // element.FC_Agg_Disc_Cei_Value=

            element.FC_Ins_Value_Mpci=_.sumBy(itemsincropunit,"FC_MPCIvalue") + _.sumBy(itemsincropunit,"FC_Staxvalue") + _.sumBy(itemsincropunit,"FC_Scovalue") 
            element.FC_Disc_Ins_Value_Mpci=_.sumBy(itemsincropunit,"FC_Disc_MPCIvalue") + _.sumBy(itemsincropunit,"FC_Disc_Staxvalue") + _.sumBy(itemsincropunit,"FC_Disc_Scovalue") 

            element.FC_Ins_Value_Hmax= _.sumBy(itemsincropunit,"FC_Hmaxvalue");
            element.FC_Disc_Ins_Value_Hmax= _.sumBy(itemsincropunit,"FC_Disc_Hmaxvalue")
            
            element.FC_Ins_Value_Ramp= _.sumBy(itemsincropunit,"FC_Rampvalue");
            element.FC_Disc_Ins_Value_Ramp= _.sumBy(itemsincropunit,"FC_Disc_Rampvalue")

            element.FC_Ins_Value_Ice= _.sumBy(itemsincropunit,"FC_Icevalue");
            element.FC_Disc_Ins_Value_Ice= _.sumBy(itemsincropunit,"FC_Disc_Icevalue")

            element.FC_Ins_Value_Abc= _.sumBy(itemsincropunit,"FC_Abcvalue");
            element.FC_Disc_Ins_Value_Abc= _.sumBy(itemsincropunit,"FC_Disc_Abcvalue")

            element.FC_Ins_Value_Pci= _.sumBy(itemsincropunit,"FC_Pcivalue");
            element.FC_Disc_Ins_Value_Pci= _.sumBy(itemsincropunit,"FC_Disc_Pcivalue")

            element.FC_Ins_Value_Crophail= _.sumBy(itemsincropunit,"FC_Crophailvalue");
            element.FC_Disc_Ins_Value_Crophail= _.sumBy(itemsincropunit,"FC_Disc_Crophailvalue")

        });
        
      
      let endtime = new Date().getTime();
      this.logging.checkandcreatelog(1, 'Calc_CropUnit_FC', "LoanCalculation timetaken :" + (endtime - starttime).toString() + " ms");
      return input;
    }catch(e){
      this.logging.checkandcreatelog(1, 'Calc_CropUnit_FC', e);
      return input;
    }
  }

}
