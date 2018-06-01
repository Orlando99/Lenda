import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../services/global.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LocalStorageService } from 'ngx-webstorage';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'layout-header',
  templateUrl: './header.component.html'
})

export class HeaderComponent implements OnInit {
  _res: any = {}
 public value:number=1;
  constructor(
    private globalService: GlobalService,
    public dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public localst:LocalStorageService
  ) {}
  
  ngOnInit(){
  this.value=this.localst.retrieve(environment.logpriority);
    
  }

  logout() {
    const keyName = "jwtToken";
    localStorage.removeItem(keyName);
    this.router.navigate(['/login']);
  }

  changepriority(event:any){
    this.localst.store(environment.logpriority,parseInt(event.value));
    
  }
}



