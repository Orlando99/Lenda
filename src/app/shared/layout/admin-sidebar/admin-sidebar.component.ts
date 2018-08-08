import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LayoutService } from '../../layout/layout.service';
import { LocalStorageService } from 'ngx-webstorage';
import { environment } from '../../../../environments/environment.prod';
import { MatSidenav } from '@angular/material';

import { Role } from '../../../models/commonmodels';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.scss']
})
export class AdminSidebarComponent implements OnInit {

 private Role: Role;
 private userRole: number;
 private isExpanded: boolean = true;
 
 @ViewChild('adminSidebar') public sideNav: MatSidenav;
  

  constructor(private layoutService: LayoutService, 
  			private localStorageService: LocalStorageService) { }

  ngOnInit() {
  	this.userRole = this.localStorageService.retrieve(environment.localStorage.userRole);

    this.layoutService.isSidebarExpanded().subscribe((value) => {
      this.isExpanded = value;
    });
  }
}
