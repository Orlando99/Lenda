import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastsManager } from "ng2-toastr";
import { environment } from '../../../environments/environment';
import { deserialize, serialize } from 'serializer.ts/Serializer';
import { JsonConvert } from 'json2typescript';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  constructor(
  	private toaster: ToastsManager,
    private router: Router,
    private route: ActivatedRoute,
    private localstorageservice:LocalStorageService,
    ) { }

  ngOnInit() {
    let obj=this.localstorageservice.retrieve(environment.loankey);
    this.router.navigateByUrl("/home/admin/namingconvention");
  }

  gotonamingconvention(){
    this.router.navigateByUrl("/home/admin/namingconvention");
  }

}
