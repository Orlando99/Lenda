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



@Injectable()
export class LoancalculationWorker {
  constructor(
    private localst: LocalStorageService,
    private borrowerworker:Borrowercalculationworker,
    private loancropunitworker:LoancropunitcalculationworkerService,
    private loanyieldhistoryworker:LoancrophistoryService,
    private farmcalculation:FarmcalculationworkerService,
    private collateralcalculation: Collateralcalculationworker,
   // private associationcalculation:AssociationcalculationworkerService,
    public logging:LoggingService
) {}

  performcalculationonloanobject(localloanobj: loan_model,recalculate?:boolean) {
    if(recalculate==undefined)
    {
      recalculate=true; // by default we are taking that it needs calculation
    }
    if(recalculate)
    {
    console.log("Calculation Started"); 
    let starttime=new Date().getTime();
    console.log(starttime);    
    this.logging.checkandcreatelog(3,'Calculationforloan',"LoanCalculation Started");
    if(localloanobj.Borrower!=null)
      localloanobj.Borrower = this.borrowerworker.prepareborrowermodel(localloanobj.Borrower);
    if(localloanobj.LoanCropUnits!=null)
      localloanobj=this.loancropunitworker.prepareLoancropunitmodel(localloanobj);
    if(localloanobj.CropYield!=null)
      localloanobj=this.loanyieldhistoryworker.prepareLoancrophistorymodel(localloanobj);
    if(localloanobj.Farms!=null)
      localloanobj=this.farmcalculation.prepareLoanfarmmodel(localloanobj);
    if(localloanobj.LoanCollateral !=null)
      localloanobj = this.collateralcalculation.preparecollateralmodel(localloanobj);
    localloanobj.LoanMaster = localloanobj.LoanMaster;
    localloanobj.LoanBudget=localloanobj.LoanBudget;
    localloanobj.DashboardStats=localloanobj.DashboardStats;
    localloanobj.lasteditrowindex=localloanobj.lasteditrowindex;
    localloanobj.srccomponentedit=localloanobj.srccomponentedit;
    //localloanobj=this.associationcalculation.prepareLoanassociationmodel(localloanobj);
    console.log("Calculation Ended"); 
    let endtime=new Date().getTime();
    this.logging.checkandcreatelog(3,'Calculationforloan',"LoanCalculation timetaken :" + (endtime-starttime).toString() + " ms");
    
    
    console.log("Time taken :" + (starttime-endtime).toString() + " ms");
    }
      // At End push the new obj with new caluclated values into localstorage and emit value changes
    this.localst.store(environment.loankey,localloanobj);
    if(recalculate)
    {
    console.log("object updated");
    this.logging.checkandcreatelog(3,'Calculationforloan',"Local Storage updated");
    }
    else
    console.log("object updated without calculations");
    
  }

}
