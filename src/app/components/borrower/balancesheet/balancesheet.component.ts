import { Component, OnInit } from '@angular/core';
import { loan_model } from '../../../models/loanmodel';
import { environment } from '../../../../environments/environment.prod';
import { JsonConvert } from 'json2typescript';
import { LocalStorageService } from 'ngx-webstorage';
import { LoancalculationWorker } from '../../../Workers/calculations/loancalculationworker';
import { modelparserfordb } from '../../../Workers/utility/modelparserfordb';
import { BorrowerapiService } from '../../../services/borrower/borrowerapi.service';
import { ToastsManager } from 'ng2-toastr';
import { LoggingService } from '../../../services/Logs/logging.service';
import { LoanApiService } from '../../../services/loan/loanapi.service';
import { getNumericCellEditor, numberValueSetter } from '../../../Workers/utility/aggrid/numericboxes';
import { PriceFormatter, PercentageFormatter } from '../../../Workers/utility/aggrid/formatters';
import { setgriddefaults } from '../../../aggriddefinations/aggridoptions';

@Component({
  selector: 'app-balancesheet',
  templateUrl: './balancesheet.component.html',
  styleUrls: ['./balancesheet.component.scss']
})
export class BalancesheetComponent implements OnInit {

  private localloanobject: loan_model = new loan_model();
  
  // Aggrid
  public rowData = [];
  public pinnedBottomRowData = [];
  public getRowClass;
  private gridApi;
  private columnApi;
  public components;
  public Financials_Date;
  public CPA_Prepared_Financials = false;
   //region Ag grid Configuration

