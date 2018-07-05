import { Component, OnInit } from '@angular/core';
import { modelparserfordb } from '../../../Workers/utility/modelparserfordb';
import { environment } from '../../../../environments/environment.prod';
import { loan_model } from '../../../models/loanmodel';
import { LocalStorageService } from 'ngx-webstorage';
import { LoancalculationWorker } from '../../../Workers/calculations/loancalculationworker';
import { ToastsManager } from 'ng2-toastr';
import { LoggingService } from '../../../services/Logs/logging.service';
import { LoancropunitcalculationworkerService } from '../../../Workers/calculations/loancropunitcalculationworker.service';
import { CropapiService } from '../../../services/crop/cropapi.service';
import { getNumericCellEditor, numberValueSetter } from '../../../Workers/utility/aggrid/numericboxes';
import { SelectEditor } from '../../../aggridfilters/selectbox';
import { DeleteButtonRenderer } from '../../../aggridcolumns/deletebuttoncolumn';
import { extractCropValues, lookupCropValue, Cropvaluesetter, getfilteredCropType, lookupCropTypeValue, CropTypevaluesetter } from '../../../Workers/utility/aggrid/cropboxes';
import { AlertifyService } from '../../../alertify/alertify.service';
import { Loan_Crop_Unit } from '../../../models/cropmodel';
import { JsonConvert } from 'json2typescript';
import { LoanApiService } from '../../../services/loan/loanapi.service';
import { PriceFormatter, PercentageFormatter } from '../../../Workers/utility/aggrid/formatters';

@Component({
  selector: 'app-price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.scss']
})
export class PriceComponent implements OnInit {
  public refdata: any = {};
  public columnDefs = [];
  private localloanobject: loan_model = new loan_model();
  // Aggrid
  public rowData = [];
  public components;
  public context;
  public frameworkcomponents;
  public editType;
  private gridApi;
  private columnApi;
  style = {
    marginTop: '10px',
    width: '97%',
    height: '240px',
    boxSizing: 'border-box'
  };
  defaultColDef: { headerComponentParams: { template: string; }; };
  //region Ag grid Configuration
  constructor(public localstorageservice: LocalStorageService,
    public loanserviceworker: LoancalculationWorker,
    public cropunitservice: CropapiService,
    private toaster: ToastsManager,
    public logging: LoggingService,
    public alertify: AlertifyService,
    public loanapi: LoanApiService
  ) {

    //Aggrid Specific Code
    this.frameworkcomponents = { selectEditor: SelectEditor, deletecolumn: DeleteButtonRenderer };
    this.components = { numericCellEditor: getNumericCellEditor() };
    this.refdata = this.localstorageservice.retrieve(environment.referencedatakey);

    this.defaultColDef = {
      headerComponentParams : {
      template:
          '<div class="ag-cell-label-container" role="presentation">' +
          '  <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>' +
          '  <div ref="eLabel" class="ag-header-cell-label" role="presentation">' +
          '    <span ref="eSortOrder" class="ag-header-icon ag-sort-order" ></span>' +
          '    <span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon" ></span>' +
          '    <span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon" ></span>' +
          '    <span ref="eSortNone" class="ag-header-icon ag-sort-none-icon" ></span>' +
          '    <div ref="eText" class="ag-header-cell-text" role="columnheader"> </div>' +
          '    <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>' +
          '  </div>' +
          '</div>'
      }
  };
    //Coldef here
    this.columnDefs = [
      {
        headerName: 'Crop', field: 'Crop_Code', cellClass: 'editable-color', editable: true, cellEditor: "selectEditor",
        cellEditorParams: {
          values: extractCropValues(this.refdata.CropList)
        },
        valueFormatter: function (params) {
          return lookupCropValue(params.colDef.cellEditorParams.values, params.value);
        },
        valueSetter: Cropvaluesetter
      },
      {
        headerName: 'Crop type', field: 'Crop_Type_Code', cellClass: 'editable-color', editable: true, cellEditor: "selectEditor",
        cellEditorParams: getfilteredCropType,
        valueFormatter: function (params) {
          return lookupCropTypeValue(params.value);
        },
        valueSetter: CropTypevaluesetter
      },
      { headerName: 'Crop Price', field: 'Z_Price', cellClass: 'editable-color', editable: true, cellEditor: "numericCellEditor", valueSetter: numberValueSetter,
      valueFormatter: function (params) {
        return PriceFormatter(params.value);
      }},
      { headerName: 'Basis Adj', field: 'Z_Basis_Adj', cellClass: 'editable-color', editable: true, cellEditor: "numericCellEditor", valueSetter: numberValueSetter ,
      valueFormatter: function (params) {
        return PriceFormatter(params.value);
      }},
      { headerName: 'Marketing Adj', field: 'Marketing_Adj', editable: false, cellEditor: "numericCellEditor", valueSetter: numberValueSetter,
      valueFormatter: function (params) {
        return PriceFormatter(params.value);
      } },
      { headerName: 'Rebate Adj', field: 'Z_Rebate_Adj', cellClass: 'editable-color', editable: true, cellEditor: "numericCellEditor", valueSetter: numberValueSetter,
      valueFormatter: function (params) {
        return PriceFormatter(params.value);
      }},
      { headerName: 'Adj Price', field: 'Z_Adj_Price', cellClass: 'editable-color', editable: true, cellEditor: "numericCellEditor", valueSetter: numberValueSetter ,
      valueFormatter: function (params) {
        return PriceFormatter(params.value);
      }},
      { headerName: 'Contract Qty', field: '', editable: false },
      { headerName: 'Contract Price', field: '', editable: false ,
      valueFormatter: function (params) {
        return PriceFormatter(params.value);
      }},
      { headerName: '% Booked', field: 'Booking_Ind', cellClass: 'editable-color', editable: true, cellEditor: "numericCellEditor", valueSetter: numberValueSetter,
      valueFormatter: function (params) {
        return PercentageFormatter(params.value);
      } },
      { headerName: 'Ins UOM', field: 'Bu', editable: false },
      { headerName: '', field: 'value', cellRenderer: "deletecolumn" },

    ];
    ///
    this.context = { componentParent: this };
    //
  }
  ngOnInit() {
    this.localstorageservice.observe(environment.loankey).subscribe(res => {
      this.logging.checkandcreatelog(1, 'CropPrice', "LocalStorage updated");
      if (res.srccomponentedit == "PriceComponent") {
        //if the same table invoked the change .. change only the edited row 
        this.localloanobject = res;
        this.rowData[res.lasteditrowindex] = this.localloanobject.LoanCropUnits.filter(p => p.ActionStatus != 3)[res.lasteditrowindex];
      }
      else {
        this.localloanobject = res;
        this.rowData = [];
        this.rowData = this.localloanobject.LoanCropUnits.filter(p => p.ActionStatus != 3);
      }
      this.getgridheight();

    })
    this.getdataforgrid();

  }
  getdataforgrid() {
    let obj: any = this.localstorageservice.retrieve(environment.loankey);
    this.logging.checkandcreatelog(1, 'CropPrice', "LocalStorage retrieved");
    if (obj != null && obj != undefined) {
      this.localloanobject = obj;
      this.rowData = [];
      this.rowData = this.localloanobject.LoanCropUnits.filter(p => p.ActionStatus != 3);

    }
  }



