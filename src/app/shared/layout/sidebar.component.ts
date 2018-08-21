import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LayoutService } from './layout.service';
import { LocalStorageService } from 'ngx-webstorage';
import { environment } from '../../../environments/environment.prod';
import { MatSidenav } from '@angular/material';
import { PublishService, Sync } from './../../services/publish.service';

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
  public syncItems: Sync[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private layoutService: LayoutService,
    private localstorage: LocalStorageService,
    private publishService: PublishService
  ) {
    this.localstorage.observe(environment.loankey).subscribe(res => {
      if (res != undefined && res != null)
        this.loanid = this.localstorage.retrieve(environment.loanidkey).replace("-", "/");
    })
    this.getloanid();
  }

  ngOnInit() {
    this.layoutService.isSidebarExpanded().subscribe((value) => {
      this.isExpanded = value;
    });

    // Start subscribing if sync is required
    this.publishService.listenToSyncRequired().subscribe((syncItems) => {
      this.syncItems = syncItems;
      this.syncItems.forEach(element => {
        this.geterrorcountfortab(element.page);
      });
    });
  }

  isSyncRequired(pageName: string) {
    let item: Sync;
    for (item of this.syncItems) {
      if (item.page === pageName) {
        return true;
      }
    }
    return false;
  }

  gotoborrower(event) {
    this.router.navigateByUrl('/home/loanoverview/1/borrower');
  }

  getloanid() {
    try {
      this.loanid = this.localstorage.retrieve(environment.loanidkey).replace("-", "/");
    }
    catch (ex) {

    }
  }

  geterrorcountfortab(section:string){
    
    return (this.localstorage.retrieve(environment.errorbase) as [any]).filter(p=>p.tab.toString().toLowerCase()==section.toLowerCase()).length;
  }
}

