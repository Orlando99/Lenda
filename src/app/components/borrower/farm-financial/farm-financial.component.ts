import { Component, OnInit } from '@angular/core';
import { loan_model } from '../../../models/loanmodel';
import { LocalStorageService } from 'ngx-webstorage';
import { LoanMasterCalculationWorkerService } from '../../../Workers/calculations/loan-master-calculation-worker.service';
import { environment } from '../../../../environments/environment.prod';
import { ValueType } from '../shared/cell-value/cell-value.component';
import { LoancalculationWorker } from '../../../Workers/calculations/loancalculationworker';

@Component({
  selector: 'app-farm-financial',
  templateUrl: './farm-financial.component.html',
  styleUrls: ['./farm-financial.component.scss']
})
export class FarmFinancialComponent implements OnInit {

  data: any;
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
    if(this.localloanobj!=null && this.localloanobj!=undefined)
    this.binddata(this.localloanobj);

  }


  private binddata(loanObject : loan_model) {
    if (this.localloanobj && this.localloanobj.LoanMaster && this.localloanobj.LoanMaster[0] && this.localloanobj.Borrower) {

      let entities = ['currentRatio','workingCapital','debtByAssets','debtByEquity','equityByAssets','ROA','operatingProfit','operatingByExpRev','interestByCashFlow'];
      
      let farmFinancialRatingValues  : FarmFinacialValueParams= {... this.getFormattedData(loanObject)};

      let ffStaticValue = this.loanMasterCaculationWorker.farmFinancialStaticValues;

      let ffPossibleObject = this.getPossibleData(entities,farmFinancialRatingValues,ffStaticValue);
      let ffPossibleData = ffPossibleObject.ffPossibleValues;
      let ffPossibleTotal = ffPossibleObject.totalPossibles;
      let ffStateData = this.getStateData(entities,farmFinancialRatingValues,ffStaticValue);
      let ffRatingObject = this.getRatingData(entities,farmFinancialRatingValues,ffStaticValue);
      let ffRatingData = ffRatingObject.ffRatingValues;
      let ffRatingTotal = ffRatingObject.totalRatings? parseFloat(ffRatingObject.totalRatings.toFixed(1)) : 0;
      
      this.data = {
        liquidityAnalysis: [
          {
            text: 'Current Ratio',
            value: farmFinancialRatingValues.currentRatio,
            staticValues: ffStaticValue.currentRatio,
            possible : ffPossibleData.currentRatio,
            rating : ffRatingData.currentRatio,
            state : ffStateData.currentRatio,

          },
          {
            text: 'Working Capital',
            value: farmFinancialRatingValues.workingCapital,
            staticValues: ffStaticValue.workingCapital,
            possible : ffPossibleData.workingCapital,
            rating : ffRatingData.workingCapital,
            state : ffStateData.workingCapital,
            
          }],
          solvencyAnalysis : [{
            text: 'Debt/Assets',
            value: farmFinancialRatingValues.debtByAssets,
            staticValues: ffStaticValue.debtByAssets,
            possible : ffPossibleData.debtByAssets,
            rating : ffRatingData.debtByAssets,
            valueType : ValueType.PERCENTAGE,
            state : ffStateData.debtByAssets,

          },
          {
            text: 'Equity/Assets',
            value: farmFinancialRatingValues.equityByAssets,
            staticValues: ffStaticValue.equityByAssets,
            possible : ffPossibleData.equityByAssets,
            rating : ffRatingData.equityByAssets,
            valueType : ValueType.PERCENTAGE,
            state : ffStateData.equityByAssets,
          },
          {
            text: 'Debt/Equity',
            value: farmFinancialRatingValues.debtByEquity,
            staticValues: ffStaticValue.debtByEquity,
            possible : ffPossibleData.debtByEquity,
            rating : ffRatingData.debtByEquity,
            valueType : ValueType.PERCENTAGE,
            state : ffStateData.debtByEquity,
          }],
          profitabilityAnalysis : [{
            text: 'ROA',
            value: farmFinancialRatingValues.ROA,
            staticValues: ffStaticValue.ROA,
            possible : ffPossibleData.ROA,
            rating : ffRatingData.ROA,
            valueType : ValueType.PERCENTAGE,
            state : ffStateData.ROA
          },
          {
            text: 'Operating Profit',
            value: farmFinancialRatingValues.operatingProfit,
            staticValues: ffStaticValue.operatingProfit,
            possible : ffPossibleData.operatingProfit,
            rating : ffRatingData.operatingProfit,
            valueType : ValueType.PERCENTAGE,
            state : ffStateData.operatingProfit,
          }],
          financialEfficiency : [{
            text: ' Operating Exp / Rev',
            value: farmFinancialRatingValues.operatingByExpRev,
            staticValues: ffStaticValue.operatingByExpRev,
            possible : ffPossibleData.operatingByExpRev,
            rating : ffRatingData.operatingByExpRev,
            valueType : ValueType.PERCENTAGE,
            state : ffStateData.operatingByExpRev,
          },
          {
            text: 'Interest/Cashflow',
            value: farmFinancialRatingValues.interestByCashFlow,
            staticValues: ffStaticValue.interestByCashFlow,
            possible : ffPossibleData.interestByCashFlow,
            rating : ffRatingData.interestByCashFlow,
            valueType : ValueType.PERCENTAGE,
            state : ffStateData.interestByCashFlow,
          },
          {
            text: 'Total Farm Financial Rating',
            value: '',
            staticValues: ['','',''],
            possible : ffPossibleTotal,
            rating : ffRatingTotal,
            valueType : ValueType.PERCENTAGE,
            state : '',
          }
        ]
      };

      if(this.localloanobj.LoanMaster[0].Borrower_Farm_Financial_Rating != ffRatingTotal){
        this.localloanobj.LoanMaster[0].Borrower_Farm_Financial_Rating = ffRatingTotal;        
        this.loanCalculationWorker.performcalculationonloanobject(this.localloanobj,false);
      }
    }
  }

  getFormattedData(loanObject : loan_model){
    let loanMaster = loanObject.LoanMaster[0];
    let borrower = loanObject.Borrower;
    let farmFinancialRatingValues = new FarmFinacialValueParams();
    farmFinancialRatingValues.currentRatio = (loanMaster.Current_Assets / loanMaster.Current_Liabilities);
    farmFinancialRatingValues.workingCapital = ((loanMaster.Current_Assets - loanMaster.Current_Liabilities)/this.loanMasterCaculationWorker.getRevanueThresholdValue(loanObject));
    farmFinancialRatingValues.debtByAssets = ((loanMaster.Total_Liabilities/ loanMaster.Total_Assets)*100);
    farmFinancialRatingValues.equityByAssets = (((loanMaster.Total_Assets - loanMaster.Total_Liabilities)/loanMaster.Total_Assets)*100);
    farmFinancialRatingValues.debtByEquity = ((loanMaster.Total_Liabilities)/ (loanMaster.Total_Assets - loanMaster.Total_Liabilities)*100);
    farmFinancialRatingValues.ROA = ((loanMaster.Cash_Flow_Amount/loanMaster.Total_Assets)*100);
    farmFinancialRatingValues.operatingProfit = ((loanMaster.Cash_Flow_Amount/this.loanMasterCaculationWorker.getRevanueThresholdValue(loanObject))*100);
    farmFinancialRatingValues.operatingByExpRev = ((loanMaster.Total_Commitment + 
                                                  (loanMaster.Rate_Percent/100 * (255/365)*  loanMaster.Dist_Commitment)+
                                                  (loanMaster.Rate_Percent/100 * (255/365)*  loanMaster.ARM_Commitment)) /
                                                  this.loanMasterCaculationWorker.getRevanueThresholdValue(loanObject))*100;
    if(loanMaster.Cash_Flow_Amount){
      farmFinancialRatingValues.interestByCashFlow =  (((loanMaster.Rate_Percent/100 * (255/365)*  loanMaster.Dist_Commitment)+
                                                    (loanMaster.Rate_Percent/100 * (255/365)*  loanMaster.ARM_Commitment))/
                                                    loanMaster.Cash_Flow_Amount)*100;
    }else{
      farmFinancialRatingValues.interestByCashFlow =0;
    }                                                  
    
    return farmFinancialRatingValues;  
  }

  getPossibleData(entities : Array<string>, farmFinancialRatingValues : FarmFinacialValueParams,ffStaticValue){
    let ffPossibleValues = new FarmFinacialValueParams();
    let totalPossibles = 0;
    entities.forEach(entity =>{
      ffPossibleValues[entity] = this.loanMasterCaculationWorker.getPossible(farmFinancialRatingValues[entity],ffStaticValue[entity]);
      totalPossibles += ffPossibleValues[entity];
    });

    return {
      ffPossibleValues : ffPossibleValues,
      totalPossibles : totalPossibles
    }
  }

  getStateData(entities : Array<string>, farmFinancialRatingValues : FarmFinacialValueParams,ffStaticValue){
    let ffStateValues = new FarmFinacialValueParams();
    
    entities.forEach(entity =>{
      ffStateValues[entity] = this.loanMasterCaculationWorker.getState(farmFinancialRatingValues[entity],ffStaticValue[entity]);
    });

    return ffStateValues;
  }

  getRatingData(entities : Array<string>, farmFinancialRatingValues : FarmFinacialValueParams,ffStaticValue){
    let ffRatingValues = new FarmFinacialValueParams();
    let totalRatings = 0;
    entities.forEach(entity =>{
      ffRatingValues[entity] = this.loanMasterCaculationWorker.getRating(farmFinancialRatingValues[entity],ffStaticValue[entity]);
      totalRatings += ffRatingValues[entity];
    });

    return {
      ffRatingValues : ffRatingValues,
      totalRatings : totalRatings
    }
  }
}

export class FarmFinacialValueParams{
  currentRatio : number;
  workingCapital : number;
  debtByAssets : number;
  debtByEquity : number;
  equityByAssets : number;
  ROA : number;
  operatingProfit : number;
  operatingByExpRev : number;
  interestByCashFlow : number;
  totalFarmFinacialRating : number;
}
