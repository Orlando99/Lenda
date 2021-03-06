import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { loan_model } from '../../../models/loanmodel';
import { environment } from '../../../../environments/environment.prod';
import { LoanMasterCalculationWorkerService } from '../../../Workers/calculations/loan-master-calculation-worker.service';
import { ValueType } from '../shared/cell-value/cell-value.component';
import { LoancalculationWorker } from '../../../Workers/calculations/loancalculationworker';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit {

  data: any={};
  agProReqCredit : number;
  localloanobj: loan_model;
  constructor(private localstorageservice: LocalStorageService,
    private loanMasterCaculationWorker: LoanMasterCalculationWorkerService,
    private loanCalculationWorker : LoancalculationWorker) { }

  ngOnInit() {
    this.localstorageservice.observe(environment.loankey).subscribe(res=>{
      if(res!=null)
      {
       this.localloanobj = res;
        this.binddata(this.localloanobj);
      }
    })

    this.localloanobj = this.localstorageservice.retrieve(environment.loankey);
    if(this.localloanobj!=null && this.localloanobj!=undefined){
      this.binddata(this.localloanobj);
      this.agProReqCredit = this.localloanobj.LoanMaster[0].Ag_Pro_Requested_Credit;
    }
    
  }


  private binddata(loanObject : loan_model) {
    if (this.localloanobj && this.localloanobj.LoanMaster && this.localloanobj.LoanMaster[0] && this.localloanobj.Borrower) {
      
      let borrowerRatingValues  : BorrowerRatingParams= {... this.getFormattedData(loanObject)};
      this.data = {
        partOne: [
          {
            text: 'Borrower Rating',
            value: borrowerRatingValues.borrowerRating,
            staticValues: this.loanMasterCaculationWorker.borrowerRatingstaticValues.borrowerRating

          },
          {
            text: 'FICO Score',
            value: borrowerRatingValues.FICOScore,
            staticValues: this.loanMasterCaculationWorker.borrowerRatingstaticValues.FICOScore
          },
          {
            text: 'CPA Financials',
            value: borrowerRatingValues.CPAFiancial,
            staticValues: this.loanMasterCaculationWorker.borrowerRatingstaticValues.CPAFiancial

          },
          {
            text: '3yrs Tax Returns',
            value: borrowerRatingValues.threeYrsReturns,
            staticValues: this.loanMasterCaculationWorker.borrowerRatingstaticValues.threeYrsReturns
          },
          {
            text: 'Bankruptcy',
            value: borrowerRatingValues.bankruptcy,
            staticValues: this.loanMasterCaculationWorker.borrowerRatingstaticValues.bankruptcy
          },
          {
            text: 'Judgement',
            value: borrowerRatingValues.judgement,
            staticValues: this.loanMasterCaculationWorker.borrowerRatingstaticValues.judgement
          },
          {
            text: 'Years Farming',
            value: borrowerRatingValues.yearsFarming,
            staticValues: this.loanMasterCaculationWorker.borrowerRatingstaticValues.yearsFarming
          },
          {
            text: 'Farm Finacial Rating',
            value: borrowerRatingValues.farmFinnacialRating,
            staticValues: this.loanMasterCaculationWorker.borrowerRatingstaticValues.farmFinnacialRating,
          }
        ],
        partTwo: [
          {
            text: 'Income Constant %',
            value: '',
            staticValues: this.loanMasterCaculationWorker.incomeConstant,
            valueType : ValueType.PERCENTAGE,
          },
          {
            text: 'Revanue Threshold',
            value: this.loanMasterCaculationWorker.getRevanueThresholdValue(loanObject),
            staticValues: this.loanMasterCaculationWorker.getRevanueThresholdStaticValues(loanObject),
            valueType : ValueType.AMOUNT,
          },
          {
            text: 'Insurance Constant %',
            value: '',
            staticValues:  this.loanMasterCaculationWorker.insuranceConstant,
            valueType : ValueType.PERCENTAGE,

          },
          {
            text: 'Insurace Threshold',
            value: this.loanMasterCaculationWorker.getInsuranceThresholdValue(loanObject),
            staticValues: this.loanMasterCaculationWorker.getInsuranceThresholdStaticValue(loanObject),
            valueType : ValueType.AMOUNT,
          },
          {
            text: 'Max Crop Loan',
            value: this.loanMasterCaculationWorker.getMaxCropLoanValue(loanObject),
            staticValues: this.loanMasterCaculationWorker.getMaxCropStaticValue(loanObject),
            valueType : ValueType.AMOUNT,
            hightlightRow: true
          },
        ],
        partThree: [
          {
            text: 'Max Amount Constant',
            value: '',
            staticValues: this.loanMasterCaculationWorker.maxAmountConstant,
            valueType : ValueType.AMOUNT,
          },
          {
            text: 'Disc Net Worth Constant %',
            value: '',
            staticValues:  this.loanMasterCaculationWorker.discNetWorthConstant,
            valueType : ValueType.PERCENTAGE,
          },
          {
            text: 'Disc Net Worth',
            value: this.loanMasterCaculationWorker.getDiscNetWorthValue(loanObject),
            staticValues: this.loanMasterCaculationWorker.getDiscWorthStaticValue(loanObject),
            valueType : ValueType.AMOUNT,
          },
          {
            text: 'Ag-Pro Max Addition',
            value: '-', // when changing it to som real value, Make sure to consider in LoanMasterCalculationWorkerService.performDashboardCaclulation
            staticValues: this.loanMasterCaculationWorker.getAgProMaxAdditionStaticValue(loanObject),
            valueType : ValueType.AMOUNT,
            hightlightRow: true
          }
        ]
      };
    }
  }

  getFormattedData(loanObject : loan_model){
    let loanMaster = loanObject.LoanMaster[0];
    let borrowerRatingValues = new BorrowerRatingParams();
    borrowerRatingValues.borrowerRating = "*".repeat(loanMaster.Borrower_Rating || 0);
    borrowerRatingValues.FICOScore = loanMaster.Credit_Score;
    borrowerRatingValues.CPAFiancial = loanMaster.CPA_Prepared_Financials ? 'Yes' : 'No'; //pulling the data from loan master instead of borrower
    borrowerRatingValues.threeYrsReturns = loanObject.Borrower.Borrower_3yr_Tax_Returns ? 'Yes' : 'No';
    borrowerRatingValues.bankruptcy = loanMaster.Previously_Bankrupt ? 'Yes' : 'No';
    borrowerRatingValues.judgement = loanMaster.Judgement ? 'Yes' : 'No';
    borrowerRatingValues.yearsFarming = loanMaster.Year_Begin_Farming ? (new Date()).getFullYear() - loanMaster.Year_Begin_Farming : 0;
    borrowerRatingValues.farmFinnacialRating = loanMaster.Borrower_Farm_Financial_Rating || '';
    return borrowerRatingValues;  
  }

  updateLocalStorage(){
    
    this.localloanobj.LoanMaster[0].Ag_Pro_Requested_Credit = this.agProReqCredit || 0;
    this.loanCalculationWorker.performcalculationonloanobject(this.localloanobj);
  }

  isUnachievedRating(rating){
    if(this.localloanobj && this.localloanobj.LoanMaster){
      if(rating > this.localloanobj.LoanMaster[0].Borrower_Rating){
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  }
}

 class BorrowerRatingParams {
  borrowerRating: string;
  FICOScore: number
  CPAFiancial: string;
  threeYrsReturns: string
  bankruptcy: string;
  judgement: string;
  yearsFarming: number;
  farmFinnacialRating: string;
  
}
