import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-loanviewer',
  templateUrl: './loanviewer.component.html',
  styleUrls: ['./loanviewer.component.scss']
})
export class LoanviewerComponent implements OnInit {
  loanobject: any;
  refobject :any;
  constructor(
    public localstorage:LocalStorageService
  ) {
    this.loanobject=this.localstorage.retrieve(environment.loankey);
    this.refobject=this.localstorage.retrieve(environment.referencedatakey);
    
   }

  ngOnInit() {
  }

}
