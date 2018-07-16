import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../layout/layout.service';

@Component({
  selector: 'app-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.scss']
})
export class RightSidebarComponent implements OnInit {
  public isRightbarExpanded: boolean = false;

  constructor(private layoutService: LayoutService) { }

  ngOnInit() {
    this.layoutService.isRightSidebarExpanded().subscribe((value) => {
      this.isRightbarExpanded = value;
    });
  }

}
