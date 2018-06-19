import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastsManager } from "ng2-toastr";
import { LoanApiService } from '../../services/loan/loanapi.service';
import { environment } from '../../../environments/environment';
import { LoancalculationWorker } from '../../Workers/calculations/loancalculationworker';
import { deserialize, serialize } from 'serializer.ts/Serializer';
import { loan_model } from '../../models/loanmodel';
import { JsonConvert } from 'json2typescript';
import { LocalStorageService } from 'ngx-webstorage';
import { LoggingService } from '../../services/Logs/logging.service';


@Component({
  selector: 'app-loan-overview',
  templateUrl: './loan-overview.component.html',
  styleUrls: ['./loan-overview.component.scss']
})
export class LoanOverviewComponent implements OnInit {
  loanid: string;
  constructor(
    private toaster: ToastsManager,
    private router: Router,
    private route: ActivatedRoute,
    private loanservice: LoanApiService,
    private localstorageservice: LocalStorageService,
    private loancalculationservice: LoancalculationWorker,
    private logging: LoggingService
  ) {

    let temp = this.route.params.subscribe(params => {
      // Defaults to 0 if no query param provided.
      debugger
      this.loanid = (params["loan"].toString())+"-"+ (params["seq"]);
    });
  }

  ngOnInit() {
    this.getLoanBasicDetails();

    let obj = this.localstorageservice.retrieve(environment.loankey);
    if ((obj == null || obj == undefined))
      this.getLoanBasicDetails();
    else {
      if (obj.Loan_Full_ID != this.loanid) {
        this.getLoanBasicDetails();
      }
    }
  }

  getLoanBasicDetails() {
    console.log(this.loanid)

    if (this.loanid != null) {
      let loaded = false;
      debugger
      this.loanservice.getLoanById(this.loanid).subscribe(res => {
        console.log(res)
        this.logging.checkandcreatelog(3, 'Overview', "APi LOAN GET with Response " + res.ResCode);
        if (res.ResCode == 1) {

          let jsonConvert: JsonConvert = new JsonConvert();
          this.loancalculationservice.performcalculationonloanobject(jsonConvert.deserialize(res.Data, loan_model));
          //we are making a copy of it also
          this.localstorageservice.store(environment.loankey_copy, res.Data);
        }
        else {
          this.toaster.error("Could not fetch Loan Object from API")
        }
        loaded = true;
      });

    }
    else {
      this.toaster.error("Something went wrong");
    }
  }

  // Navigational Methods

  gotosummary() {
    this.router.navigateByUrl("/home/loanoverview/" + this.loanid.replace("-","/") + "/summary")
  }
  gotoborrower() {
    debugger
    this.router.navigateByUrl("/home/loanoverview/" + this.loanid.replace("-","/") + "/borrower")
  }
  gotocrop() {
    debugger
    this.router.navigateByUrl("/home/loanoverview/" + this.loanid.replace("-","/") + "/crop")
  }
  gotofarm() {
    debugger
    this.router.navigateByUrl("/home/loanoverview/" + this.loanid.replace("-","/")+ "/farm")
  }
  gotobudget() {
    debugger
    this.router.navigateByUrl("/home/loanoverview/" + this.loanid.replace("-","/")+ "/budget")
  }
  gotoinsurance() {
    debugger
    this.router.navigateByUrl("/home/loanoverview/" + this.loanid.replace("-","/") + "/insurance")
  }
}
