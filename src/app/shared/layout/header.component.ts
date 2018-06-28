import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../services/global.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LocalStorageService } from 'ngx-webstorage';
import { environment } from '../../../environments/environment.prod';
import { NotificationFeedsComponent } from '../notification-feeds/notification-feeds.component';
import { SidebarComponent } from '../layout/sidebar.component';
import { NotificationFeedsService } from '../notification-feeds/notification-feeds.service';
import { SidebarService } from '../../shared/layout/sidebar.component.service';
import { ReferenceService } from '../../services/reference/reference.service';
import { ToastsManager } from 'ng2-toastr';
import { LoanApiService } from '../../services/loan/loanapi.service';
import { LoancalculationWorker } from '../../Workers/calculations/loancalculationworker';
import { JsonConvert } from 'json2typescript';
import { loan_model } from '../../models/loanmodel';
import { versions } from '../../versions';

@Component({
  selector: 'layout-header',
  templateUrl: './header.component.html'
})

export class HeaderComponent implements OnInit {
  public loanid:string=""
  _res: any = {};
  public apiurl=environment.apiUrl;
  public Git=versions.revision;
  public Databasename:string="";
  public value: number = 1;
  toggleActive: boolean = false;
  icon: String = 'lightbulb_outline';
  decideShow: string = 'hidden';
  public isExpanded: boolean=true;
  constructor(
    private globalService: GlobalService,
    public dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public localst: LocalStorageService,
    private notificationFeedService: NotificationFeedsService,
    private sideBarService: SidebarService,
    public referencedataapi:ReferenceService,
    public toaster:ToastsManager,
    public loanservice:LoanApiService,
    public loancalculation:LoancalculationWorker
  ) {

    this.localst.observe(environment.loankey).subscribe(res=>{
      
            this.loanid=res.Loan_Full_ID.replace("-","/");
    })
  
        this.getloanid();
  }



  //private leftnav: MatSidenav;




  ngOnInit() {
    this.isExpanded = true;
    //default open
    this.value = this.localst.retrieve(environment.logpriority);
  }

  logout() {
    const keyName = "jwtToken";
    localStorage.removeItem(keyName);
    this.router.navigate(['/login']);
  }

  changepriority(event: any) {
    this.localst.store(environment.logpriority,parseInt(event.value));
  }

  toggleSideBar(event) {
    //this.isExpanded = !this.isExpanded;
    this.sideBarService.toggle(this.isExpanded);
  }

  ngAfterViewInit() {
    this.sideBarService.toggle(true);
  }
  toggleRightSidenav() {
    this.toggleActive = !this.toggleActive;
    this.notificationFeedService.toggle();
    if (this.toggleActive === true) {
      this.icon = 'arrow_forward_ios';
      this.decideShow = 'visible';
    } else {
      this.icon = 'lightbulb_outline';
      this.decideShow = 'hidden';
    }
    console.log('Clicked');
  }

  ClearLocalstorage(){
    this.getloanid();
    this.localst.clear();
    this.getLoanBasicDetails();
    this.getreferencedata();

  }

  getLoanBasicDetails() {
    console.log(this.loanid)

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
      this.Databasename=res.Data.Databasename;
    })
  }
  getloanid(){

    try{
      debugger
      this.loanid=this.localst.retrieve(environment.loankey).Loan_Full_ID.replace("-","/");
      this.Databasename=this.localst.retrieve(environment.referencedatakey).Databasename;
    }
    catch{
      
    }
  }
}



