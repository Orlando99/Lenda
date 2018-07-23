import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from '../shared/layout/layout.service';

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.scss']
})
export class MasterComponent implements OnInit {
  public isSidebarExpanded: boolean = true;
  constructor(
    private router: Router,
    public layoutService: LayoutService
  ) { }

  ngOnInit() {
    this.layoutService.isSidebarExpanded().subscribe((value) => {
      this.isSidebarExpanded = value;
    })
  }

}
