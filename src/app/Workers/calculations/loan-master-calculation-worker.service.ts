import { Injectable } from '@angular/core';
import { loan_model, loan_borrower, borrower_model } from '../../models/loanmodel';
import { environment } from '../../../environments/environment.prod';

@Injectable()
export class LoanMasterCalculationWorkerService {
 

  //borrower Rating
  borrowerRatingstaticValues: any = {
    borrowerRating: ['*****', '****', '***', '**', '*'],
    FICOScore: [720, 700, 700, 650, 0],
    CPAFiancial: ['Yes', 'Yes', '', '', ''],
    threeYrsReturns: ['Yes', 'Yes', '', '', ''],
    bankruptcy: ['No', 'No', 'No', '', ''],
    judgement: ['No', 'No', 'No', '', ''],
    yearsFarming: [7, 5, 3, 0, 0],
    farmFinnacialRating: [100, 100, 0, 0, 0]
  }
  incomeConstant: Array<number> = [100, 90, 90, 90, 90];
  insuranceConstant: Array<number> = [115, 100, 100, 100, 100];
  discNetWorthConstant: Array<number> = [100, 100, 100, 100, 100];
  maxAmountConstant : Array<any> = [1000000, 500000, '-','-','-'];
  // borrower rating ends

  //farm financial
  farmFinancialStaticValues: any = {
    currentRatio: [1.50, 1.00, '>'],
    workingCapital: [0.50, 0.20, '>'],
    debtByAssets: [30.0, 70.0, '<'],
    debtByEquity: [42.0, 230.0, '<'],
    equityByAssets: [70.0, 30.0, '>'],
    ROA: [12.0, 3.0, '>'],
    operatingProfit: [25.0, 10.0, '>'],
    operatingByExpRev: [75.0, 85.0, '<'],
    interestByCashFlow: [12.0, 20.0, '<'],
  }
  //farm financial ends
  constructor() {

  }

  performLoanMasterCalcualtions(loanObject: loan_model) {

    if(loanObject.LoanMaster && loanObject.LoanMaster.length>0){
    let loanMaster = loanObject.LoanMaster[0];
    //loanMaster.Borrower_Farm_Financial_Rating = loanMaster.Borrower_Farm_Financial_Rating || 145;
    loanObject.Borrower.Borrower_3yr_Tax_Returns = loanObject.Borrower.Borrower_3yr_Tax_Returns ||1;
    //loanObject.Borrower.Borrower_CPA_financials = !!loanObject.LoanMaster[0].CPA_Prepared_Financials;
    loanMaster.Credit_Score = loanMaster.Credit_Score || 720;
    
    let FICOScore = loanMaster.Credit_Score;
    let CPAFiancial = loanObject.LoanMaster[0].CPA_Prepared_Financials ? 'Yes' : 'No';
    let threeYrsReturns = loanObject.Borrower.Borrower_3yr_Tax_Returns ? 'Yes' : 'No';
    let bankruptcy = loanMaster.Bankruptcy_Status ? 'Yes' : 'No';
    let judgement = loanMaster.Judgement ? 'Yes' : 'No';
    let yearsFarming = loanMaster.Year_Begin_Farming ? (new Date()).getFullYear() - loanMaster.Year_Begin_Farming : 0;
    let farmFinnacialRating = loanMaster.Borrower_Farm_Financial_Rating || '';

    let borrowerRatingStar = 0;
    for (let rating = 5; rating >= 1; rating--) {
      let ratingRequirement = this.getRatingRequirement(rating);

      if (FICOScore >= ratingRequirement.FICOScore
        && (!ratingRequirement.CPAFiancial || CPAFiancial === ratingRequirement.CPAFiancial)
        && (!ratingRequirement.threeYrsReturns || threeYrsReturns === ratingRequirement.threeYrsReturns)
        && (!ratingRequirement.bankruptcy || bankruptcy === ratingRequirement.bankruptcy)
        && (!ratingRequirement.judgement || judgement === ratingRequirement.judgement)
        && yearsFarming >= ratingRequirement.yearsFarming
        && farmFinnacialRating >= ratingRequirement.farmFinnacialRating
      ) {
        loanMaster.Borrower_Rating = rating;
        break;
      }

    }
  }
    

    return loanObject;
  }

