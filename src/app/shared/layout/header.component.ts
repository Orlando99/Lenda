import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../services/global.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'layout-header',
  templateUrl: './header.component.html'
})

export class HeaderComponent implements OnInit {
  _res: any = {}
 
  constructor(
    private globalService: GlobalService,
    public dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}
  
  ngOnInit() {}

  logout() {
    const keyName = "jwtToken";
    localStorage.removeItem(keyName);
    this.router.navigate(['/login']);
  }
}



