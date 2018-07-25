import { Injectable } from '@angular/core';
import { loan_model, loan_borrower, borrower_model } from '../../models/loanmodel';
import { environment } from '../../../environments/environment.prod';
import { LoggingService } from '../../services/Logs/logging.service';
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
  // borrower rating ends

  //farm financial
  farmFinancialStaticValues: any = {
    currentRatio: [1.50, 1.00, '>'],
    workingCapital: [0.50, 0.20, '>'],
    debtByAssets: [30.0, 70.0, '<'],
    debtByEquity: [70.0, 30.0, '>'],
    equityByAssets: [42.0, 230.0, '<'],
    ROA: [12.0, 3.0, '>'],
    operatingProfit: [25.0, 10.0, '>'],
    operatingByExpRev: [75.0, 85.0, '<'],
    interestByCashFlow: [12.0, 20.0, '<'],
  }
  //farm financial ends
  constructor(public logging: LoggingService) { }

  performLoanMasterCalcualtions(loanObject: loan_model) {
    let starttime = new Date().getTime();
    if(loanObject.LoanMaster && loanObject.LoanMaster.length>0){
    let loanMaster = loanObject.LoanMaster[0];
    loanMaster.Borrower_Farm_Financial_Rating = loanMaster.Borrower_Farm_Financial_Rating || 145;
    loanObject.Borrower.Borrower_3yr_Tax_Returns = loanObject.Borrower.Borrower_3yr_Tax_Returns || 1;
    loanObject.Borrower.Borrower_CPA_financials = loanObject.Borrower.Borrower_CPA_financials || 1;
    loanMaster.Credit_Score = loanMaster.Credit_Score || 720;
    
    let FICOScore = loanMaster.Credit_Score;
    let CPAFiancial = loanObject.Borrower.Borrower_CPA_financials ? 'Yes' : 'No';
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
    let endtime = new Date().getTime();
    this.logging.checkandcreatelog(3, 'Calc_LoanMaster_1', "LoanCalculation timetaken :" + (endtime - starttime).toString() + " ms");
  }
    

    return loanObject;
  }


  getRatingRequirement(rating: number) {
    let starttime = new Date().getTime();
    if (rating > 5 || rating < 1) {
      throw "Invalid rating passed";
    }
    let lookupIndex = 5 - rating;
    let endtime = new Date().getTime();
    this.logging.checkandcreatelog(3, 'Calc_LoanMaster_2', "LoanCalculation timetaken :" + (endtime - starttime).toString() + " ms");
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
    let starttime = new Date().getTime();
    let loanMaster = loanObject.LoanMaster[0];
    let temp = loanMaster.Net_Market_Value_Crops || 0 + loanMaster.Net_Market_Value_Stored_Crops || 0 + loanMaster.Net_Market_Value_FSA || 0 + loanMaster.Net_Market_Value_Livestock || 0 +
      loanMaster.Net_Market_Value__Other || 0;
    
    let endtime = new Date().getTime();
    this.logging.checkandcreatelog(3, 'Calc_LoanMaster_3', "LoanCalculation timetaken :" + (endtime - starttime).toString() + " ms");

    return temp;

  }

  getRevanueThresholdStaticValues(loanObject: loan_model) {
    let starttime = new Date().getTime();

    let revanueThresholdValue = this.getRevanueThresholdValue(loanObject);

    let endtime = new Date().getTime();
    this.logging.checkandcreatelog(3, 'Calc_LoanMaster_4', "LoanCalculation timetaken :" + (endtime - starttime).toString() + " ms");

    return this.incomeConstant.map((val, index) => Math.round(revanueThresholdValue * val / 100));
  }


  getMaxCropLoanValue(loanObject: loan_model) {
    let starttime = new Date().getTime();
    let loanMaster = loanObject.LoanMaster[0];
    let endtime = new Date().getTime();
    this.logging.checkandcreatelog(3, 'Calc_LoanMaster_5', "LoanCalculation timetaken :" + (endtime - starttime).toString() + " ms");
    return loanMaster.Net_Market_Value_Insurance || 0 + loanMaster.Net_Market_Value_Stored_Crops || 0 + loanMaster.Net_Market_Value_FSA || 0 + loanMaster.Net_Market_Value_Livestock || 0 +
      loanMaster.Net_Market_Value__Other || 0;

  }

  getMaxCropLoanStaticValues(loanObject: loan_model) {
    let starttime = new Date().getTime();
    let maxCropLoanValue = this.getMaxCropLoanValue(loanObject);
    let endtime = new Date().getTime();
    this.logging.checkandcreatelog(3, 'Calc_LoanMaster_6', "LoanCalculation timetaken :" + (endtime - starttime).toString() + " ms");
    return this.insuranceConstant.map((val, index) => Math.round(maxCropLoanValue * val / 100));
  }

  getDiscNetWorthValue(loanObject: loan_model) {
    let starttime = new Date().getTime();
    let loanMaster = loanObject.LoanMaster[0];
    let endtime = new Date().getTime();
    this.logging.checkandcreatelog(3, 'Calc_LoanMaster_7', "LoanCalculation timetaken :" + (endtime - starttime).toString() + " ms");
    return loanMaster.Net_Worth_Disc_Amount;
  }

  getDiscWorthStaticValue(loanObject: loan_model) {
    let starttime = new Date().getTime();
    let discWorthValue = this.getDiscNetWorthValue(loanObject);
    let endtime = new Date().getTime();
    this.logging.checkandcreatelog(3, 'Calc_LoanMaster_8', "LoanCalculation timetaken :" + (endtime - starttime).toString() + " ms");
    return this.discNetWorthConstant.map((val, index) => Math.round(discWorthValue * val / 100));
  }

  getAgProMaxAdditionStaticValue(loanObject: loan_model) {
    let starttime = new Date().getTime();
    let maxCropStaticValues = this.getMaxCropLoanStaticValues(loanObject);
    let discNetWorthStaticValue = this.getDiscWorthStaticValue(loanObject);
    let endtime = new Date().getTime();
    this.logging.checkandcreatelog(3, 'Calc_LoanMaster_9', "LoanCalculation timetaken :" + (endtime - starttime).toString() + " ms");
    return [Math.min(maxCropStaticValues[0], discNetWorthStaticValue[0]), Math.min(maxCropStaticValues[1], discNetWorthStaticValue[1]), '-', '-', '-']
  }


  getRating(ratio: number, params: Array<any>, possible: number) {
    let starttime = new Date().getTime();
    let operator = params[2];
    let stable = params[1];
    let strong = params[0];

    let endtime = new Date().getTime();
    this.logging.checkandcreatelog(3, 'Calc_LoanMaster_10', "LoanCalculation timetaken :" + (endtime - starttime).toString() + " ms");

    if (operator === '>') {
      return (ratio - stable) / (strong - stable) * possible * 100;
    } else {
      return (stable - ratio) / (stable - strong) * possible * 100;
    }
  }


}


