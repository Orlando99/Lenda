import { Component, OnInit } from '@angular/core';
import { loan_model, Loan_Association, Loan_Crop_Practice } from '../../models/loanmodel';
import { LocalStorageService } from 'ngx-webstorage';
import { LoancalculationWorker } from '../../Workers/calculations/loancalculationworker';
import { ToastsManager } from 'ng2-toastr';
import { LoggingService } from '../../services/Logs/logging.service';
import { environment } from '../../../environments/environment.prod';
import { modelparserfordb } from '../../Workers/utility/modelparserfordb';
import { Loan_Farm } from '../../models/farmmodel.';
import { InsuranceapiService } from '../../services/insurance/insuranceapi.service';
import { numberValueSetter, getNumericCellEditor } from '../../Workers/utility/aggrid/numericboxes';
import { extractStateValues, lookupStateValue, Statevaluesetter, extractCountyValues, lookupCountyValue, Countyvaluesetter, getfilteredcounties } from '../../Workers/utility/aggrid/stateandcountyboxes';
import { SelectEditor } from '../../aggridfilters/selectbox';
import { DeleteButtonRenderer } from '../../aggridcolumns/deletebuttoncolumn';
import { AlertifyService } from '../../alertify/alertify.service';
import { LoanApiService } from '../../services/loan/loanapi.service';
import { JsonConvert } from 'json2typescript';
import { BudgetHelperService } from './budget-helper.service';
/// <reference path="../../../Workers/utility/aggrid/numericboxes.ts" />

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss']
})
export class BudgetComponent implements OnInit {
  posts: any[];
  // constructor() {  

  // this.posts =[];
  // this.posts.push({title:"DIS",postText:"Wow greate post"});
  // this.posts.push({title:"THR", postText:"WoW"});
  // this.posts.push({title:"HAR", postText:"WoW"});

  //  }
  
  public cropPractices :Array<Loan_Crop_Practice>;
  constructor(public localstorageservice: LocalStorageService,
    public loanserviceworker: LoancalculationWorker,
    private budgetService: BudgetHelperService,
    public insuranceservice: InsuranceapiService,
    private toaster: ToastsManager,
    public logging: LoggingService,
    public alertify: AlertifyService,
    public loanapi: LoanApiService,
  ) {

    this.localstorageservice.observe(environment.loankey).subscribe(res => {

      this.bindData(res);
      
    })

    this.bindData(this.localstorageservice.retrieve(environment.loankey));

  }

  bindData(loanObject : loan_model) {
    if(loanObject.LoanCropPractice)
    {
      this.cropPractices = this.budgetService.prepareCropPractice(loanObject.LoanCropPractice);
    }
  }
  ngOnInit() {

  }

}
