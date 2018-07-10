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
          if (localloanobj.LoanBudget != null)
          localloanobj.LoanBudget = localloanobj.LoanBudget;

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
        }

      // OTHER UNSORTED 
          localloanobj.DashboardStats = localloanobj.DashboardStats;
          localloanobj.lasteditrowindex = localloanobj.lasteditrowindex;
          localloanobj.srccomponentedit = localloanobj.srccomponentedit;
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
