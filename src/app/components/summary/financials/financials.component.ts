import { Component, OnInit } from '@angular/core';
import { loan_model, borrower_model } from '../../../models/loanmodel';
import { environment } from '../../../../environments/environment';
import { deserialize } from 'serializer.ts/Serializer';
import { JsonConvert } from 'json2typescript';
import { LocalStorageService } from 'ngx-webstorage';
import { LoggingService } from '../../../services/Logs/logging.service';


@Component({
  selector: 'app-financials',
  templateUrl: './financials.component.html',
  styleUrls: ['./financials.component.scss']
})
export class FinancialsComponent implements OnInit {
  private localborrowerobject: borrower_model;
  public allDataFetched = false;
  public rowData = [];
  public pinnedBottomRowData=[];
  private getRowClass;
  private gridApi;
  private columnApi;
  constructor(public localstorageservice: LocalStorageService, public logging: LoggingService) { 

    this.getRowClass = function(params) {
      debugger
      if (params.node.rowPinned) {
        debugger
        return  'ag-aggregate-row';
      }
    };

  }

  //region Ag grid Configuration

  columnDefs = [
    { headerName: 'Financials', field: 'Financials' },
    { headerName: 'Assets', field: 'Assets' },
    { headerName: 'Debt', field: 'Debt' },
    { headerName: 'Equity', field: 'Equity' },
    { headerName: 'Ratios', field: 'Ratios' },
    { headerName: 'FICO', field: 'FICO' },
    { headerName: 'Rating', field: 'Rating' }
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


  ngOnInit() {
    this.localstorageservice.observe(environment.loankey).subscribe(res => {
      // log
      this.logging.checkandcreatelog(1, 'financials', "LocalStorage updated");
      //
      this.localborrowerobject = res.Borrower;
      this.allDataFetched = true;
    })
    this.getdataforgrid();
  }

  getdataforgrid() {

    let obj: any = this.localstorageservice.retrieve(environment.loankey);
    this.logging.checkandcreatelog(1, 'financials', "LocalStorage retrieved");
    if (obj != null && obj != undefined) {
      this.localborrowerobject = obj.Borrower;
      this.allDataFetched = true;
      this.prepareviewmodel();
    }
  }
  prepareviewmodel() {
    //prepare three rows here
      //1st Current Financial Row 
      var currentobj={Financials:'Current',Assets:this.localborrowerobject.Borrower_Current_Assets,Debt:this.localborrowerobject.Borrower_Current_Liabilities,
      Equity:this.localborrowerobject.FC_Borrower_Current_Equity,Ratios:this.localborrowerobject.FC_Borrower_Current_Ratio,FICO:this.localborrowerobject.FC_Borrower_FICO,Rating:'-'}
      this.rowData.push(currentobj);

       //1st Intermediate Financial Row 
      var Intermediateobj={Financials:'Intermediate',Assets:this.localborrowerobject.Borrower_Intermediate_Assets,Debt:this.localborrowerobject.Borrower_Intermediate_Liabilities,
      Equity:this.localborrowerobject.FC_Borrower_Intermediate_Equity,Ratios:"",FICO:"",Rating:'-'}
      this.rowData.push(Intermediateobj)

      
       //1st LongTerm Financial Row 
       var LongTermobj={Financials:'Long Term',Assets:this.localborrowerobject.Borrower_Fixed_Assets,Debt:this.localborrowerobject.Borrower_Fixed_Liabilities,
       Equity:this.localborrowerobject.FC_Borrower_Fixed_Equity,Ratios:"",FICO:"",Rating:'-'}
       this.rowData.push(LongTermobj)

       //Last Aggregate Row
       var Aggregateobj={Financials:'Total Financials',Assets:this.localborrowerobject.FC_Borrower_TotalAssets,Debt:this.localborrowerobject.FC_Borrower_TotalDebt,
       Equity:this.localborrowerobject.FC_Borrower_TotalEquity,Ratios:this.localborrowerobject.FC_Borrower_NetRatio.toString() +' % Debt/Equity',FICO:"Financials as of",Rating:new Date(this.localborrowerobject.Borrower_Financials_Date).toLocaleDateString()}
       this.pinnedBottomRowData.push(Aggregateobj);

  }



}
