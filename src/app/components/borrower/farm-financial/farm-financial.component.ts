import { Component, OnInit } from '@angular/core';
import { loan_model } from '../../../models/loanmodel';
import { LocalStorageService } from 'ngx-webstorage';
import { LoanMasterCalculationWorkerService } from '../../../Workers/calculations/loan-master-calculation-worker.service';
import { environment } from '../../../../environments/environment.prod';
import { ValueType } from '../shared/cell-value/cell-value.component';

@Component({
  selector: 'app-farm-financial',
  templateUrl: './farm-financial.component.html',
  styleUrls: ['./farm-financial.component.scss']
})
export class FarmFinancialComponent implements OnInit {

  data: any;
  localloanobj: loan_model;
  constructor(private localstorageservice: LocalStorageService,
    private loanMasterCaculationWorker: LoanMasterCalculationWorkerService) { }

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

      let farmFinancialRatingValues  : FarmFinacialValueParams= {... this.getFormattedData(loanObject)};
      this.data = {
        liquidityAnalysis: [
          {
            text: 'Current Ratio',
            value: farmFinancialRatingValues.currentRatio,
            staticValues: this.loanMasterCaculationWorker.farmFinancialStaticValues.currentRatio,
            possible : 1.00,
            rating : this.loanMasterCaculationWorker.getRating(farmFinancialRatingValues.currentRatio,this.loanMasterCaculationWorker.farmFinancialStaticValues.currentRatio, 1.00)

          },
          {
            text: 'Working Capital',
            value: farmFinancialRatingValues.workingCapital,
            staticValues: this.loanMasterCaculationWorker.farmFinancialStaticValues.workingCapital,
            possible : 1.00,
            rating : this.loanMasterCaculationWorker.getRating(farmFinancialRatingValues.workingCapital,this.loanMasterCaculationWorker.farmFinancialStaticValues.workingCapital, 1.00)

          }],
          solvencyAnalysis : [{
            text: 'Debt/Assets',
            value: farmFinancialRatingValues.debtByAssets,
            staticValues: this.loanMasterCaculationWorker.farmFinancialStaticValues.debtByAssets,
            possible : 1.00,
            rating : this.loanMasterCaculationWorker.getRating(farmFinancialRatingValues.debtByAssets,this.loanMasterCaculationWorker.farmFinancialStaticValues.debtByAssets, 1.00),
            valueType : ValueType.PERCENTAGE,

          },
          {
            text: 'Equity/Assets',
            value: farmFinancialRatingValues.equityByAssets,
            staticValues: this.loanMasterCaculationWorker.farmFinancialStaticValues.equityByAssets,
            possible : 1.00,
            rating : this.loanMasterCaculationWorker.getRating(farmFinancialRatingValues.equityByAssets,this.loanMasterCaculationWorker.farmFinancialStaticValues.equityByAssets, 1.00),
            valueType : ValueType.PERCENTAGE,
          },
          {
            text: 'Debt/Equity',
            value: farmFinancialRatingValues.debtByEquity,
            staticValues: this.loanMasterCaculationWorker.farmFinancialStaticValues.debtByEquity,
            possible : 1.00,
            rating : this.loanMasterCaculationWorker.getRating(farmFinancialRatingValues.debtByEquity,this.loanMasterCaculationWorker.farmFinancialStaticValues.debtByEquity, 1.00),
            valueType : ValueType.PERCENTAGE,
          }],
          profitabilityAnalysis : [{
            text: 'ROA',
            value: farmFinancialRatingValues.ROA,
            staticValues: this.loanMasterCaculationWorker.farmFinancialStaticValues.ROA,
            possible : 1.00,
            rating : this.loanMasterCaculationWorker.getRating(farmFinancialRatingValues.ROA,this.loanMasterCaculationWorker.farmFinancialStaticValues.ROA, 1.00),
            valueType : ValueType.PERCENTAGE,
          },
          {
            text: 'Operating Profit',
            value: farmFinancialRatingValues.operatingProfit,
            staticValues: this.loanMasterCaculationWorker.farmFinancialStaticValues.operatingProfit,
            possible : 1.00,
            rating : this.loanMasterCaculationWorker.getRating(farmFinancialRatingValues.operatingProfit,this.loanMasterCaculationWorker.farmFinancialStaticValues.operatingProfit, 1.00),
            valueType : ValueType.PERCENTAGE,
          }],
          financialEfficiency : [{
            text: ' Operating Exp / Rev',
            value: farmFinancialRatingValues.operatingByExpRev,
            staticValues: this.loanMasterCaculationWorker.farmFinancialStaticValues.operatingByExpRev,
            possible : 1.00,
            rating : this.loanMasterCaculationWorker.getRating(farmFinancialRatingValues.operatingByExpRev,this.loanMasterCaculationWorker.farmFinancialStaticValues.operatingByExpRev, 1.00),
            valueType : ValueType.PERCENTAGE,
          },
          {
            text: 'Interest/Cashflow',
            value: farmFinancialRatingValues.interestByCashFlow,
            staticValues: this.loanMasterCaculationWorker.farmFinancialStaticValues.interestByCashFlow,
            possible : 1.00,
            rating : this.loanMasterCaculationWorker.getRating(farmFinancialRatingValues.interestByCashFlow,this.loanMasterCaculationWorker.farmFinancialStaticValues.interestByCashFlow, 1.00),
            valueType : ValueType.PERCENTAGE,
          }
        ]
      };
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
    farmFinancialRatingValues.ROA = 10.3;
    farmFinancialRatingValues.operatingProfit = 50.1;
    farmFinancialRatingValues.operatingByExpRev = 49.9;
    farmFinancialRatingValues.interestByCashFlow = 4.8;
    return farmFinancialRatingValues;
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
