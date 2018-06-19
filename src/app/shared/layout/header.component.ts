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

@Component({
  selector: 'layout-header',
  templateUrl: './header.component.html'
})

export class HeaderComponent implements OnInit {
  _res: any = {};
  public value: number = 1;
  toggleActive: boolean = false;
  icon: String = 'lightbulb_outline';
  decideShow: string = 'hidden';
  public isExpanded: boolean;
  constructor(
    private globalService: GlobalService,
    public dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public localst: LocalStorageService,
    private notificationFeedService: NotificationFeedsService,
    private sideBarService: SidebarService,
  ) {}



  //private leftnav: MatSidenav;




  ngOnInit() {
    this.isExpanded = false;
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
    this.isExpanded = !this.isExpanded;
    this.sideBarService.toggle(this.isExpanded);
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
}