  performDashboardCaclulation(localLoanObject : loan_model): any {
    if(localLoanObject.LoanMaster[0]){
      let loanMaster = localLoanObject.LoanMaster[0];
      loanMaster.Risk_Cushion_Amount = loanMaster.Disc_value_Insurance +loanMaster.Disc_CEI_Value + (0 + loanMaster.Ag_Pro_Requested_Credit) - 
                                      (loanMaster.ARM_Commitment  + loanMaster.Dist_Commitment+ loanMaster.Rate_Fee_Amount);
      loanMaster.Risk_Cushion_Amount = parseFloat(loanMaster.Risk_Cushion_Amount.toFixed(2)); 

      loanMaster.Risk_Cushion_Percent =(loanMaster.Risk_Cushion_Amount/loanMaster.ARM_Commitment)*100;
      loanMaster.Risk_Cushion_Percent = parseFloat(loanMaster.Risk_Cushion_Percent.toFixed(1));
      
      loanMaster.Return_Percent = (( loanMaster.Orgination_Fee_Amount + loanMaster.Service_Fee_Amount +
                                    (loanMaster.Rate_Percent * (225/365) * loanMaster.ARM_Commitment)
                                  )/loanMaster.ARM_Commitment)*100;
      loanMaster.Return_Percent = parseFloat(loanMaster.Return_Percent.toFixed(1)); 
      
      
      loanMaster.Cash_Flow_Amount = this.getRevanueThresholdValue(localLoanObject) -  (loanMaster.Total_Commitment + loanMaster.Dist_Commitment+ loanMaster.Rate_Fee_Amount);
      loanMaster.Cash_Flow_Amount = parseFloat(loanMaster.Cash_Flow_Amount.toFixed(2)); 

      loanMaster.Break_Even_Percent = ((loanMaster.ARM_Commitment + loanMaster.Dist_Commitment + loanMaster.Rate_Fee_Amount)/
                                      this.getRevanueThresholdValue(localLoanObject))*100;
      loanMaster.Break_Even_Percent = parseFloat(loanMaster.Break_Even_Percent.toFixed(1)); 

    }
    return localLoanObject;
  }

  getRatingRequirement(rating: number) {
    if (rating > 5 || rating < 1) {
      throw "Invalid rating passed";
    }
    let lookupIndex = 5 - rating;
    return {
      borrowerRating: this.borrowerRatingstaticValues.borrowerRating[lookupIndex],
      FICOScore: this.borrowerRatingstaticValues.FICOScore[lookupIndex],
      CPAFiancial: this.borrowerRatingstaticValues.CPAFiancial[lookupIndex],
      threeYrsReturns: this.borrowerRatingstaticValues.threeYrsReturns[lookupIndex],
      bankruptcy: this.borrowerRatingstaticValues.bankruptcy[lookupIndex],
      judgement: this.borrowerRatingstaticValues.judgement[lookupIndex],
      yearsFarming: this.borrowerRatingstaticValues.yearsFarming[lookupIndex],
      farmFinnacialRating: this.borrowerRatingstaticValues.farmFinnacialRating[lookupIndex],
    }


  }
  getRevanueThresholdValue(loanObject: loan_model) {
    let loanMaster = loanObject.LoanMaster[0];
    let temp = (loanMaster.Net_Market_Value_Crops || 0) + (loanMaster.Net_Market_Value_Stored_Crops || 0) + (loanMaster.Net_Market_Value_FSA || 0 )+ (loanMaster.Net_Market_Value_Livestock || 0) +
      (loanMaster.Net_Market_Value__Other || 0);
      //temp = parseFloat(temp.toFixed(2));
    return Math.round(temp);

  }

