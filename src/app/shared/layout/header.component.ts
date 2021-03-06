import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, RouterEvent, NavigationEnd } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LocalStorageService } from 'ngx-webstorage';
import { JsonConvert } from 'json2typescript';

import { environment } from '../../../environments/environment.prod';
import { NotificationFeedsComponent } from '../notification-feeds/notification-feeds.component';
import { SidebarComponent } from './sidebar.component';

import { NotificationFeedsService } from '../notification-feeds/notification-feeds.service';
import { ReferenceService } from '../../services/reference/reference.service';
import { LayoutService } from './layout.service';
import { GlobalService } from '../../services/global.service';
import { LoanApiService } from '../../services/loan/loanapi.service';

import { LoancalculationWorker } from '../../Workers/calculations/loancalculationworker';
import { loan_model } from '../../models/loanmodel';
import { versions } from '../../versions';

@Component({
  selector: 'layout-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {
  public loanid: string = ""
  _res: any = {};
  public apiurl = environment.apiUrl;
  public Git = versions.revision;
  public Databasename: string = "";
  public value: number = 1;
  toggleActive: boolean = false;
  icon: String = 'lightbulb_outline';
  decideShow: string = 'hidden';
  public isExpanded: boolean = true;
  public isRightSidebarExpanded: boolean;

  constructor(
    private globalService: GlobalService,
    public dialog: MatDialog,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    public localst: LocalStorageService,
    private notificationFeedService: NotificationFeedsService,
    public referencedataapi: ReferenceService,
    public toaster: ToastsManager,
    public loanservice: LoanApiService,
    public loancalculation: LoancalculationWorker,
    public layoutService: LayoutService
  ) {

    this.localst.observe(environment.loankey).subscribe(res => {
      if (res != undefined && res != null && res.Loan_Full_ID)
        this.loanid = res.Loan_Full_ID.replace("-", "/");
    })

    this.getloanid();
  }

  ngOnInit() {
    //default open
    this.value = this.localst.retrieve(environment.logpriority);
    this.layoutService.isSidebarExpanded().subscribe((value) => {
      this.isExpanded = value;
    });
    this.layoutService.isRightSidebarExpanded().subscribe((value) => {
      this.isRightSidebarExpanded = value;
    });
  }

  logout() {
    const keyName = "jwtToken";
    localStorage.removeItem(keyName);
    this.router.navigate(['/login']);
  }

  changepriority(event: any) {
    this.localst.store(environment.logpriority, parseInt(event.value));
  }

  toggleSideBar() {
    this.layoutService.toggleSidebar(!this.isExpanded);
  }

  toggleRightSidenav() {
    this.layoutService.toggleRightSidebar(!this.isRightSidebarExpanded);
  }

  ClearLocalstorage() {
    this.getloanid();
    this.localst.clear();
    this.getLoanBasicDetails();
    this.getreferencedata();
  }

  getLoanBasicDetails() {
    console.log(this.loanid)

    if (this.loanid != null) {
      let loaded = false;
      this.loanservice.getLoanById(this.loanid.replace("/", "-")).subscribe(res => {
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
      this.Databasename = res.Data.Databasename;
    })
  }
  getloanid() {

    try {

      this.loanid = this.localst.retrieve(environment.loankey).Loan_Full_ID.replace("-", "/");
      this.Databasename = this.localst.retrieve(environment.referencedatakey).Databasename;
    }
    catch{

    }
  }

  update (value) {
    this.loanservice.setFilter(value);
  }
}



