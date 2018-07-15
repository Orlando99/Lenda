import { Injectable } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { observeOn } from 'rxjs/operators';
import { environment } from '../../../environments/environment.prod';
import { loan_model } from '../../models/loanmodel';
import { Borrowercalculationworker } from './borrowercalculationworker.service';
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



@Injectable()
export class LoancalculationWorker {
  constructor(
    private localst: LocalStorageService,
    private borrowerworker: Borrowercalculationworker,
    private loancropunitworker: LoancropunitcalculationworkerService,
    private loancrophistoryworker: LoancrophistoryService,
    private farmcalculation: FarmcalculationworkerService,
    private collateralcalculation: Collateralcalculationworker,
    private questionscalculations:QuestionscalculationworkerService,
    private loanMasterCalcualtions : LoanMasterCalculationWorkerService,
    private overallCalculationService : OverallCalculationServiceService,
    // private associationcalculation:AssociationcalculationworkerService,
    private loancroppracticeworker: LoancroppracticeworkerService,
    private insuranceworker: InsurancecalculationworkerService,
    private associationcalculation: AssociationcalculationworkerService,
    public logging: LoggingService
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

      //STEP 2 -- CROP LEVEL CALCULATIONS
          if (localloanobj.CropYield != null) {
            localloanobj = this.loancrophistoryworker.prepareLoancrophistorymodel(localloanobj);
            localloanobj = this.loancroppracticeworker.performcalculations(localloanobj);
          }
          if (localloanobj.LoanCropUnits)
            localloanobj = this.loancropunitworker.prepareLoancropunitmodel(localloanobj);

      //STEP 3 --- FARM CALCULATIONS
          if (localloanobj.Farms != null)
            localloanobj = this.farmcalculation.prepareLoanfarmmodel(localloanobj);

      //STEP 4 --- INSURANCE POLICIES  
          localloanobj = this.insuranceworker.performcalculations(localloanobj);

      //STEP 5 --- BUDGET CALCULATIONS
          if (localloanobj.LoanBudget != null){

            for(let i = 0; i<localloanobj.LoanBudget.length;i++){
              let currentBudget =  localloanobj.LoanBudget[i];
              let cropPractice = localloanobj.LoanCropPractices.find(cp=>cp.Crop_Practice_ID === currentBudget.Crop_Practice_ID);
                currentBudget.ARM_Budget_Crop = currentBudget.ARM_Budget_Acre * cropPractice.LCP_Acres;
                currentBudget.Distributor_Budget_Crop = currentBudget.Distributor_Budget_Acre * cropPractice.LCP_Acres;
                currentBudget.Third_Party_Budget_Crop = currentBudget.Third_Party_Budget_Acre * cropPractice.LCP_Acres;
                currentBudget.Total_Budget_Crop_ET = currentBudget.Total_Budget_Acre * cropPractice.LCP_Acres;
            }
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
        if(localloanobj.LoanMaster !==null){
          localloanobj = this.loanMasterCalcualtions.performLoanMasterCalcualtions(localloanobj);
          localloanobj = this.overallCalculationService.balancesheet_calc(localloanobj);
        }

        //TODO-SANKET : should be remove
        // localloanobj =  this.budgetService.caculateTotalsBeforeStore(localloanobj);
        // debugger;
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
          localloanobj.InsurancePolicies=localloanobj.InsurancePolicies;
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
