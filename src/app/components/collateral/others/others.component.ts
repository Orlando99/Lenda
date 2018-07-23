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
import { getAlphaNumericCellEditor } from '../../../Workers/utility/aggrid/alphanumericboxes';

@Component({
  selector: 'app-others',
  templateUrl: './others.component.html',
  styleUrls: ['./others.component.scss']
})
export class OthersComponent implements OnInit {
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
  public rowClassRules;

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
    public alertify: AlertifyService,
    public loanapi: LoanApiService) {


    this.components = { numericCellEditor: getNumericCellEditor(),  alphaNumeric: getAlphaNumericCellEditor() };
    this.refdata = this.localstorageservice.retrieve(environment.referencedatakey);
    this.frameworkcomponents = { selectEditor: SelectEditor, deletecolumn: DeleteButtonRenderer };

    this.columnDefs = [
      { headerName: 'Category', field: 'Collateral_Category_Code', editable: false, width: 100 },
      { headerName: 'Description', field: 'Collateral_Description', editable: true, width: 120, cellEditor: "alphaNumeric", cellClass: ['editable-color']},
      { headerName: 'Mkt Value', field: 'Market_Value', editable: true, cellEditor: "numericCellEditor", valueFormatter: currencyFormatter, cellClass: ['editable-color','text-right'] },
      { headerName: 'Prior Lien', field: 'Prior_Lien_Amount', editable: true, cellEditor: "numericCellEditor", valueFormatter: currencyFormatter, cellStyle: { textAlign: "right" }, cellClass: ['editable-color','text-right'] },
      { headerName: 'Lienholder', field: 'Lien_Holder', editable: true, width: 130,cellClass: 'editable-color', cellEditor: "alphaNumeric"},
      {
        headerName: 'Net Mkt Value', field: 'Net_Market_Value', editable: false, cellEditor: "numericCellEditor", valueFormatter: currencyFormatter, cellClass: ['text-right']
        // valueGetter: function (params) {
        //   return setNetMktValue(params);}
      },
      {
        headerName: 'Discount %', field: 'Disc_Value', editable: true, cellEditor: "numericCellEditor", valueFormatter: discFormatter, cellClass: ['editable-color','text-right'] , width: 130,
        pinnedRowCellRenderer: function () { return '-'; }
      },
      {
        headerName: 'Disc Value', field: 'Disc_CEI_Value', editable: false, cellEditor: "numericCellEditor",cellClass: ['text-right'],
        // valueGetter: function (params) {
        //   return setDiscValue(params);
        // },
        valueFormatter: currencyFormatter
      },
      {
        headerName: 'Insured', field: 'Insured_Flag', editable: true, cellEditor: "selectEditor", width: 100,cellClass: ['editable-color'] ,
        cellEditorParams: {
          values: [{ 'key': 0, 'value': 'No' }, { 'key': 1, 'value': 'Yes' }]
        }, pinnedRowCellRenderer: function () { return ' '; },
        valueFormatter: insuredFormatter
      },
      { headerName: '', field: 'value', cellRenderer: "deletecolumn", width: 80, pinnedRowCellRenderer: function () { return ' '; } }
    ];

    this.context = { componentParent: this };
  }

  ngOnInit() {
    this.localstorageservice.observe(environment.loankey).subscribe(res => {
      this.logging.checkandcreatelog(1, 'LoanCollateral - Others', "LocalStorage updated");
      if (res.srccomponentedit == "OthersComponent") {
        //if the same table invoked the change .. change only the edited row
        this.localloanobject = res;
        this.rowData[res.lasteditrowindex] = this.localloanobject.LoanCollateral.filter(lc => { return lc.Collateral_Category_Code === "OTR"  })[res.lasteditrowindex];
      } else {
        this.localloanobject = res
        this.rowData = [];
        this.rowData = this.localloanobject.LoanCollateral !== null ? this.localloanobject.LoanCollateral.filter(lc => { return lc.Collateral_Category_Code === "OTR" && lc.ActionStatus !==3  }) : [];
        this.pinnedBottomRowData = this.computeTotal(res);
      }
      this.getgridheight();
      this.gridApi.refreshCells();
      // this.adjustgrid();
    });

    this.getdataforgrid();
  }

  getdataforgrid() {

    let obj: any = this.localstorageservice.retrieve(environment.loankey);
    this.logging.checkandcreatelog(1, 'LoanCollateral - OTR', "LocalStorage retrieved");
    if (obj != null && obj != undefined) {
      this.localloanobject = obj;
      this.rowData = [];
      this.rowData = this.localloanobject.LoanCollateral !== null ? this.localloanobject.LoanCollateral.filter(lc => { return lc.Collateral_Category_Code === "OTR" && lc.ActionStatus !=3 }) : [];
      this.pinnedBottomRowData = this.computeTotal(obj);
    }
    this.getgridheight();
    this.adjustgrid();
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
    
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.getgridheight();
    this.adjustgrid();
  }

  syncenabled() {
   
    return this.rowData.filter(p => p.ActionStatus != null).length > 0 || this.deleteAction
  }

  synctoDb() {
    this.loanapi.syncloanobject(this.localloanobject).subscribe(res => {
      if (res.ResCode == 1) {
        this.deleteAction = false;
        this.loanapi.getLoanById(this.localloanobject.Loan_Full_ID).subscribe(res => {
          this.logging.checkandcreatelog(3, 'Overview', "APi LOAN GET with Response " + res.ResCode);
          if (res.ResCode == 1) {
            this.toaster.success("Records Synced");
            let jsonConvert: JsonConvert = new JsonConvert();
            this.loanserviceworker.performcalculationonloanobject(jsonConvert.deserialize(res.Data, loan_model));
          }
          else {
            this.toaster.error("Could not fetch Loan Object from API")
          }
        });
      }
      else {
        this.toaster.error("Error in Sync");
      }
    });
  }

  //Grid Events
  addrow() {
    if (this.localloanobject.LoanCollateral == null)
      this.localloanobject.LoanCollateral = [];

    var newItem = new Loan_Collateral();
    newItem.Collateral_Category_Code = "OTR";
    newItem.Loan_Full_ID = this.localloanobject.Loan_Full_ID
    newItem.Disc_Value = 50;
    newItem.ActionStatus = 1;
    var res = this.rowData.push(newItem);
    this.localloanobject.LoanCollateral.push(newItem);
    this.gridApi.setRowData(this.rowData);
    this.gridApi.startEditingCell({
      rowIndex: this.rowData.length - 1,
      colKey: "Collateral_Description"
    });
    this.getgridheight();
  }

  rowvaluechanged(value: any) {
    var obj = value.data;
    if (obj.Collateral_ID == 0) {
      obj.ActionStatus = 1;
      this.localloanobject.LoanCollateral[this.localloanobject.LoanCollateral.length - 1] = value.data;
    }
    else {
      var rowindex = this.localloanobject.LoanCollateral.findIndex(lc => lc.Collateral_ID == obj.Collateral_ID);
      if (obj.ActionStatus != 1)
        obj.ActionStatus = 2;
      this.localloanobject.LoanCollateral[rowindex] = obj;
    }
    //this shall have the last edit
    this.localloanobject.srccomponentedit = "OthersComponent";
    this.localloanobject.lasteditrowindex = value.rowIndex;
    this.loanserviceworker.performcalculationonloanobject(this.localloanobject);
  }

  DeleteClicked(rowIndex: any) {
    this.alertify.confirm("Confirm", "Do you Really Want to Delete this Record?").subscribe(res => {
      if (res == true) {
        var obj = this.rowData[rowIndex];
        if (obj.Collateral_ID == 0) {
          this.rowData.splice(rowIndex, 1);
          this.localloanobject.LoanCollateral.splice(this.localloanobject.LoanCollateral.indexOf(obj), 1);
        } else {
          this.deleteAction = true;
          obj.ActionStatus = 3;
        }
        this.loanserviceworker.performcalculationonloanobject(this.localloanobject);
      }
    })
  }

  expansionopen()
  {
    setTimeout(() => {
      adjustparentheight();
    }, 10);
  
  }
  getgridheight() {
    this.style.height = (30 * (this.rowData.length + 2) - 2).toString() + "px";
  }


  computeTotal(loanobject) {
    var total = []
    try {
      var footer = new Loan_Collateral();
      footer.Collateral_Category_Code = 'Total';
      footer.Market_Value = loanobject.LoanMaster[0].FC_Market_Value_other
      footer.Prior_Lien_Amount = loanobject.LoanMaster[0].FC_other_Prior_Lien_Amount
      footer.Lien_Holder = '';
      footer.Net_Market_Value = loanobject.LoanMaster[0].Net_Market_Value__Other
      footer.Disc_Value = 0;
      footer.Disc_CEI_Value = loanobject.LoanMaster[0].Disc_value_Other
      total.push(footer);
      return total;
    }
    catch
    {  // Means that Calculations have not Ended
      return total;
    }
  }
}
function adjustparentheight(){
  var elements= Array.from(document.getElementsByClassName("mat-expansion-panel-content"));
  
  elements.forEach(element => {
   debugger
    //find aggrid
    var aggrid=element.getElementsByClassName("ag-root-wrapper")[0];
     element.setAttribute("style","height:"+(aggrid.clientHeight+80).toString() +"px");
   });
 }