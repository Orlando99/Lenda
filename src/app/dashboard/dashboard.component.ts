import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../services/global.service';
import { from } from 'rxjs/observable/from';
import { ActivatedRoute } from '@angular/router'
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  permissionName: string = '';
  //currentScreenId: number = ScreensEnum.DashboardScreen;
  localData: any = {};
  permission: any = {};
  modules: number[] = [];
  constructor(private globalService: GlobalService,  private route: ActivatedRoute) {

  }

  ngOnInit() {}

}
