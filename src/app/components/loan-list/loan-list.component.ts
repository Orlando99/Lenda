import { Component, OnInit } from '@angular/core';
import { LoanApiService } from '../../services/loan/loanapi.service';
import { LoanListResModel } from '../../models/resmodels/loan-list.model';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-loan-list',
  templateUrl: './loan-list.component.html',
  styleUrls: ['./loan-list.component.scss']
})
export class LoanListComponent implements OnInit {
  private previndex = 0;
  private pagesize = 10;
  public loanlist: Array<any> = new Array<any>();
  public pageheader = 'Loan Listing';
  constructor(private loanService: LoanApiService, private route: Router,
  private localstorageservice:LocalStorageService
  ) { }

  ngOnInit() {
    this.getloanlist();
  }
  
  getloanlist() {
    this.loanService.getLoanList().subscribe(res => {
      if (res.ResCode == 1) {
        this.loanlist = res.Data;
      }
    });
  }

  navigatetoloan(id: string) {
     
    this.localstorageservice.store(environment.loanidkey,id)
    this.route.navigateByUrl("/home/loanoverview/"+id.replace("-","/")+"/summary");
  }
}
