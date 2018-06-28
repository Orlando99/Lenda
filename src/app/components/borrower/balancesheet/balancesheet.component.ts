import { Component, OnInit } from '@angular/core';
import { borrower_model, loan_model } from '../../../models/loanmodel';
import { environment } from '../../../../environments/environment.prod';
import { JsonConvert } from 'json2typescript';
import { LocalStorageService } from 'ngx-webstorage';
import { LoancalculationWorker } from '../../../Workers/calculations/loancalculationworker';
import { modelparserfordb } from '../../../Workers/utility/modelparserfordb';
import { BorrowerapiService } from '../../../services/borrower/borrowerapi.service';
import { ToastsManager } from 'ng2-toastr';
import { LoggingService } from '../../../services/Logs/logging.service';

@Component({
  selector: 'app-balancesheet',
  templateUrl: './balancesheet.component.html',
  styleUrls: ['./balancesheet.component.scss']
})
export class BalancesheetComponent implements OnInit {

  private localloanobject: loan_model = new loan_model();
  public syncenabled = false;
  // Aggrid
  public rowData = [];
  public pinnedBottomRowData = [];
  public getRowClass;
  private gridApi;
  private columnApi;
   //region Ag grid Configuration

   columnDefs = [
    { headerName: 'Financials', field: 'Financials' },
    { headerName: 'Assets', field: 'Assets',editable:true },
    { headerName: 'Discount', field: 'Discount',editable:true },
    { headerName: 'AdjValue', field: 'AdjValue' },
    { headerName: 'Debt', field: 'Debt',editable:true },
    { headerName: 'Discounted NW', field: 'DiscountedNW' }
  ];

  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();
    window.onresize = () => {
        this.gridApi.sizeColumnsToFit();
    }
}
  //End here
  // Aggrid ends
  constructor(public localstorageservice: LocalStorageService,
    public loanserviceworker: LoancalculationWorker,
    public borrowerservice: BorrowerapiService,
    private toaster: ToastsManager,
    public logging: LoggingService
  ) {

    this.getRowClass = function(params) {
      if (params.node.rowPinned) {
        return  'ag-aggregate-row';
      }
    };
  }

  ngOnInit() {
    this.localstorageservice.observe(environment.loankey).subscribe(res => {
      this.logging.checkandcreatelog(1, 'BalanceSheet', "LocalStorage updated");
      this.localloanobject = res;
      this.rowData=[];
      this.pinnedBottomRowData=[];
      this.prepareviewmodel();
    })
    this.getdataforgrid();
    this.prepareviewmodel();
  }
  getdataforgrid() {
    let obj: any = this.localstorageservice.retrieve(environment.loankey);
    this.logging.checkandcreatelog(1, 'BalanceSheet', "LocalStorage retrieved");
    if (obj != null && obj != undefined) {
      this.localloanobject = obj;
    }
  }

  // Ag grid Editing Event
  celleditingstopped(event: any) {

    var financetype=event.data.Financials;
    if(financetype=="Long Term"){
      financetype="Fixed";
    }
  var property="";
  if(event.colDef.field=="Discount")
  {
    property="Borrower_"+financetype+"_Assets_Disc";
  }
  if(event.colDef.field=="Assets")
  {
  property="Borrower_"+financetype+"_"+event.colDef.field;
  }
  if(event.colDef.field=="Debt")
  {
    property="Borrower_"+financetype+"_Liabilities";
  }
  this.localloanobject.Borrower[property]=parseFloat(event.value);
  this.logging.checkandcreatelog(3,'BalanceSheet',"Field Edited -"+property);
  this.loanserviceworker.performcalculationonloanobject(this.localloanobject);
  }

  //Aggrid Data Preperation
  prepareviewmodel() {
    //prepare three rows here
      //1st Current Financial Row
      var currentobj={Financials:'Current',Assets:this.localloanobject.Borrower.Borrower_Current_Assets,Discount:this.localloanobject.Borrower.Borrower_Current_Assets_Disc,
      AdjValue:this.localloanobject.Borrower.FC_Borrower_Current_Adjvalue,Debt:this.localloanobject.Borrower.Borrower_Current_Liabilities,DiscountedNW:this.localloanobject.Borrower.FC_Borrower_Current_Discvalue}
      this.rowData.push(currentobj);

       //1st Intermediate Financial Row
      var Intermediateobj={Financials:'Intermediate',Assets:this.localloanobject.Borrower.Borrower_Intermediate_Assets,Discount:this.localloanobject.Borrower.Borrower_Intermediate_Assets_Disc,
      AdjValue:this.localloanobject.Borrower.FC_Borrower_Intermediate_Adjvalue,Debt:this.localloanobject.Borrower.Borrower_Intermediate_Liabilities,DiscountedNW:this.localloanobject.Borrower.FC_Borrower_Intermediate_Discvalue}
      this.rowData.push(Intermediateobj)


       //1st LongTerm Financial Row
       var LongTermobj={Financials:'Long Term',Assets:this.localloanobject.Borrower.Borrower_Fixed_Assets,Discount:this.localloanobject.Borrower.Borrower_Fixed_Assets_Disc,
       AdjValue:this.localloanobject.Borrower.FC_Borrower_Fixed_Adjvalue,Debt:this.localloanobject.Borrower.Borrower_Fixed_Liabilities,DiscountedNW:this.localloanobject.Borrower.FC_Borrower_Fixed_Discvalue}
       this.rowData.push(LongTermobj)

       //Last Aggregate Row
       var Aggregateobj={Financials:'Total',Assets:this.localloanobject.Borrower.FC_Borrower_TotalAssets,Discount:'',
       AdjValue:this.localloanobject.Borrower.FC_Borrower_Total_Adjvalue,Debt:this.localloanobject.Borrower.FC_Borrower_TotalDebt,DiscountedNW:this.localloanobject.Borrower.FC_Borrower_Total_Discvalue}
       this.pinnedBottomRowData.push(Aggregateobj);

  }
  //ends here
  synctoDb() {
    var obj = modelparserfordb(this.localloanobject.Borrower);
    this.borrowerservice.saveupdateborrower(obj).subscribe(res => {
      this.logging.checkandcreatelog(3, 'BalanceSheet', "Code Synced to DB with ResCode " + res.ResCode);
      if (res.ResCode == 1) {
        this.toaster.success("Object Synced Successfully");
      }
      else {
        this.toaster.error("Error Encountered while Syncing");
      }
    });
  }

}
