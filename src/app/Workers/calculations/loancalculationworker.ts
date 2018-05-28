import { Injectable } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { observeOn } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { loan_model } from '../../models/loanmodel';
import { LendaStorageService } from '../../services/localstorage/lendalocalstorageservice';
import { Borrowercalculationworker } from './borrowercalculationworker.service';



@Injectable()
export class LoancalculationWorker {
  constructor(
    private localst: LendaStorageService,
    private borrowerworker:Borrowercalculationworker
) {}

  performcalculationonloanobject(localloanobj: loan_model) {
    console.log(new Date().getMilliseconds());


    localloanobj.Borrower = this.borrowerworker.prepareborrowermodel(localloanobj.Borrower);
    debugger
      // At End push the new obj with new caluclated values into localstorage and emit value changes
      this.localst.store(environment.loankey,localloanobj);

    console.log("object updated");
    console.log(new Date().getMilliseconds());
  }

}
