import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LayoutService } from '../layout/layout.service';
import { LocalStorageService } from 'ngx-webstorage';
import { environment } from '../../../environments/environment.prod';
import { MatSidenav } from '@angular/material';
/**
 * @title Autosize sidenav
 */
@Component({
  selector: 'layout-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {

  public isExpanded = true;

  @ViewChild('leftSidenav') public sideNav: MatSidenav;
  private mainHeader;
  private mainContent;
  private mainSideBar;
  private mainLogo;
  private minLogo;
  public loanid: string = "";
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private layoutService: LayoutService,
    private localstorage: LocalStorageService
  ) {
    this.localstorage.observe(environment.loankey).subscribe(res => {
      if (res != undefined && res != null)
        this.loanid =this.localstorage.retrieve(environment.loanidkey).replace("-","/");
    })
    this.getloanid();

  }

  ngOnInit() {
    this.layoutService.isSidebarExpanded().subscribe((value) => {
      this.isExpanded = value;
    });
  }

  gotoborrower(event) {
    this.router.navigateByUrl('/home/loanoverview/1/borrower');
  }

  getloanid() {
    try {
      this.loanid =this.localstorage.retrieve(environment.loanidkey).replace("-","/");
    }
    catch (ex) {

    }
  }
}