  synctoDb() {

    this.loanapi.syncloanobject(this.localloanobject).subscribe(res => {
      if (res.ResCode == 1) {
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
    })
  }

  //Grid Events
  addrow() {

    var newItem = new Loan_Crop_Unit();
    newItem.Loan_Full_ID = this.localloanobject.Loan_Full_ID;
    newItem.Crop_Code = "CRN";
    var res = this.rowData.push(newItem);
    this.gridApi.setRowData(this.rowData);
    this.gridApi.startEditingCell({
      rowIndex: this.rowData.length - 1,
      colKey: "Crop_Code"
    });
    this.getgridheight();
  }

  valuechanged(value: any, selectname: any, rowindex: any) {

    if (selectname == "Crop_Code") {
      this.rowData[rowindex].Crop_Type_Code = this.refdata.CropList.find(p => p.Crop_Code == value).Crop_Type_Code;
    }
    else {
      if (this.rowData[rowindex].Z_Price == 0)
        this.rowData[rowindex].Z_Price = this.refdata.CropList.find(p => p.Crop_Code == this.rowData[rowindex].Crop_Code && p.Crop_Type_Code == value).Price;
    }

  }
  rowvaluechanged(value: any) {
    //Change class here for editing 
    debugger
    var obj = value.data;
    if (obj.Loan_CU_ID == undefined) {
      obj.ActionStatus = 1;
      obj.Loan_CU_ID = 0;
      this.localloanobject.LoanCropUnits[this.localloanobject.LoanCropUnits.length - 1] = value.data;
    }
    else {
      var rowindex = this.localloanobject.LoanCropUnits.findIndex(p => p.Loan_CU_ID == obj.Loan_CU_ID);
      if (obj.ActionStatus != 1)
        obj.ActionStatus = 2;
      this.localloanobject.LoanCropUnits[rowindex] = obj;
    }
    debugger
    //this shall have the last edit 
    this.localloanobject.srccomponentedit = "PriceComponent";
    this.localloanobject.lasteditrowindex = value.rowIndex;
    this.loanserviceworker.performcalculationonloanobject(this.localloanobject);
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.getgridheight();
    //auto width and no scroll
  }
  DeleteClicked(rowIndex: any) {
    this.alertify.confirm("Confirm", "Do you Really Want to Delete this Record?").subscribe(res => {
      if (res == true) {
        var obj = this.localloanobject.LoanCropUnits[rowIndex];
        if (obj.Loan_CU_ID == 0) {
          this.localloanobject.LoanCropUnits.splice(rowIndex, 1);

        }
        else {
          obj.ActionStatus = 3;
        }
        this.loanserviceworker.performcalculationonloanobject(this.localloanobject);
      }
    })

  }

  syncenabled() {
    return this.rowData.filter(p => p.ActionStatus != 0).length > 0
  }

  getgridheight() {

    this.style.height = (29 * (this.rowData.length + 1)+9).toString() + "px";
  }
  onGridSizeChanged(Event: any) {
    debugger
    try{
    this.gridApi.sizeColumnsToFit();
  }
  catch{

  }
  }
}
function adjustheader(): void {
  debugger
  document.getElementsByClassName("ag-header-cell-label")[0].setAttribute("style","width:100%")
}