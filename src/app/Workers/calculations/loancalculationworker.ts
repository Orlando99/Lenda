import { Injectable } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { observeOn } from 'rxjs/operators';
import { environment } from '../../../environments/environment.prod';
import { loan_model } from '../../models/loanmodel';
import { Borrowercalculationworker } from './borrowercalculationworker.service';
import { Borrowerincomehistoryworker } from './borrowerincomehistoryworker.service';
import { LoggingService } from '../../services/Logs/logging.service';
import { LoancropunitcalculationworkerService } from './loancropunitcalculationworker.service';
import { LoancrophistoryService } from './loancrophistory.service';
import { FarmcalculationworkerService } from './farmcalculationworker.service';
import { AssociationcalculationworkerService } from './associationcalculationworker.service';
import { MAT_MENU_DEFAULT_OPTIONS } from '@angular/material';
import { Collateralcalculationworker } from './collateralcalculationworker.service';
import { QuestionscalculationworkerService } from './questionscalculationworker.service';
import { LoanMasterCalculationWorkerService } from './loan-master-calculation-worker.service';
import { LoancroppracticeworkerService } from './loancroppracticeworker.service';
import { InsurancecalculationworkerService } from './insurancecalculationworker.service';
import { OverallCalculationServiceService } from './overall-calculation-service.service';
import { MarketingcontractcalculationService } from './marketingcontractcalculation.service';
import { OptimizercalculationService } from './optimizercalculationservice.service';
import * as _ from 'lodash'



@Injectable()
export class LoancalculationWorker {
  constructor(
    private localst: LocalStorageService,
    private borrowerworker: Borrowercalculationworker,
    private borrowerincomehistory: Borrowerincomehistoryworker,
    private loancropunitworker: LoancropunitcalculationworkerService,
    private loancrophistoryworker: LoancrophistoryService,
    private farmcalculation: FarmcalculationworkerService,
    private collateralcalculation: Collateralcalculationworker,
    private questionscalculations: QuestionscalculationworkerService,
    private loanMasterCalcualtions: LoanMasterCalculationWorkerService,
    private overallCalculationService: OverallCalculationServiceService,
    // private associationcalculation:AssociationcalculationworkerService,
    private loancroppracticeworker: LoancroppracticeworkerService,
    private insuranceworker: InsurancecalculationworkerService,
    private associationcalculation: AssociationcalculationworkerService,
    public logging: LoggingService,
    private marketingContractService : MarketingcontractcalculationService,
    private optimizercaluclations: OptimizercalculationService
  ) { }

  //#region  OLD CODE CALCULATIONS
  //  performcalculation1onloanobject(localloanobj: loan_model, recalculate?: boolean) {
  //   if (recalculate == undefined) {
  //     recalculate = true; // by default we are taking that it needs calculation
  //   }
  //   if (recalculate) {
  //     console.log("Calculation Started");
  //     let starttime = new Date().getTime();
  //     console.log(starttime);
  //     this.logging.checkandcreatelog(3, 'Calculationforloan', "LoanCalculation Started");
  //     if (localloanobj.Borrower != null)
  //       localloanobj.Borrower = this.borrowerworker.prepareborrowermodel(localloanobj.Borrower);
  //     if (localloanobj.LoanCropUnits != null)
  //       localloanobj = this.loancropunitworker.prepareLoancropunitmodel(localloanobj);
  //     if (localloanobj.CropYield != null)
  //       localloanobj = this.loancrophistoryworker.prepareLoancrophistorymodel(localloanobj);
  //     if (localloanobj.Farms != null)
  //       localloanobj = this.farmcalculation.prepareLoanfarmmodel(localloanobj);
  //     if (localloanobj.LoanCollateral != null)
  //       localloanobj = this.collateralcalculation.preparecollateralmodel(localloanobj);
  //     if (localloanobj.LoanQResponse != null)
  //       localloanobj = this.questionscalculations.performcalculationforquestionsupdated(localloanobj);
  //     localloanobj.LoanMaster = localloanobj.LoanMaster;
  //     localloanobj.LoanBudget = localloanobj.LoanBudget;
  //     localloanobj.DashboardStats = localloanobj.DashboardStats;
  //     localloanobj.lasteditrowindex = localloanobj.lasteditrowindex;
  //     localloanobj.srccomponentedit = localloanobj.srccomponentedit;
  //     //localloanobj=this.associationcalculation.prepareLoanassociationmodel(localloanobj);
  //     console.log("Calculation Ended");
  //     let endtime = new Date().getTime();
  //     this.logging.checkandcreatelog(3, 'Calculationforloan', "LoanCalculation timetaken :" + (endtime - starttime).toString() + " ms");


