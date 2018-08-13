import { Injectable } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { LoggingService } from '../../services/Logs/logging.service';
import { LoancalculationWorker } from '../../Workers/calculations/loancalculationworker';
import { LoanApiService } from '../../services/loan/loanapi.service';
import { ToasterService } from '../../services/toaster.service';
import { JsonConvert } from 'json2typescript';
import { loan_model } from '../../models/loanmodel';

@Injectable()
export class CropService {

  constructor(public localstorageservice: LocalStorageService,
    public logging: LoggingService,
    public loanserviceworker: LoancalculationWorker,
    public loanapi: LoanApiService,
    public toasterService: ToasterService) { }

  syncToDb(localloanobject: loan_model) {
    this.loanapi.syncloanobject(localloanobject).subscribe(res => {
      if (res.ResCode == 1) {
        this.loanapi.getLoanById(localloanobject.Loan_Full_ID).subscribe(res => {
          this.logging.checkandcreatelog(3, 'Overview', "APi LOAN GET with Response " + res.ResCode);
          if (res.ResCode == 1) {
            this.toasterService.success("Records Synced");
            let jsonConvert: JsonConvert = new JsonConvert();
            this.loanserviceworker.performcalculationonloanobject(jsonConvert.deserialize(res.Data, loan_model));
          }
          else {
            this.toasterService.error("Could not fetch Loan Object from API")
          }
        });
      }
      else {
        this.toasterService.error("Error in Sync");
      }
    });
  }

}