  getRevanueThresholdStaticValues(loanObject: loan_model) {
    let revanueThresholdValue = this.getRevanueThresholdValue(loanObject);
    return this.incomeConstant.map((val, index) => Math.round(revanueThresholdValue * val / 100));
  }


  getInsuranceThresholdValue(loanObject: loan_model) {
    let loanMaster = loanObject.LoanMaster[0];
    let tValue =  (loanMaster.Net_Market_Value_Insurance || 0) + (loanMaster.Net_Market_Value_Stored_Crops || 0) + (loanMaster.Net_Market_Value_FSA || 0) + (loanMaster.Net_Market_Value_Livestock || 0) +
      (loanMaster.Net_Market_Value__Other || 0);
    //tValue = parseFloat(tValue.toFixed(2));
    return Math.round(tValue);
  }

  getInsuranceThresholdStaticValue(loanObject: loan_model) {
    let maxCropLoanValue = this.getInsuranceThresholdValue(loanObject);
    return this.insuranceConstant.map((val, index) => Math.round(maxCropLoanValue * val / 100));
  }

  getMaxCropStaticValue(loanObject: loan_model){
    let rtStaticValue = this.getRevanueThresholdStaticValues(loanObject);
    let itStaticValue = this.getInsuranceThresholdStaticValue(loanObject);
    return rtStaticValue.map((values,index)=>Math.min(rtStaticValue[index], itStaticValue[index]))

  }

  getMaxCropLoanValue(loanObject: loan_model){
    let borrowerRating = loanObject.LoanMaster[0].Borrower_Rating;
    let mcStaticValue = this.getMaxCropStaticValue(loanObject);
    return borrowerRating>=1 && borrowerRating<=5 ? mcStaticValue[ 5 - parseInt(borrowerRating)] : 0;

  }

  getDiscNetWorthValue(loanObject: loan_model) {
    let loanMaster = loanObject.LoanMaster[0];
    return loanMaster.Total_Disc_Net_Worth;
  }

  getDiscWorthStaticValue(loanObject: loan_model) {
    let discWorthValue = this.getDiscNetWorthValue(loanObject);
    return this.discNetWorthConstant.map((val, index) => Math.round(discWorthValue * val / 100));
  }

  getAgProMaxAdditionStaticValue(loanObject: loan_model) {
    let discNetWorthStaticValue = this.getDiscWorthStaticValue(loanObject);
    return [Math.min( this.maxAmountConstant[0], discNetWorthStaticValue[0]), Math.min(this.maxAmountConstant[0], discNetWorthStaticValue[1]), '-', '-', '-']
  }


  getRating(ratio: number, params: Array<any>) {
    //let operator = params[2];
    let stable = params[1];
    let strong = params[0];
    let state = this.getState(ratio,params);
    let possible = this.getPossible(ratio, params);

    if (state == STATE.WEAK) {
      return ((ratio - stable) / (strong - stable) * possible)*100;
    } else {
      return ((stable - ratio) / (stable - strong) * possible)*100;
    }
  }


  getPossible(ratio: number, params: Array<any>){
    // let operator = params[2];
     let stable = params[1];
     let strong = params[0];
    let state = this.getState(ratio,params);
    if (state === STATE.WEAK) {
      return 1;
    } else {
      return 1;
    }
  }

  getState(ratio: number, params: Array<any>){
    let operator = params[2];
    let stable = params[1];
    let strong = params[0];

    if (operator === '>') {
      if(ratio >= strong){
        return STATE.STRONG;
      }else if(ratio < strong && ratio >=stable){
        return STATE.STABLE
      }else{
        return STATE.WEAK;
      }
    } else {
      if(ratio <= strong){
        return STATE.STRONG;
      }else if(ratio > strong && ratio <=stable){
        return STATE.STABLE
      }else{
        return STATE.WEAK;
      }
    }
  }


}

export enum STATE{
  STRONG='strong',
  STABLE = 'stable',
  WEAK ='weak',

}


