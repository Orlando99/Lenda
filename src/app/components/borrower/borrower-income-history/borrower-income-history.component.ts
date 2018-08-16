import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment.prod';
import { loan_model } from '../../../models/loanmodel';
import { LocalStorageService } from 'ngx-webstorage';
import { LoancalculationWorker } from '../../../Workers/calculations/loancalculationworker';
import { LoggingService } from '../../../services/Logs/logging.service';
import { CropapiService } from '../../../services/crop/cropapi.service';
import { getNumericCellEditor } from '../../../Workers/utility/aggrid/numericboxes';
import { AlertifyService } from '../../../alertify/alertify.service';
import { LoanApiService } from '../../../services/loan/loanapi.service';
import { ToastsManager } from 'ng2-toastr';
import * as  _ from 'lodash';
import { setgriddefaults } from '../../../aggriddefinations/aggridoptions';
import { Page, PublishService } from '../../../services/publish.service';
import { currencyFormatter } from '../../../aggridformatters/valueformatters';

@Component({
  selector: 'app-borrower-income-history',
  templateUrl: './borrower-income-history.component.html',
  styleUrls: ['./borrower-income-history.component.scss']
})
export class BorrowerIncomeHistoryComponent implements OnInit {
  public refdata: any = {};
  public columnDefs = [];
  private localloanobject: loan_model = new loan_model();
  public rowData = [];
  public context;
  public components;
  public gridApi;
  public columnApi;
  public cropYear;

  style = {
    marginTop: '10px',
    width: '97%',
    boxSizing: 'border-box'
  };

  constructor(public localstorageservice: LocalStorageService,
    public loanserviceworker: LoancalculationWorker,
    private toaster: ToastsManager,
    public cropunitservice: CropapiService,
    public logging: LoggingService,
    public alertify: AlertifyService,
    public loanapi: LoanApiService,
    private publishService : PublishService) {

    this.components = { numericCellEditor: getNumericCellEditor() };
    this.refdata = this.localstorageservice.retrieve(environment.referencedatakey);
    this.columnDefs = [
      { headerName: 'Year', field: 'Borrower_Year',editable: false, width: 100 },
      { headerName: 'Revenue', field: 'Borrower_Revenue', editable: true, cellClass: ['editable-color','text-right'],cellEditor: "numericCellEditor", valueFormatter: currencyFormatter},
      { headerName: 'Expenses', field: 'Borrower_Expense', editable: true, cellClass: ['editable-color','text-right'], cellEditor: "numericCellEditor", valueFormatter: currencyFormatter },
      { headerName: 'Income', field: 'FC_Borrower_Income',editable: false, valueFormatter: currencyFormatter, cellStyle: { textAlign: "right" }}
    ];
    this.context = { componentParent: this };

  }

  ngOnInit() {
    this.localstorageservice.observe(environment.loankey).subscribe(res => {
      // this.logging.checkandcreatelog(1, 'Borrower - IncomeHistory', "LocalStorage updated");
      this.localloanobject = res
      
      if (res.srccomponentedit == "BorrowerIncomeHistoryComponent") {
        //if the same table invoked the change .. change only the edited row
        this.localloanobject = res;
        this.rowData[res.lasteditrowindex] =  this.setData(this.localloanobject.BorrowerIncomeHistory)[res.lasteditrowindex];
      }else{
        this.localloanobject = res
        this.rowData = [];
        this.rowData = this.setData(this.localloanobject.BorrowerIncomeHistory);
        this.localloanobject.BorrowerIncomeHistory = this.rowData;
      }
      
      this.gridApi && this.gridApi.refreshCells();
      // this.adjustgrid();
    });
    this.getdataforgrid();
  }


  getdataforgrid() {
    let obj: any = this.localstorageservice.retrieve(environment.loankey);
    // this.logging.checkandcreatelog(1, 'Borrower - IncomeHistory', "LocalStorage updated");
    if (obj != null && obj != undefined) {
      this.localloanobject = obj;
      this.rowData = [];
      this.rowData = this.setData(this.localloanobject.BorrowerIncomeHistory);
      this.localloanobject.BorrowerIncomeHistory = this.rowData;
    }
  
    //this.adjustgrid();
  }

  setData(params) {
    let incomeData = [];
    let incomeHistory = params
    let years = []
    this.cropYear = this.localloanobject.LoanMaster[0].Crop_Year;

    for (let i = 1; i < 6; i++) {
      years.push(this.cropYear - i);
    };

    years.forEach(ye => {
      incomeData.push({
        BIH_ID: 0,
        Borrower_ID: 0,
        Loan_Full_ID: this.localloanobject.Loan_Full_ID,
        Borrower_Year: ye,
        Borrower_Expense: '',
        Borrower_Revenue: '',
        FC_Borrower_Income: '',
        Status: 0,
        ActionStatus: 0
      })
    });

    incomeData.forEach(ih => {
      incomeHistory.forEach(id => {
        if (ih.Borrower_Year === id.Borrower_Year) {
          ih.BIH_ID = id.BIH_ID;
          ih.Borrower_Expense = id.Borrower_Expense;
          ih.Borrower_Revenue = id.Borrower_Revenue;
          ih.FC_Borrower_Income = id.FC_Borrower_Income;
          ih.ActionStatus = id.ActionStatus;
        }
      });
    });

    return incomeData;
  }

  // synctoDb() {
  //   this.loanapi.syncloanobject(this.localloanobject).subscribe(res => {
  //     if (res.ResCode == 1) {
  //       this.loanapi.getLoanById(this.localloanobject.Loan_Full_ID).subscribe(res => {
  //         this.logging.checkandcreatelog(3, 'Overview', "APi LOAN GET with Response " + res.ResCode);
  //         if (res.ResCode == 1) {
  //           this.toaster.success("Records Synced");
  //           let jsonConvert: JsonConvert = new JsonConvert();
  //           this.localloanobject = res.Data;
  //           this.rowData = this.setData(this.localloanobject.BorrowerIncomeHistory);
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
  //   });
  // }

  syncenabled() {
    if (this.localloanobject.BorrowerIncomeHistory.filter(p => p.ActionStatus == 2).length == 0) {
      return 'disabled';
    } else {
      return '';
    }
  }

  rowvaluechanged(value: any) {
    var obj = value.data;
    var rowindex = this.localloanobject.BorrowerIncomeHistory.findIndex(lc => lc.Borrower_Year == obj.Borrower_Year);
    obj.ActionStatus = 2;
    this.localloanobject.BorrowerIncomeHistory[rowindex] = obj;
    this.loanserviceworker.performcalculationonloanobject(this.localloanobject);

    //this shall have the last edit
    this.localloanobject.srccomponentedit = "BorrowerIncomeHistoryComponent";
    this.localloanobject.lasteditrowindex = value.rowIndex;
    this.publishService.enableSync(Page.borrower);
  }

  onGridSizeChanged(Event: any) {
    //this.adjustgrid();
  }

  // private adjustgrid() {
  //   try {
  //     this.gridApi.sizeColumnsToFit();
  //   }
  //   catch {
  //   }
  // }

  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    setgriddefaults(this.gridApi,this.columnApi);
  }

  

}
