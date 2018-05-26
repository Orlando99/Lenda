import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastsManager } from "ng2-toastr";
import { LoanApiService } from '../../services/loan/loanapi.service';

@Component({
  selector: 'app-loan-overview',
  templateUrl: './loan-overview.component.html',
  styleUrls: ['./loan-overview.component.scss']
})
export class LoanOverviewComponent implements OnInit {
  loanid: number;
  loanObject: any;
  constructor(

    private toaster: ToastsManager,
    private router: Router,
    private route: ActivatedRoute,
    private loanservice: LoanApiService
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
    debugger;
    
    if (this.loanid != null) {
      this.loanservice.getLoanById(this.loanid).subscribe(res => {
        if (res.ResCode == 1) {
          this.loanObject = res.Data;
        }
      });
    }
    else {
      this.toaster.error("Something went wrong");
    }
  }
}
