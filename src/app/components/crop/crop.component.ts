import { Component, OnInit } from '@angular/core';
import { LoanApiService } from '../../services/loan/loanapi.service';
import { CropService } from './crop.service';
import { LocalStorageService } from 'ngx-webstorage';
import { environment } from '../../../environments/environment.prod';
import { PublishService, Page } from '../../services/publish.service';

@Component({
  selector: 'app-crop',
  templateUrl: './crop.component.html',
  styleUrls: ['./crop.component.scss'],
  providers : [CropService]
})
export class CropComponent implements OnInit {

  public currentPageName: string = Page.crop;
  
  constructor(private cropService : CropService,
    private localStorageService : LocalStorageService,private publishService : PublishService) { }

  ngOnInit() {
  }
  

   /**
   * Sync to database - publish button event
   */
  synctoDb() {
    this.publishService.syncCompleted();
    this.cropService.syncToDb(this.localStorageService.retrieve(environment.loankey));
  }

}
