import { Component, OnInit } from '@angular/core';
import { modelparserfordb } from '../../../Workers/utility/modelparserfordb';
import { environment } from '../../../../environments/environment';
import { loan_model } from '../../../models/loanmodel';
import { LocalStorageService } from 'ngx-webstorage';
import { LoancalculationWorker } from '../../../Workers/calculations/loancalculationworker';
import { ToastsManager } from 'ng2-toastr';
import { LoggingService } from '../../../services/Logs/logging.service';
import { LoancropunitcalculationworkerService } from '../../../Workers/calculations/loancropunitcalculationworker.service';
import { CropapiService } from '../../../services/crop/cropapi.service';

@Component({
  selector: 'app-price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.scss']
})
export class PriceComponent implements OnInit {
  private editedLoanCuids = [];
  private localloanobject: loan_model = new loan_model();
  public allDataFetched = false;
  public editarray = [];
  public syncenabled = false;
  constructor(public localstorageservice: LocalStorageService,
    public loanserviceworker: LoancalculationWorker,
    public cropunitservice: CropapiService,
    private toaster: ToastsManager,
    public logging: LoggingService
  ) { }
  ngOnInit() {
    this.localstorageservice.observe(environment.loankey).subscribe(res => {
      this.logging.checkandcreatelog(1, 'CropPrice', "LocalStorage updated");
      this.localloanobject = res;
      this.allDataFetched = true;
    })
    this.getdataforgrid();
  }
  getdataforgrid() {
    let obj: any = this.localstorageservice.retrieve(environment.loankey);
    this.logging.checkandcreatelog(1, 'CropPrice', "LocalStorage retrieved");
    if (obj != null && obj != undefined) {
      this.localloanobject = obj;
      this.allDataFetched = true;
    }
  }

  startediting(value: string) {

    this.editarray=[];
      this.editarray[value] = true;
  }
  valueupdate(value: any, key: string, lon_id: number) {
    debugger
    this.editarray[key] = false;
    if(value==""){
      value="0";
    }
    this.localloanobject.LoanCropUnits.find(p => p.Loan_CU_ID == lon_id)[key.substr(0, key.length - 1)] = parseFloat(value);
    this.editedLoanCuids.push(lon_id);
    this.logging.checkandcreatelog(3, 'CropPrice', "Field Edited -" + key);
    this.loanserviceworker.performcalculationonloanobject(this.localloanobject);
    this.syncenabled = true;
  }

  synctoDb() {
    debugger
    var edits = this.editedLoanCuids.filter((value, index, self) => self.indexOf(value) === index);

    edits.forEach(element => {
      let obj = this.localloanobject.LoanCropUnits.find(p => p.Loan_CU_ID == element);
      this.cropunitservice.saveupdateLoanCropUnit(obj).subscribe(res => {
        this.logging.checkandcreatelog(3, 'CropPrice', "Code Synced to DB with ResCode " + res.ResCode);
        if (res.ResCode == 1) {
          this.toaster.success("Object Synced Successfully");
        }
        else {
          this.toaster.error("Error Encountered while Syncing");
        }
      })
    });
    this.syncenabled = false;
  }
}
