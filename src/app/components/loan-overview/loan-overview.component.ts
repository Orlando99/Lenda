import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastsManager } from "ng2-toastr";
import { LoanApiService } from '../../services/loan/loanapi.service';
import { LendaStorageService } from '../../services/localstorage/lendalocalstorageservice';
import { environment } from '../../../environments/environment';
import { LoancalculationWorker } from '../../Workers/calculations/loancalculationworker';
import { deserialize, serialize } from 'serializer.ts/Serializer';
import { loan_model } from '../../models/loanmodel';
import { JsonConvert } from 'json2typescript';


@Component({
  selector: 'app-loan-overview',
  templateUrl: './loan-overview.component.html',
  styleUrls: ['./loan-overview.component.scss']
})
export class LoanOverviewComponent implements OnInit {
  loanid: number;
  constructor(
    private toaster: ToastsManager,
    private router: Router,
    private route: ActivatedRoute,
    private loanservice: LoanApiService,
    private localstorageservice:LendaStorageService,
    private loancalculationservice:LoancalculationWorker
  ) {

    let temp = this.route.params.subscribe(params => {
      // Defaults to 0 if no query param provided.
      this.loanid = +params["id"] || 0;
    });
  }

  ngOnInit() {
    this.getLoanBasicDetails();
  }

  getLoanBasicDetails() {
    if (this.loanid != null) {
      let loaded=false;
      this.loanservice.getLoanById(this.loanid).subscribe(res => {
        debugger
        if (res.ResCode == 1) {
          debugger
          let jsonConvert: JsonConvert = new JsonConvert();
          this.loancalculationservice.performcalculationonloanobject(jsonConvert.deserialize(res.Data, loan_model));
          //we are making a copy of it also
          this.localstorageservice.store(environment.loankey_copy,res.Data);
        }
        else{
          this.toaster.error("Could not fetch Loan Object from API")
        }
        loaded=true;
      });
    
    }
    else {
      this.toaster.error("Something went wrong");
    }
  }
}
