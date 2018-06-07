import { Injectable } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { observeOn } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { loan_model } from '../../models/loanmodel';
import { Borrowercalculationworker } from './borrowercalculationworker.service';
import { LoggingService } from '../../services/Logs/logging.service';
import { LoancropunitcalculationworkerService } from './loancropunitcalculationworker.service';
import { LoancrophistoryService } from './loancrophistory.service';
import { FarmcalculationworkerService } from './farmcalculationworker.service';



@Injectable()
export class LoancalculationWorker {
  constructor(
    private localst: LocalStorageService,
    private borrowerworker:Borrowercalculationworker,
    private loancropunitworker:LoancropunitcalculationworkerService,
    private loanyieldhistoryworker:LoancrophistoryService,
    private farmcalculation:FarmcalculationworkerService,
    public logging:LoggingService
) {}

  performcalculationonloanobject(localloanobj: loan_model) {
    console.log(new Date().getMilliseconds());
      
    this.logging.checkandcreatelog(3,'Calculationforloan',"LoanCalculation Started");
    localloanobj.Borrower = this.borrowerworker.prepareborrowermodel(localloanobj.Borrower);
    localloanobj=this.loancropunitworker.prepareLoancropunitmodel(localloanobj);
    localloanobj=this.loanyieldhistoryworker.prepareLoancrophistorymodel(localloanobj);
    localloanobj=this.farmcalculation.prepareLoanfarmmodel(localloanobj);
    this.logging.checkandcreatelog(3,'Calculationforloan',"LoanCalculation Ended");

      // At End push the new obj with new caluclated values into localstorage and emit value changes
      this.localst.store(environment.loankey,localloanobj);
      this.logging.checkandcreatelog(3,'Calculationforloan',"Local Storage updated");
    console.log("object updated");
    console.log(new Date().getMilliseconds());
  }

}
