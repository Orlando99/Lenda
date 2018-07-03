import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment.prod';
import { loan_model, Loan_Collateral} from '../../../models/loanmodel';
import { LocalStorageService } from 'ngx-webstorage';
import { LoancalculationWorker } from '../../../Workers/calculations/loancalculationworker';
import { LoggingService } from '../../../services/Logs/logging.service';
import { CropapiService } from '../../../services/crop/cropapi.service';
import { getNumericCellEditor } from '../../../Workers/utility/aggrid/numericboxes';
import { currencyFormatter, insuredFormatter,discFormatter, totalMarketValue, totalDiscValue, totalPriorLien, totalNetMktValue} from '../../../Workers/utility/aggrid/collateralboxes';
import { DeleteButtonRenderer } from '../../../aggridcolumns/deletebuttoncolumn';
import { AlertifyService } from '../../../alertify/alertify.service';
import { LoanApiService } from '../../../services/loan/loanapi.service';
import { ToastsManager } from 'ng2-toastr';
import { JsonConvert } from 'json2typescript';
import { SelectEditor } from '../../../aggridfilters/selectbox';

@Component({
  selector: 'app-fsa',
  templateUrl: './fsa.component.html',
  styleUrls: ['./fsa.component.scss']
})
export class FSAComponent implements OnInit {
  public refdata: any = {};
  public columnDefs = [];
  private localloanobject: loan_model = new loan_model();
 
  public rowData = [];
  public components;
  public context;
  public frameworkcomponents;
  public editType;
  public gridApi;
  public columnApi;
  public deleteAction = false;
  public pinnedBottomRowData;
  
  style = {
    marginTop: '10px',
    width: '97%',
    height: '110px',
    boxSizing: 'border-box'
  };
  
  constructor(public localstorageservice: LocalStorageService,
    private toaster: ToastsManager,
    public loanserviceworker: LoancalculationWorker,
    public cropunitservice: CropapiService,
    public logging: LoggingService,
    public alertify:AlertifyService,
    public loanapi:LoanApiService){ 

      this.components = { numericCellEditor: getNumericCellEditor()};
      this.refdata = this.localstorageservice.retrieve(environment.referencedatakey);
      this.frameworkcomponents = {selectEditor: SelectEditor, deletecolumn: DeleteButtonRenderer };
      
      this.columnDefs = [
        { headerName: 'Category', field: 'Collateral_Category_Code',  editable: false},
        { headerName: 'Description', field: 'Collateral_Description',  editable: true},
        { headerName: 'Mkt Value', field: 'Market_Value',  editable: true, cellEditor: "numericCellEditor", valueFormatter: currencyFormatter, cellStyle: { textAlign: "right" }},
        { headerName: 'Prior Lien', field: 'Prior_Lien_Amount',  editable: true,cellEditor: "numericCellEditor", valueFormatter: currencyFormatter, cellStyle: { textAlign: "right" }},
        { headerName: 'Lienholder', field: 'Lien_Holder',  editable: true,},
        { headerName: 'Net Mkt Value', field: 'Net_Market_Value',  editable: false, cellEditor: "numericCellEditor",valueFormatter: currencyFormatter, cellStyle: { textAlign: "right" }
          // valueGetter: function (params) {
          //   return setNetMktValue(params);}
        },
        { headerName: 'Discount %', field: 'Disc_Value',  editable: true,cellEditor: "numericCellEditor" , valueFormatter: discFormatter, cellStyle: { textAlign: "right" },
          pinnedRowCellRenderer: function(){ return '-';}},
        { headerName: 'Disc Value', field: 'Disc_CEI_Value',  editable: false, cellEditor: "numericCellEditor", cellStyle: { textAlign: "right" },
          // valueGetter: function (params) {
          //   return setDiscValue(params);
          // },
          valueFormatter: currencyFormatter},
        { headerName: 'Insured', field: 'Insured_Flag',  editable: true, cellEditor: "selectEditor",
          cellEditorParams:{
            values: [{'key':0, 'value':'No'}, {'key':1, 'value':'Yes'}]
          },pinnedRowCellRenderer: function(){ return ' ';},
          valueFormatter: insuredFormatter},
        { headerName: '', field: 'value',  cellRenderer: "deletecolumn",pinnedRowCellRenderer: function(){ return ' ';}}
      ];
 
      this.context = { componentParent: this }; 
  }
  
