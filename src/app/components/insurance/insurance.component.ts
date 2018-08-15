import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { environment } from '../../../environments/environment.prod';
import { PublishService, Page } from '../../services/publish.service';
import { InsuranceService } from './insurance.service';
@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.scss'],
  providers : [InsuranceService]
})
export class InsuranceComponent implements OnInit {

  public currentPageName: string = Page.insurance;
  
  constructor(private insuranceService : InsuranceService,
    private localStorageService : LocalStorageService,private publishService : PublishService) { }

  ngOnInit() {
  }
  

   /**
   * Sync to database - publish button event
   */
  synctoDb() {
    this.publishService.syncCompleted();
    this.insuranceService.syncToDb(this.localStorageService.retrieve(environment.loankey));
  }

}
