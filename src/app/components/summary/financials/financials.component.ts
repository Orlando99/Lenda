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
  private localborrowerobject: any;
  public allDataFetched = false;
  public rowData = [];
  public pinnedBottomRowData=[];
  public getRowClass;
  private gridApi;
  private columnApi;
  constructor(public localstorageservice: LocalStorageService, public logging: LoggingService) {

    this.getRowClass = function(params) {
      if (params.node.rowPinned) {
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
      this.localborrowerobject = res.LoanMaster[0];
      this.allDataFetched = true;
    })
    this.getdataforgrid();
  }

  getdataforgrid() {

    let obj: any = this.localstorageservice.retrieve(environment.loankey);
    this.logging.checkandcreatelog(1, 'financials', "LocalStorage retrieved");
    if (obj != null && obj != undefined) {
      this.localborrowerobject = obj.LoanMaster[0];
      this.allDataFetched = true;
      this.prepareviewmodel();
    }
  }
  prepareviewmodel() {
    //prepare three rows here
      //1st Current Financial Row
      var currentobj={Financials:'Current',Assets:'$ '+ this.localborrowerobject.Current_Assets ,Debt:'$ '+ this.localborrowerobject.Current_Liabilities ,
      Equity:'$ '+ (this.localborrowerobject.Current_Assets - this.localborrowerobject.Current_Liabilities) ,Ratios:(this.localborrowerobject.Current_Assets / this.localborrowerobject.Current_Liabilities),FICO: this.localborrowerobject.Credit_Score ,Rating: this.localborrowerobject.Borrower_Rating }
      this.rowData.push(currentobj);

       //1st Intermediate Financial Row
      var Intermediateobj={Financials:'Intermediate',Assets:'$ '+ this.localborrowerobject.Intermediate_Assets,Debt:'$ '+ this.localborrowerobject.Intermediate_Liabilities ,
      Equity:'$ '+ (this.localborrowerobject.Intermediate_Assets - this.localborrowerobject.Intermediate_Liabilities) ,Ratios:'',FICO:'',Rating:''}
      this.rowData.push(Intermediateobj)


       //1st LongTerm Financial Row
       var LongTermobj={Financials:'Long Term',Assets:'$ '+this.localborrowerobject.Fixed_Assets,Debt:'$ '+this.localborrowerobject.Fixed_Liabilities,
       Equity:'$ '+ (this.localborrowerobject.Fixed_Assets - this.localborrowerobject.Fixed_Liabilities) ,Ratios:'',FICO:'',Rating:''}
       this.rowData.push(LongTermobj)

       //Last Aggregate Row
       var Aggregateobj={Financials:'Total Financials',Assets:this.localborrowerobject.FC_Borrower_TotalAssets,Debt:this.localborrowerobject.FC_Borrower_TotalDebt,
       Equity:this.localborrowerobject.FC_Borrower_TotalEquity,Ratios:this.localborrowerobject.FC_Borrower_NetRatio.toString() +' % Debt/Equity',FICO:"Financials as of",Rating:new Date(this.localborrowerobject.Borrower_Financials_Date).toLocaleDateString()}
       this.pinnedBottomRowData.push(Aggregateobj);

  }



}
