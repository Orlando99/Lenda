import { Component, OnInit } from '@angular/core';
import { loan_model } from '../../../models/loanmodel';
import { LocalStorageService } from 'ngx-webstorage';
import { LoggingService } from '../../../services/Logs/logging.service';
import { environment } from '../../../../environments/environment.prod';
import { LoancalculationWorker } from '../../../Workers/calculations/loancalculationworker';

@Component({
  selector: 'app-projectedincome',
  templateUrl: './projectedincome.component.html',
  styleUrls: ['./projectedincome.component.scss']
})
export class ProjectedincomeComponent implements OnInit {
  private localloanobject: loan_model = new loan_model();
  public allDataFetched = false;
  public cropRevenue: Array<CropRevenueModel> = [];
  public totalAcres;
  public NetCropRevenue;
  Net_Market_Value_Livestock;
  Net_Market_Value_Stored_Crops;
  Net_Market_Value__Other;
  Net_Market_Value_FSA;
  Total_Additional_Revenue;
  Total_Revenue;
  Total_Expense_Budget;
  Estimated_Interest;
  Total_CashFlow;

  //to track whether the storing the json attempted or not, otehrwise it will go in infinite look with observer
  //as we have to call the performcalculationonloanobject function in the routine of the preparedData which is being called from
  //observer
  isStorageAttempted :boolean=false; 
  
  constructor(public localstorageservice: LocalStorageService, public logging: LoggingService, public loanCalculationsService: LoancalculationWorker) { }
  ngOnInit() {
    this.localstorageservice.observe(environment.loankey).subscribe(res => {
      if (res != undefined && res != null) {
        // this.logging.checkandcreatelog(1,'Projected Income',"LocalStorage updated");
        this.localloanobject = res;
        this.allDataFetched = true;
        this.prepareData();
      }
    })
    this.getdataforgrid();
  }
  getdataforgrid() {

    let obj: any = this.localstorageservice.retrieve(environment.loankey);
    // this.logging.checkandcreatelog(1,'Projected Income',"LocalStorage retrieved");
    if (obj != null && obj != undefined) {
      this.localloanobject = obj;
      if (this.localloanobject && this.localloanobject.LoanMaster && this.localloanobject.LoanMaster[0]) {
        this.localloanobject.LoanMaster[0].FC_Total_Revenue =0;
      }
      this.allDataFetched = true;
    }
    this.prepareData();

  }

  prepareData() {
    if (this.localloanobject && this.localloanobject.LoanCrops) {
      this.cropRevenue = [];
      this.localloanobject.LoanCrops.forEach(crop => {
        let cropRevenue: CropRevenueModel = new CropRevenueModel();
        cropRevenue.Name = crop.Crop_Code;
        cropRevenue.Acres = crop.Acres.toFixed(1);
        cropRevenue.CropYield = parseInt(crop.W_Crop_Yield.toFixed(0));
        cropRevenue.Share = crop.LC_Share.toFixed(1);
        cropRevenue.Price = crop.Crop_Price;
        cropRevenue.Basic_Adj = crop.Basic_Adj;
        cropRevenue.Marketing_Adj = crop.Marketing_Adj;
        cropRevenue.Rebate_Adj = crop.Rebate_Adj;
        cropRevenue.Revenue = crop.Revenue;
        this.cropRevenue.push(cropRevenue);
      });

      if (this.localloanobject && this.localloanobject.LoanMaster && this.localloanobject.LoanMaster[0]) {
        let loanMaster = this.localloanobject.LoanMaster[0];
        this.totalAcres = loanMaster.Total_Crop_Acres ? loanMaster.Total_Crop_Acres.toFixed(1) : 0;
        this.NetCropRevenue = loanMaster.Net_Market_Value_Crops ? parseInt(loanMaster.Net_Market_Value_Crops.toFixed(0)) : 0;
        this.Net_Market_Value_Livestock = loanMaster.Net_Market_Value_Livestock || 0;
        this.Net_Market_Value_Stored_Crops = loanMaster.Net_Market_Value_Stored_Crops || 0;
        this.Net_Market_Value__Other = loanMaster.Net_Market_Value__Other || 0;
        this.Net_Market_Value_FSA = loanMaster.Net_Market_Value_FSA || 0;
        this.Total_Additional_Revenue = this.Net_Market_Value_Livestock + this.Net_Market_Value_FSA + this.Net_Market_Value__Other + this.Net_Market_Value_Stored_Crops;
        this.Total_Revenue = this.NetCropRevenue + this.Total_Additional_Revenue;
        this.Total_Revenue = parseInt(this.Total_Revenue.toFixed(0));
        this.Total_Expense_Budget = loanMaster.Total_Commitment ? parseInt(loanMaster.Total_Commitment.toFixed(0)) :0;
        this.Estimated_Interest = loanMaster.Rate_Fee_Amount ? parseInt(loanMaster.Rate_Fee_Amount.toFixed(0)) : 0;
        this.Total_CashFlow = parseInt(this.Total_Revenue.toFixed(0)) - parseInt(this.Total_Expense_Budget.toFixed(0)) - parseInt(this.Estimated_Interest.toFixed(0));

        if (!this.localloanobject.LoanMaster[0].FC_Total_Revenue && !this.isStorageAttempted) {
          //it will only run one time. handled using isStorageAttempted
          this.localloanobject.LoanMaster[0].FC_Total_Revenue = this.Total_Revenue;
          this.isStorageAttempted = true;
          this.loanCalculationsService.performcalculationonloanobject(this.localloanobject, false);
          
        }
        
      }
    }
  }



}

class CropRevenueModel {
  Name: string;
  Acres: string;
  CropYield: number;
  Share: string;
  Price: number;
  Basic_Adj: number;
  Marketing_Adj: number;
  Rebate_Adj: number;
  Revenue: number;
}
