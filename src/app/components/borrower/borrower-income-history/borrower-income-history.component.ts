import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment.prod';
import { loan_model, Loan_Collateral } from '../../../models/loanmodel';
import { LocalStorageService } from 'ngx-webstorage';
import { LoancalculationWorker } from '../../../Workers/calculations/loancalculationworker';
import { LoggingService } from '../../../services/Logs/logging.service';
import { CropapiService } from '../../../services/crop/cropapi.service';
import { getNumericCellEditor } from '../../../Workers/utility/aggrid/numericboxes';
import { currencyFormatter, insuredFormatter, discFormatter } from '../../../Workers/utility/aggrid/collateralboxes';
import { DeleteButtonRenderer } from '../../../aggridcolumns/deletebuttoncolumn';
import { AlertifyService } from '../../../alertify/alertify.service';
import { LoanApiService } from '../../../services/loan/loanapi.service';
import { ToastsManager } from 'ng2-toastr';
import { JsonConvert } from 'json2typescript';
import { SelectEditor } from '../../../aggridfilters/selectbox';
import { GridOptions } from '../../../../../node_modules/ag-grid';
import { debug } from 'util';

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

  public gridApi;
  public columnApi;
  public cropYear;
  public years = [];

  style = {
    marginTop: '10px',
    width: '97%',
    height: '110px',
    boxSizing: 'border-box'
  };

  constructor(public localstorageservice: LocalStorageService,
    public loanserviceworker: LoancalculationWorker,
    public cropunitservice: CropapiService,
    public logging: LoggingService,
    public alertify: AlertifyService,
    public loanapi: LoanApiService) {

    this.refdata = this.localstorageservice.retrieve(environment.referencedatakey);
    this.columnDefs = [
      { headerName: 'Year', field: 'Borrower_Year',editable: false, width: 100 },
      { headerName: 'Revenue', field: 'Borrower_Revenue', editable: false,  valueFormatter: currencyFormatter, cellStyle: { textAlign: "right" }},
      { headerName: 'Expenses', field: 'Borrower_Expense', editable: false, valueFormatter: currencyFormatter, cellStyle: { textAlign: "right" } },
      { headerName: 'Income', field: 'FC_Borrower_Income',editable: false, valueFormatter: currencyFormatter, cellStyle: { textAlign: "right" }}
    ];
    this.context = { componentParent: this };
    
  }

  ngOnInit() {
    console.log('rowData', this.rowData);
    this.localstorageservice.observe(environment.loankey).subscribe(res => {
        this.logging.checkandcreatelog(1, 'Borrower - IncomeHistory', "LocalStorage updated");
        this.localloanobject = res
        this.rowData = [];
        this.rowData = this.setData(this.localloanobject.BorrowerIncomeHistory);
        this.localloanobject.BorrowerIncomeHistory = this.rowData;
        this.getgridheight();
      // this.adjustgrid();
    });
    this.getdataforgrid();
  }


  getdataforgrid() {
    let obj: any = this.localstorageservice.retrieve(environment.loankey);
    this.logging.checkandcreatelog(1, 'Borrower - IncomeHistory', "LocalStorage updated");
    if (obj != null && obj != undefined) {
       debugger
        this.localloanobject = obj;
        this.rowData = [];
        this.rowData = this.setData(this.localloanobject.BorrowerIncomeHistory);
        // this.localloanobject.BorrowerIncomeHistory = this.rowData;
    }
    this.getgridheight();
    this.adjustgrid();
  }
  
  setData(params){
    let incomeData = [];
    let incomeHistory = params
    this.cropYear = this.localloanobject.LoanMaster[0].Crop_Year;

    for(let i=1; i<5;i++){
        this.years.push(this.cropYear - i);
    };
    
    let duplicate = [];
    this.years.forEach(ye =>{
      incomeData.push({
        BIH_ID : 0,
        Borrower_ID: 0,
        Loan_Full_ID: this.localloanobject.Loan_Full_ID,
        Borrower_Year: ye,
        Borrower_Expense: '-',
        Borrower_Revenue: '-',
        FC_Borrower_Income: '-',
        Status: 0})
    });

    incomeData.forEach(ih =>{
      incomeHistory.forEach(id => {
         if(ih.Borrower_Year === id.Borrower_Year){
           console.log(ih);
           ih.BIH_ID = id.BIH_ID;
           ih.Borrower_Expense = id.Borrower_Expense;
           ih.Borrower_Revenue = id.Borrower_Revenue;
           ih.FC_Borrower_Income = id.FC_Borrower_Income;
         }
      });
    });

    return incomeData;
  }


  onGridSizeChanged(Event: any) {

    this.adjustgrid();
  }
  private adjustgrid() {
    try {
      this.gridApi.sizeColumnsToFit();
    }
    catch {
    }
  }

  onGridReady(params) {
    debugger
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.getgridheight();
    this.adjustgrid();
  }

  getgridheight() {
    this.style.height = (30 * (this.rowData.length + 2) - 2).toString() + "px";
  }

}