   columnDefs = [
    { headerName: 'Financials', field: 'Financials', },
    { headerName: 'Assets', field: 'Assets', cellEditor: "numericCellEditor", cellClass: ['editable-color','text-right'], valueSetter: numberValueSetter,
    valueFormatter: function (params) {
      return PriceFormatter(params.value);
    },
    editable : (params)=>{
     return params.data.Financials !== 'Total';
    }  },
    { headerName: 'Discount', field: 'Discount', cellEditor: "numericCellEditor", cellClass: ['editable-color','text-right'], valueSetter: numberValueSetter,
    valueFormatter: function (params) {
      if(params.data.Financials !== 'Total'){
      return PercentageFormatter(params.value);
      }else{
        return '';
      }
    },
    editable : (params)=>{
     return params.data.Financials !== 'Total';
    }},
    { headerName: 'AdjValue', field: 'AdjValue',cellClass: ['text-right'],
    valueFormatter: function (params) {
      return PriceFormatter(params.value);
    }, },
    { headerName: 'Debt', field: 'Debt', cellEditor: "numericCellEditor", cellClass: ['editable-color','text-right'], valueSetter: numberValueSetter,
    valueFormatter: function (params) {
      return PriceFormatter(params.value);
    },
    editable : (params)=>{
     return params.data.Financials !== 'Total';
    }},
    { headerName: 'Discounted NW', field: 'DiscountedNW',cellClass: ['text-right'],
    valueFormatter: function (params) {
      return PriceFormatter(params.value);
    }, }
  ];

  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    // this.gridApi.sizeColumnsToFit();
    // window.onresize = () => {
    //     this.gridApi.sizeColumnsToFit();
    // }
    setgriddefaults(this.gridApi,this.columnApi);
}
  //End here
  // Aggrid ends
  constructor(public localstorageservice: LocalStorageService,
    public loanserviceworker: LoancalculationWorker,
    public borrowerservice: BorrowerapiService,
    private toaster: ToastsManager,
    public logging: LoggingService,
    private loanapi : LoanApiService
  ) {

    this.getRowClass = function(params) {
      if (params.node.rowPinned) {
        return  'ag-aggregate-row';
      }
    };

    this.components = { numericCellEditor: getNumericCellEditor() };
  }
  updaterownode(index,data){
     
    var rowNode = this.gridApi.getRowNode(index);
    Object.keys(data).forEach(element => {
      rowNode.setDataValue(element, data[element]);
    });
    
  }
  ngOnInit() {
    this.localstorageservice.observe(environment.loankey).subscribe(res => {
      // this.logging.checkandcreatelog(1, 'BalanceSheet', "LocalStorage updated");
      this.localloanobject = res;
      this.pinnedBottomRowData=[];
      this.CPA_Prepared_Financials = this.localloanobject.LoanMaster[0].CPA_Prepared_Financials? true : false;
      this.Financials_Date =  this.getFinancilaDate();
      
      let rows = this.prepareviewmodel();
       
      switch (this.localloanobject.srccomponentedit) {
        case 'Balancesheet-Current':
          this.updaterownode(0,rows[0]);
          break;
        case 'Balancesheet-Intermediate':
        this.updaterownode(1,rows[1]);
        break;
        case 'Balancesheet-Fixed':
        this.updaterownode(2,rows[2]);
        break;
      
        default:
        this.localloanobject.LoanMaster[0].ActionStatus=0;
        this.rowData = rows;

        break;
      }
      this.localloanobject.srccomponentedit = undefined;
      if(this.gridApi!=undefined){
        var params = { force: true };
        this.gridApi.refreshCells(params);
      }
    })
    this.getdataforgrid();
  }
  private getFinancilaDate() {
    let date = this.localloanobject.LoanMaster[0].Financials_Date || '';
    if (date) {
      date = this.formatDate(date);
      if (date == '1/1/1900') {
        return  '';
      }
      else {
        return  date;
      }
    }
    else {
      return  '';
    }
  }

  getdataforgrid() {
    let obj: any = this.localstorageservice.retrieve(environment.loankey);
    this.logging.checkandcreatelog(1, 'BalanceSheet', "LocalStorage retrieved");

    if (obj != null && obj != undefined) {
      this.localloanobject = obj;
      this.CPA_Prepared_Financials = this.localloanobject.LoanMaster[0].CPA_Prepared_Financials ? true : false;
      this.Financials_Date =  this.getFinancilaDate();
    }
    this.rowData = this.prepareviewmodel();
   
  }

  // Ag grid Editing Event
  celleditingstopped(event: any) {

    var financetypeOriginal=event.data.Financials;
    var financetype= '';
    if(financetypeOriginal=="Intermediate"){
      financetype="Inter";
    }else{
      financetype = financetypeOriginal;
    }
  var property="";
  if(event.colDef.field=="Discount")
  {
    property=financetype+"_Assets_Disc_Percent";
  }
  if(event.colDef.field=="Assets")
  {
  property=financetype+"_"+event.colDef.field;
  }
  if(event.colDef.field=="Debt")
  {
    property=financetype+"_Liabilities";
  }
  this.localloanobject.LoanMaster[0][property]=parseFloat(event.value);
  this.localloanobject.LoanMaster[0].ActionStatus=2;
  this.localloanobject.srccomponentedit = "Balancesheet-"+financetypeOriginal;
  this.logging.checkandcreatelog(3,'BalanceSheet',"Field Edited -"+property);
  this.loanserviceworker.performcalculationonloanobject(this.localloanobject);
  }

  //Aggrid Data Preperation
  prepareviewmodel() {
    //prepare three rows here
     
      let rows = [];
      if(this.localloanobject.LoanMaster){
        let loanMaster = this.localloanobject.LoanMaster[0];
        //1st Current Financial Row
        var currentobj={Financials:'Current',Assets:loanMaster.Current_Assets,Discount:loanMaster.Current_Assets_Disc_Percent,
        AdjValue:loanMaster.FC_Current_Adjvalue,Debt:loanMaster.Current_Liabilities,DiscountedNW:loanMaster.Current_Disc_Net_Worth}
        rows.push(currentobj);

        //1st Intermediate Financial Row
        var Intermediateobj={Financials:'Intermediate',Assets:loanMaster.Inter_Assets,Discount:loanMaster.Inter_Assets_Disc_Percent,
        AdjValue:loanMaster.FC_Inter_Adjvalue,Debt:loanMaster.Inter_Liabilities,DiscountedNW:loanMaster.Inter_Disc_Net_Worth}
        rows.push(Intermediateobj)


        //1st LongTerm Financial Row
        var LongTermobj={Financials:'Fixed',Assets:loanMaster.Fixed_Assets,Discount:loanMaster.Fixed_Assets_Disc_Percent,
        AdjValue:loanMaster.FC_Fixed_Adjvalue,Debt:loanMaster.Fixed_Liabilities,DiscountedNW:loanMaster.Fixed_Disc_Net_Worth}
        rows.push(LongTermobj)

        //Last Aggregate Row
        var Aggregateobj={Financials:'Total',Assets:loanMaster.Total_Assets,Discount:'',
        AdjValue:loanMaster.FC_Total_AdjValue,Debt:loanMaster.Total_Liabilities,DiscountedNW:loanMaster.Total_Disc_Net_Worth}
        this.pinnedBottomRowData.push(Aggregateobj);
      }
    return rows;

  }
  //ends here
  // synctoDb() {
  //   var obj = modelparserfordb(this.localloanobject.LoanMaster);
  //   this.borrowerservice.saveupdateborrower(obj).subscribe(res => {
  //     this.logging.checkandcreatelog(3, 'BalanceSheet', "Code Synced to DB with ResCode " + res.ResCode);
  //     if (res.ResCode == 1) {
  //       this.toaster.success("Object Synced Successfully");
  //     }
  //     else {
  //       this.toaster.error("Error Encountered while Syncing");
  //     }
  //   });
  // }
  updateLocalStorage(){
    this.localloanobject.LoanMaster[0].Financials_Date = this.formatDate(this.Financials_Date);
    this.localloanobject.Borrower.Borrower_CPA_Financials = this.formatDate(this.Financials_Date);

    this.localloanobject.LoanMaster[0].CPA_Prepared_Financials = this.CPA_Prepared_Financials ? 1 : 0;
    this.localloanobject.Borrower.CPA_Prepared_Financials = this.CPA_Prepared_Financials;
    this.loanserviceworker.performcalculationonloanobject(this.localloanobject);
  }
  formatDate(strDate) {
    if (strDate) {
      var date = new Date(strDate);
      return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
    } else {
      return '';
    }
  }
  synctoDb() {
    this.gridApi.showLoadingOverlay();	
    this.loanapi.syncloanobject(this.localloanobject).subscribe(res => {
      if (res.ResCode == 1) {
        this.loanapi.getLoanById(this.localloanobject.Loan_Full_ID).subscribe(res => {
          //this.logging.checkandcreatelog(3, 'Overview', "APi LOAN GET with Response " + res.ResCode);
          if (res.ResCode == 1) {
            this.toaster.success("Records Synced");
            let jsonConvert: JsonConvert = new JsonConvert();
            this.loanserviceworker.performcalculationonloanobject(jsonConvert.deserialize(res.Data, loan_model));
          }
          else {
            this.toaster.error("Could not fetch Loan Object from API")
          }
          this.gridApi.hideOverlay()
        });
      }
      else {
        this.gridApi.hideOverlay()
        this.toaster.error("Error in Sync");
      }
    })

  }

  
 syncenabled() {
  
  if(!(this.localloanobject.LoanMaster[0].ActionStatus == 2))
  return 'disabled';
  else
  return '';
}

}
