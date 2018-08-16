import { Component, OnInit } from '@angular/core';
import { loan_model, Loan_Association, Loan_Crop_Practice, Loan_Budget } from '../../models/loanmodel';
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
import { PriceFormatter } from '../../Workers/utility/aggrid/formatters';
import { PublishService, Page } from '../../services/publish.service';
import { currencyFormatter } from '../../aggridformatters/valueformatters';
/// <reference path="../../../Workers/utility/aggrid/numericboxes.ts" />

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss'],
  providers : [BudgetHelperService]
})
export class BudgetComponent implements OnInit {
  // Following properties are added as produ build was failing
  // ----
  components;
  frameworkcomponents;
  context;
  rowvaluechanged;
  cellvaluechanged;
  // ----
  posts: any[];
  columnDefs: Array<any>;
  rowData: Array<Loan_Budget>;
  localLoanObject: loan_model;
  gridApi;
  columnApi;
  pinnedBottomRowData;
  public getRowStyle;
  currentPageName : Page = Page.budget;
  // constructor() {

  // this.posts =[];
  // this.posts.push({title:"DIS",postText:"Wow greate post"});
  // this.posts.push({title:"THR", postText:"WoW"});
  // this.posts.push({title:"HAR", postText:"WoW"});

  //  }

  public cropPractices: Array<Loan_Crop_Practice>;
  constructor(public localstorageservice: LocalStorageService,
    public loanserviceworker: LoancalculationWorker,
    private budgetService: BudgetHelperService,
    public insuranceservice: InsuranceapiService,
    private toaster: ToastsManager,
    public logging: LoggingService,
    public alertify: AlertifyService,
    public loanapi: LoanApiService,
    private publishService : PublishService
  ) {


    this.columnDefs = [

      { headerName: 'Expense', field: 'FC_Expense_Name', editable: false },
      {
        headerName: "Per Acre Budget",
        children: [
          { headerName: 'ARM', field: 'ARM_Budget_Acre',hide:true, width: 120, cellClass: ['text-right'],
          valueFormatter:currencyFormatter},
          { headerName: 'Distributer', field: 'Distributor_Budget_Acre',hide:true, width: 120,cellClass: ['text-right'],
          valueFormatter:currencyFormatter},
          { headerName: '3rd Party', field: 'Third_Party_Budget_Acre',hide:true, width: 120,cellClass: ['text-right'],
          valueFormatter: currencyFormatter},
          { headerName: 'Total', field: 'Total_Budget_Acre', width: 120,hide:true,cellClass: ['text-right'], editable: false,
          valueFormatter: currencyFormatter },
        ]
      },
      {
        headerName: "Crop Budget",
        children: [
          { headerName: 'Additional Credit Notes', field: '',editable:true, width: 240, cellClass: ['text-right']},
          { headerName: 'ARM', field: 'ARM_Budget_Crop', editable: false,cellClass: ['text-right'],
          valueFormatter: currencyFormatter },
          { headerName: 'Distributer', field: 'Distributor_Budget_Crop', editable: false,cellClass: ['text-right'],
          valueFormatter: currencyFormatter },
          { headerName: '3rd Party', field: 'Third_Party_Budget_Crop', editable: false,cellClass: ['text-right'],
          valueFormatter: currencyFormatter},
          { headerName: 'Total', field: 'Total_Budget_Crop_ET', editable: false,cellClass: ['text-right'],
          valueFormatter: currencyFormatter},
        ]
      }
    ];

    this.getRowStyle = function (params) {
      if (params.node.rowPinned) {
        return { "font-weight": "bold", "background-color": "#F5F7F7" };
      }
    };

    this.localstorageservice.observe(environment.loankey).subscribe(res => {
      this.localLoanObject = res;
      this.bindData(this.localLoanObject);

    })

    this.localLoanObject = this.localstorageservice.retrieve(environment.loankey);
    //TODO-SANKET remove below line, once the api data is up to date
    //this.localLoanObject.LoanBudget.map(budget=> this.budgetService.muplitypePropsWithAcres(budget,this.cropPractice.LCP_Acres))
    this.localLoanObject.LoanBudget.map(budget => {

      budget.Total_Budget_Acre = parseFloat(budget.ARM_Budget_Acre.toString()) + parseFloat(budget.Distributor_Budget_Acre.toString()) + parseFloat(budget.Third_Party_Budget_Acre.toString());
      return budget;
    });
    //REMOVE END
    this.bindData(this.localLoanObject);
  }

  bindData(loanObject: loan_model) {
    if (loanObject.LoanCropPractices) {
      this.cropPractices = this.budgetService.prepareCropPractice(loanObject.LoanCropPractices);
      this.rowData = this.budgetService.getTotalTableData(loanObject.LoanBudget, this.cropPractices);
      this.pinnedBottomRowData = this.budgetService.getTotals(this.rowData);

    }
  }
  ngOnInit() {

  }

  style = {
    marginTop: '10px',
    width: '96%',
    height: '240px',
    boxSizing: 'border-box'
  };

  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;

    params.api.sizeColumnsToFit();
    this.getgridheight();
  }

  getgridheight() {
    this.style.height = (29 * (this.rowData.length + 3)).toString() + "px";
  }

  /**
   * Sync to database - publish button event
   */
  synctoDb() {
    this.publishService.syncCompleted();
    this.budgetService.syncToDb(this.localstorageservice.retrieve(environment.loankey));
  }

  // synctoDb() {

  //   this.loanapi.syncloanobject(this.localLoanObject).subscribe(res => {
  //     if (res.ResCode == 1) {
  //       this.loanapi.getLoanById(this.localLoanObject.Loan_Full_ID).subscribe(res => {
  //         //this.logging.checkandcreatelog(3, 'Overview', "APi LOAN GET with Response " + res.ResCode);
  //         if (res.ResCode == 1) {
  //           this.toaster.success("Records Synced");
  //           let jsonConvert: JsonConvert = new JsonConvert();
  //           this.loanserviceworker.performcalculationonloanobject(jsonConvert.deserialize(res.Data, loan_model));
  //         }
  //         else {
  //           this.toaster.error("Could not fetch Loan Object from API")
  //         }
  //       });
  //     }
  //     else {
  //       this.toaster.error("Error in Sync");
  //     }
  //   })

  // }
}
