import { Injectable } from '@angular/core';
import { loan_model, loan_borrower, borrower_model } from '../../models/loanmodel';
import { environment } from '../../../environments/environment.prod';

@Injectable()
export class LoanMasterCalculationWorkerService {

  staticValues: any = {
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

  constructor() {

  }

  performLoanMasterCalcualtions(loanObject: loan_model) {
    let loanMaster= loanObject.LoanMaster[0];
    loanMaster.Borrower_Farm_Financial_Rating = loanMaster.Borrower_Farm_Financial_Rating || 145.8;
    loanObject.Borrower.Borrower_3yr_Tax_Returns = loanObject.Borrower.Borrower_3yr_Tax_Returns || 1;
    loanObject.Borrower.Borrower_CPA_financials = loanObject.Borrower.Borrower_CPA_financials  || 1;
    loanMaster.Credit_Score = loanMaster.Credit_Score || 720;
    loanMaster.Borrower_Farm_Financial_Rating = 148.5;

    let FICOScore = loanMaster.Credit_Score;
    let CPAFiancial = loanObject.Borrower.Borrower_CPA_financials ? 'Yes' : 'No';
    let threeYrsReturns = loanObject.Borrower.Borrower_3yr_Tax_Returns ? 'Yes' : 'No';
    let bankruptcy = loanMaster.Bankruptcy_Status ? 'Yes' : 'No';
    let judgement = loanMaster.Judgement ? 'Yes' : 'No';
    let yearsFarming = loanMaster.Year_Begin_Farming ? (new Date()).getFullYear() -loanMaster.Year_Begin_Farming : 0;
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

    return loanObject;
  }


  getRatingRequirement(rating: number) {
    if (rating > 5 || rating < 1) {
      throw "Invalid rating passed";
    }
    let lookupIndex = 5 - rating;
    return {
      borrowerRating: this.staticValues.borrowerRating[lookupIndex],
      FICOScore: this.staticValues.FICOScore[lookupIndex],
      CPAFiancial: this.staticValues.CPAFiancial[lookupIndex],
      threeYrsReturns: this.staticValues.threeYrsReturns[lookupIndex],
      bankruptcy: this.staticValues.bankruptcy[lookupIndex],
      judgement: this.staticValues.judgement[lookupIndex],
      yearsFarming: this.staticValues.yearsFarming[lookupIndex],
      farmFinnacialRating: this.staticValues.farmFinnacialRating[lookupIndex],
    }


  }
  getRevanueThresholdValue(loanObject : loan_model) {
    let loanMaster= loanObject.LoanMaster[0];
    let temp = loanMaster.Net_Market_Value_Crops || 0 + loanMaster.Net_Market_Value_Stored_Crops || 0 + loanMaster.Net_Market_Value_FSA || 0 + loanMaster.Net_Market_Value_Livestock || 0 +
      loanMaster.Net_Market_Value__Other || 0;
    return temp;

  }

  getRevanueThresholdStaticValues(loanObject : loan_model) {
    let revanueThresholdValue = this.getRevanueThresholdValue(loanObject);
    return this.incomeConstant.map((val, index) => Math.round(revanueThresholdValue * val / 100));
  }


  getMaxCropLoanValue(loanObject : loan_model) {
    let loanMaster= loanObject.LoanMaster[0];
    return loanMaster.Net_Market_Value_Insurance || 0 + loanMaster.Net_Market_Value_Stored_Crops || 0 + loanMaster.Net_Market_Value_FSA || 0 + loanMaster.Net_Market_Value_Livestock || 0 +
      loanMaster.Net_Market_Value__Other || 0;

  }

  getMaxCropLoanStaticValues(loanObject : loan_model) {
    let maxCropLoanValue = this.getMaxCropLoanValue(loanObject);
    return this.insuranceConstant.map((val, index) => Math.round(maxCropLoanValue * val / 100));
  }

  getDiscNetWorthValue(loanObject : loan_model) {
    let loanMaster= loanObject.LoanMaster[0];
    return loanMaster.Net_Worth_Disc_Amount;
  }

  getDiscWorthStaticValue(loanObject : loan_model) {
    let discWorthValue = this.getDiscNetWorthValue(loanObject);
    return this.discNetWorthConstant.map((val, index) => Math.round(discWorthValue * val / 100));
  }

  getAgProMaxAdditionStaticValue(loanObject : loan_model) {
    let maxCropStaticValues = this.getMaxCropLoanStaticValues(loanObject);
    let discNetWorthStaticValue = this.getDiscWorthStaticValue(loanObject);
    return [Math.min(maxCropStaticValues[0], discNetWorthStaticValue[0]), Math.min(maxCropStaticValues[1], discNetWorthStaticValue[1]), '-', '-', '-']
  }



}