  ngOnInit() {
    this.localstorageservice.observe(environment.loankey).subscribe(res => {
      this.logging.checkandcreatelog(1, 'LoanCollateral', "LocalStorage updated");
      this.localloanobject = res
      this.rowData=[];
      this.rowData=this.localloanobject.LoanCollateral.filter(lc=>{ return lc.Collateral_Category_Code === "FSA" && lc.ActionStatus !== 3});
      this.pinnedBottomRowData = this.computeTotal(this.rowData);
        this.getgridheight();
        this.adjustgrid();
    });
   
    this.getdataforgrid();
  }

  getdataforgrid() {
    debugger
    let obj: any = this.localstorageservice.retrieve(environment.loankey);
    this.logging.checkandcreatelog(1, 'LoanCollateral', "LocalStorage retrieved");
    if (obj != null && obj != undefined) {
      this.localloanobject = obj;
      this.rowData=[];
      this.rowData=this.localloanobject.LoanCollateral.filter(lc=>{ return lc.Collateral_Category_Code === "FSA" && lc.ActionStatus !== 3});
      this.pinnedBottomRowData = this.computeTotal(this.rowData);
    }
    this.getgridheight();
    this.adjustgrid();
  }
  onGridSizeChanged(Event: any) {
    debugger
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
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.getgridheight();
    this.adjustgrid();
  }
 
  syncenabled(){
    return this.rowData.filter(p=>p.ActionStatus!=null).length>0 || this.deleteAction
  }

  synctoDb(){
    this.loanapi.syncloanobject(this.localloanobject).subscribe(res=>{
      if(res.ResCode == 1){
        this.deleteAction = false;
        this.loanapi.getLoanById(this.localloanobject.Loan_Full_ID).subscribe(res => {
          this.logging.checkandcreatelog(3,'Overview',"APi LOAN GET with Response "+res.ResCode);
          if (res.ResCode == 1) {
            this.toaster.success("Records Synced");
            let jsonConvert: JsonConvert = new JsonConvert();
            this.loanserviceworker.performcalculationonloanobject(jsonConvert.deserialize(res.Data, loan_model));
          }
          else{
            this.toaster.error("Could not fetch Loan Object from API")
          }
        });
      }
      else{
        this.toaster.error("Error in Sync");
      }
    });
  }

  //Grid Events
  addrow() {
    var newItem = new Loan_Collateral();
    newItem.Collateral_Category_Code = "FSA";
    newItem.Loan_Full_ID = this.localloanobject.Loan_Full_ID
    newItem.ActionStatus = 1;
    var res = this.rowData.push(newItem);
    this.localloanobject.LoanCollateral.push(newItem);
    this.gridApi.setRowData(this.rowData);
    this.gridApi.startEditingCell({
      rowIndex: this.rowData.length-1,
      colKey: "Collateral_Description" 
    });
    this.getgridheight();
  }

  rowvaluechanged(value: any) {
    var obj = value.data;
    if (obj.Collateral_ID  == 0) {
      obj.ActionStatus = 1;
      this.localloanobject.LoanCollateral[this.localloanobject.LoanCollateral.length-1]=value.data;
    }
    else {
      var rowindex=this.localloanobject.LoanCollateral.findIndex(lc=>lc.Collateral_ID==obj.Collateral_ID);
      if(obj.ActionStatus!=1)
        obj.ActionStatus = 2;
      this.localloanobject.LoanCollateral[rowindex]=obj;
    }
    this.loanserviceworker.performcalculationonloanobject(this.localloanobject);
  }

  DeleteClicked(rowIndex: any) {
    this.alertify.confirm("Confirm", "Do you Really Want to Delete this Record?").subscribe(res => {
      if (res == true) {
        var obj = this.rowData[rowIndex];
        if (obj.Collateral_ID == 0) {
          this.rowData.splice(rowIndex, 1);
          this.localloanobject.LoanCollateral.splice(this.localloanobject.LoanCollateral.indexOf(obj), 1);
        }else {
          this.deleteAction = true;
          obj.ActionStatus = 3;
        }
        this.loanserviceworker.performcalculationonloanobject(this.localloanobject);
      }
    })
  }

  getgridheight(){
    this.style.height=(29*(this.rowData.length+2)-2).toString()+"px";
  }


  computeTotal(rowData) {
    var total = []
    var footer = new Loan_Collateral();
    footer.Collateral_Category_Code = 'Total';
    footer.Market_Value = totalMarketValue(rowData);
    footer.Prior_Lien_Amount = totalPriorLien(rowData);
    footer.Lien_Holder = '';
    footer.Net_Market_Value = totalNetMktValue(rowData);
    footer.Disc_Value = 0;
    footer.Disc_CEI_Value = totalDiscValue(rowData);;

    total.push(footer);
    return total;
  }
}
