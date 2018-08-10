import { Component, OnInit, ViewChild } from '@angular/core';
import { NotificationFeedsService } from './notification-feeds.service';
import { MatSidenav } from '@angular/material';
@Component({
  selector: 'notification-feeds',
  templateUrl: './notification-feeds.component.html',
  styleUrls: ['./notification-feeds.component.css']

})
export class NotificationFeedsComponent implements OnInit {
  @ViewChild('notificationFeeds') public notificationFeed: MatSidenav;

  constructor(
    private notificationFeedsService: NotificationFeedsService
  ) { }
  public notificationIcon = 'lightbulb_outline';
  ngOnInit() {
    this.notificationFeedsService.setSidenav(this.notificationFeed);
  }
}
