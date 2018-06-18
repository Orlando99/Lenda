import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../services/global.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LocalStorageService } from 'ngx-webstorage';
import { environment } from '../../../environments/environment.prod';
import { ReferenceService } from '../../services/reference/reference.service';
import { JsonConvert } from 'json2typescript';
import { ToastsManager } from 'ng2-toastr';
import { LoanApiService } from '../../services/loan/loanapi.service';
import { LoancalculationWorker } from '../../Workers/calculations/loancalculationworker';
import { loan_model } from '../../models/loanmodel';

@Component({
  selector: 'layout-header',
  templateUrl: './header.component.html'
})

export class HeaderComponent implements OnInit {
  _res: any = {}
 loanid="000001-000";
 public value:number=1;
  constructor(
    private globalService: GlobalService,
    public dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public localst:LocalStorageService,
    public referencedataapi:ReferenceService,
    public toaster:ToastsManager,
    public loanservice:LoanApiService,
    public loancalculation:LoancalculationWorker
  ) {}
  
  ngOnInit(){
  this.value=this.localst.retrieve(environment.logpriority);
    
  }

  logout() {
    const keyName = "jwtToken";
    localStorage.removeItem(keyName);
    this.router.navigate(['/login']);
  }

  changepriority(event:any){
    this.localst.store(environment.logpriority,parseInt(event.value));
    
  }

  ClearLocalstorage(){
    this.localst.clear();
    this.getLoanBasicDetails();
    this.getreferencedata();

  }

  getLoanBasicDetails() {
    console.log(this.loanid)
debugger
    if (this.loanid != null) {
      let loaded = false;
      this.loanservice.getLoanById(this.loanid).subscribe(res => {
        console.log(res)
        //this.logging.checkandcreatelog(3, 'Overview', "APi LOAN GET with Response " + res.ResCode);
        if (res.ResCode == 1) {

          let jsonConvert: JsonConvert = new JsonConvert();
          this.loancalculation.performcalculationonloanobject(jsonConvert.deserialize(res.Data, loan_model));
          //we are making a copy of it also
          this.localst.store(environment.loankey_copy, res.Data);
          this.toaster.success("Updated loan Object")
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
  getreferencedata() {
    this.referencedataapi.getreferencedata().subscribe(res => {
      this.localst.store(environment.referencedatakey, res.Data);
    })
  }
}