  //     console.log("Time taken :" + (starttime - endtime).toString() + " ms");
  //   }
  //   // At End push the new obj with new caluclated values into localstorage and emit value changes
  //   this.localst.store(environment.loankey, localloanobj);
  //   if (recalculate) {
  //     console.log("object updated");
  //     this.logging.checkandcreatelog(3, 'Calculationforloan', "Local Storage updated");
  //   }
  //   else
  //     console.log("object updated without calculations");

  // }
  //#endregion

  performcalculationonloanobject(localloanobj: loan_model, recalculate?: boolean) {
    if (recalculate == undefined) {
      recalculate = true; // by default we are taking that it needs calculation
    }
    if (recalculate) {
      console.log("Calculation Started");
      let starttime = new Date().getTime();
      console.log(starttime);
      this.logging.checkandcreatelog(3, 'Calculationforloan', "LoanCalculation Started");

      //STEP 1 -- BORROWER CALCULATIONS
      if (localloanobj.Borrower != null)
        localloanobj.Borrower = this.borrowerworker.prepareborrowermodel(localloanobj.Borrower);
      if (localloanobj.BorrowerIncomeHistory !== null)
        localloanobj = this.borrowerworker.prepareborrowerincomehistorymodel(localloanobj);

      //STEP 2 -- CROP LEVEL CALCULATIONS
      if (localloanobj.CropYield != null) {
        localloanobj = this.loancrophistoryworker.prepareLoancrophistorymodel(localloanobj);
        localloanobj = this.loancroppracticeworker.performcalculations(localloanobj);
      }
      if (localloanobj.LoanCropUnits)
      {
        localloanobj = this.loancropunitworker.prepareLoancropunitmodel(localloanobj);
        localloanobj=this.loancropunitworker.fillFCValuesforCropunits(localloanobj);
        localloanobj = this.loancropunitworker.calculateAPHForCropYield(localloanobj);
      }
      //STEP 3 --- FARM CALCULATIONS
      if (localloanobj.Farms != null)
        localloanobj = this.farmcalculation.prepareLoanfarmmodel(localloanobj);

      //STEP 4 --- INSURANCE POLICIES  
      localloanobj = this.insuranceworker.performcalculations(localloanobj);

      //STEP 5 --- BUDGET CALCULATIONS
      try {
        if(localloanobj.LoanBudget && localloanobj.LoanBudget.length > 0){
        for (let i = 0; i < localloanobj.LoanBudget.length; i++) {
          let currentBudget = localloanobj.LoanBudget[i];
          let cropPractice = localloanobj.LoanCropPractices.find(cp => cp.Crop_Practice_ID === currentBudget.Crop_Practice_ID);
          if (cropPractice != undefined && cropPractice != null) {
            currentBudget.ARM_Budget_Crop = currentBudget.ARM_Budget_Acre * cropPractice.LCP_Acres;
            currentBudget.Distributor_Budget_Crop = currentBudget.Distributor_Budget_Acre * cropPractice.LCP_Acres;
            currentBudget.Third_Party_Budget_Crop = currentBudget.Third_Party_Budget_Acre * cropPractice.LCP_Acres;
            currentBudget.Total_Budget_Crop_ET = currentBudget.Total_Budget_Acre * cropPractice.LCP_Acres;
          }
        }
        // propogations to Loan master table 
        
        localloanobj.LoanMaster[0].ARM_Commitment=_.sumBy(localloanobj.LoanBudget,'ARM_Budget_Crop');
        localloanobj.LoanMaster[0].Dist_Commitment=_.sumBy(localloanobj.LoanBudget,'Distributor_Budget_Crop');
        localloanobj.LoanMaster[0].Third_Party_Credit=_.sumBy(localloanobj.LoanBudget,'Third_Party_Budget_Crop');
        localloanobj.LoanMaster[0].Total_Commitment=_.sumBy(localloanobj.LoanBudget,'Total_Budget_Crop_ET');
        localloanobj.LoanMaster[0].ActionStatus=2;
      }
      } catch (e) {
        console.error("ERROR IN BUDGET CALCULATION" + JSON.stringify(e));

      }
      //localloanobj.LoanBudget = localloanobj.LoanBudget;

      //STEP 6 --- COLLATERAL CALCULATIONS
      if (localloanobj.LoanCollateral != null) {
        localloanobj = this.associationcalculation.prepareLoanassociationmodel(localloanobj);
        localloanobj = this.collateralcalculation.preparecollateralmodel(localloanobj);
      }

      // STEP 7 --- QUESTIONS CALCULATIONS
      if (localloanobj.LoanQResponse != null)
        localloanobj = this.questionscalculations.performcalculationforquestionsupdated(localloanobj);

      // STEP 8 --- MASTER CALCULATIONS
      if (localloanobj.LoanMaster !== null) {
        localloanobj = this.loanMasterCalcualtions.performLoanMasterCalcualtions(localloanobj);
        localloanobj = this.overallCalculationService.balancesheet_calc(localloanobj);
      }

      // STEP 9 --- OPTIMIZER CALCULATIONS

        // STEP 10 --- Marketing Contract Calculations
        if(localloanobj.LoanMarketingContracts && localloanobj.LoanCrops){

          this.marketingContractService.performPriceCalculation(localloanobj);
        }

        //TODO-SANKET : should be remove
        // localloanobj =  this.budgetService.caculateTotalsBeforeStore(localloanobj);
        //  ;
        //REMOVE ENDS
      if (localloanobj.LoanCropUnits != null && localloanobj.LoanCropPractices != null) {
        localloanobj = this.optimizercaluclations.performcalculations(localloanobj);
      }

      //TODO-SANKET : should be remove
      // localloanobj =  this.budgetService.caculateTotalsBeforeStore(localloanobj);
      //  ;
      //REMOVE ENDS

      //   if(!localloanobj.LoanCropPractices || localloanobj.LoanCropPractices.length ===0){

      //     //TODO-SANKET - remove static initializer and get it from api
      //     localloanobj.LoanCropPractices= [
      //       {
      //         Loan_Crop_Practice_ID : 1,
      //          Loan_Full_ID : '000001-000',
      //          Crop_Practice_ID : 2,
      //          LCP_APH : 200,
      //          LCP_Acres : 100.2,
      //          LCP_ARM_Budget : 10000,
      //          LCP_Distributer_Budget :20000,
      //          LCP_Third_Party_Budget:30000,
      //          LCP_Notes: 'Notes',
      //          LCP_Status: 1,
      //          ActionStatus : 0
      //      },
      //      {
      //       Loan_Crop_Practice_ID : 2,
      //        Loan_Full_ID : '000001-000',
      //        Crop_Practice_ID : 6,
      //        LCP_APH : 120,
      //        LCP_Acres : 100.3,
      //        LCP_ARM_Budget : 10000,
      //        LCP_Distributer_Budget :20000,
      //        LCP_Third_Party_Budget:30000,
      //        LCP_Notes: 'Some Note',
      //        LCP_Status: 1,
      //        ActionStatus : 0
      //    },
      //    {
      //     Loan_Crop_Practice_ID : 3,
      //      Loan_Full_ID : '000001-000',
      //      Crop_Practice_ID : 13,
      //      LCP_APH : 120,
      //      LCP_Acres : 100.3,
      //      LCP_ARM_Budget : 10000,
      //      LCP_Distributer_Budget :20000,
      //      LCP_Third_Party_Budget:30000,
      //      LCP_Notes: 'Some Note',
      //      LCP_Status: 1,
      //      ActionStatus : 0
      //  }
      //     ]
      //   }
      // OTHER UNSORTED 
      localloanobj.DashboardStats = localloanobj.DashboardStats;
      localloanobj.lasteditrowindex = localloanobj.lasteditrowindex;
      localloanobj.srccomponentedit = localloanobj.srccomponentedit;
      localloanobj.InsurancePolicies = localloanobj.InsurancePolicies;
      console.log("Calculation Ended");
      let endtime = new Date().getTime();
      this.logging.checkandcreatelog(3, 'Calculationforloan', "LoanCalculation timetaken :" + (endtime - starttime).toString() + " ms");
      console.log("Time taken :" + (starttime - endtime).toString() + " ms");

    }
    // At End push the new obj with new caluclated values into localstorage and emit value changes
    this.localst.store(environment.loankey, localloanobj);
    if (recalculate) {
      console.log("object updated");
      this.logging.checkandcreatelog(3, 'Calculationforloan', "Local Storage updated");
    }
    else
      console.log("object updated without calculations");

  }
}
