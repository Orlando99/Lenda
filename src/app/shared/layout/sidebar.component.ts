import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SidebarService } from '../layout/sidebar.component.service';
import { MatSidenav } from '@angular/material';
import { LocalStorageService } from 'ngx-webstorage';
import { environment } from '../../../environments/environment.prod';
/**
 * @title Autosize sidenav
 */
@Component({
  selector: 'layout-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  public isExpanded: boolean = true;
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
    private sidebarService: SidebarService,
    private localstorage: LocalStorageService
  ) {
    this.localstorage.observe(environment.loankey).subscribe(res => {
      if (res != undefined && res != null)
        this.loanid = res.Loan_Full_ID.replace("-", "/");
    })
    this.getloanid();

  }

  ngOnInit() {
    this.isExpanded = true;
    this.sidebarService.setSidenav(this.sideNav);
    this.mainHeader = document.getElementById('arm-main-header');
    this.mainContent = document.getElementById('arm-main-content');
    this.mainSideBar = document.getElementById('arm-sidenav');
    this.mainLogo = document.getElementById('navlogo-main');
    this.minLogo = document.getElementById('navlogo-min');
    console.log(this.mainHeader, this.mainContent, this.mainSideBar, this.mainLogo, this.minLogo)
    this.sidebarService.setHtmlElement(this.mainHeader, this.mainContent, this.mainSideBar, this.mainLogo, this.minLogo);
  }

  gotoborrower(event) {
    this.router.navigateByUrl('/home/loanoverview/1/borrower');
  }

  onOpen() {
    this.isExpanded = !this.isExpanded;
  }

  onClose() {
    this.isExpanded = !this.isExpanded;
  }

  getloanid() {

    try {
      this.loanid = this.localstorage.retrieve(environment.loankey).Loan_Full_ID.replace("-", "/");;
    }
    catch (ex) {

    }
  }
}

