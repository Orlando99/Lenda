import { Injectable } from '@angular/core';
import { loan_model } from '../../models/loanmodel';
import { Loan_Crop_Unit } from '../../models/cropmodel';
import { forEach } from '@angular/router/src/utils/collection';

@Injectable()
export class LoancropunitcalculationworkerService {
  public input:loan_model;
  constructor() { }
  prepare_crops_revenue(){
    
    for(let entry of this.input.LoanCropUnits){
      entry.FC_Revenue=entry.CU_Acres * 200 * .95 *(entry.Z_Price+entry.Z_Basis_Adj+entry.Z_Marketing_Adj+entry.Z_Rebate_Adj);
    }
  }
  prepare_crops_subtotalacres(){
    this.input.LoanCropUnitFCvalues.FC_SubTotalAcres=this.input.LoanCropUnits.reduce(function(prev, cur) {
      return prev + cur.CU_Acres;
    }, 0);
  }
  prepare_crops_subtotalrevenue(){
    this.input.LoanCropUnitFCvalues.FC_SubtotalCropRevenue=this.input.LoanCropUnits.reduce(function(prev, cur) {
      return prev + cur.FC_Revenue;
    }, 0);
  }
  prepare_crops_totalrevenue(){
    this.input.LoanCropUnitFCvalues.FC_TotalRevenue= this.input.LoanCropUnitFCvalues.FC_SubtotalCropRevenue;
  }
  prepare_crops_totalbudget(){
    //still needs calculations
    this.input.LoanCropUnitFCvalues.FC_TotalBudget= 0;
  }
  prepare_crops_estimatedinterest(){
    //still needs calculations
    this.input.LoanCropUnitFCvalues.FC_EstimatedInterest=0 ;
  }
  prepare_crops_totalcashflow (){
    this.input.LoanCropUnitFCvalues.FC_TotalCashFlow=this.input.LoanCropUnitFCvalues.FC_TotalRevenue- this.input.LoanCropUnitFCvalues.FC_TotalBudget-this.input.LoanCropUnitFCvalues.FC_EstimatedInterest
  }
  prepareLoancropunitmodel(input:loan_model):loan_model{
    try{
    this.input=input;
    this.prepare_crops_revenue();
    this.prepare_crops_subtotalacres();
    this.prepare_crops_subtotalrevenue();
    this.prepare_crops_totalrevenue();
    this.prepare_crops_totalbudget();
    this.prepare_crops_estimatedinterest();
    this.prepare_crops_totalcashflow();
    return this.input;
    }
    catch{
      return input;
    }
  }
}
