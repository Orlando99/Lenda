import { Component, OnInit } from '@angular/core';
import { loan_model } from '../../models/loanmodel';
import { LocalStorageService } from 'ngx-webstorage';
import { LoancalculationWorker } from '../../Workers/calculations/loancalculationworker';
import { ToastsManager } from 'ng2-toastr';
import { LoggingService } from '../../services/Logs/logging.service';
import { environment } from '../../../environments/environment';
import { modelparserfordb } from '../../Workers/utility/modelparserfordb';
import { Loan_Farm } from '../../models/farmmodel.';
import { FarmapiService } from '../../services/farm/farmapi.service';
import { numberValueSetter, getNumericCellEditor } from '../../Workers/utility/aggrid/numericboxes';
import { extractStateValues, lookupStateValue, Statevaluesetter, extractCountyValues, lookupCountyValue, Countyvaluesetter, getfilteredcounties } from '../../Workers/utility/aggrid/stateandcountyboxes';
import { SelectEditor } from '../../aggridfilters/selectbox';
import { DeleteButtonRenderer } from '../../aggridcolumns/deletebuttoncolumn';
import { AlertifyService } from '../../alertify/alertify.service';
/// <reference path="../../Workers/utility/aggrid/numericboxes.ts" />
@Component({
  selector: 'app-farm',
  templateUrl: './farm.component.html',
  styleUrls: ['./farm.component.scss']
})
export class FarmComponent implements OnInit {
  public refdata: any = {};
  indexsedit = [];
  public columnDefs = [];
  private localloanobject: loan_model = new loan_model();
  public syncenabled = false;
  // Aggrid
  public rowData = [];
  public components;
  public context;
  public frameworkcomponents;
  public editType;
  public pinnedBottomRowData = [];
  private gridApi;
  private columnApi;
  //region Ag grid Configuration


  returncountylist() {
    return this.refdata.CountyList;
  }


  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;

  }
  //End here
  // Aggrid ends
  constructor(public localstorageservice: LocalStorageService,
    public loanserviceworker: LoancalculationWorker,
    public farmservice: FarmapiService,
    private toaster: ToastsManager,
    public logging: LoggingService,
    public alertify: AlertifyService
  ) {
    this.frameworkcomponents = { selectEditor: SelectEditor, deletecolumn: DeleteButtonRenderer };
    this.components = { numericCellEditor: getNumericCellEditor() };
    debugger
    this.refdata = this.localstorageservice.retrieve(environment.referencedatakey);
    //Coldef here
    debugger
    this.columnDefs = [
      {
        headerName: 'State', field: 'Farm_State_ID', width: 80, editable: true, cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: extractStateValues(this.refdata.StateList)
        },
        valueFormatter: function (params) {
          return lookupStateValue(params.colDef.cellEditorParams.values, params.value);
        },
        valueSetter: Statevaluesetter
      },
      {
        headerName: 'County', field: 'Farm_County_ID', width: 80, editable: true, cellEditor: "agSelectCellEditor",
        cellEditorParams: getfilteredcounties,
        valueFormatter: function (params) {
          return lookupCountyValue(params.value);
        },
        valueSetter: Countyvaluesetter
      },
      { headerName: '% Prod', field: 'Prod', width: 80, editable: false },
      { headerName: 'Landlord', field: 'Landowner', editable: true, width: 80 },
      { headerName: 'FSN', field: 'FSN', editable: true, width: 80 },
      { headerName: 'Section', field: 'Section', width: 80, editable: true },
      { headerName: 'Rated', field: 'Rated', width: 80, editable: true },
      { headerName: 'Rent', field: 'Share_Rent', width: 80, editable: true, cellEditor: "numericCellEditor", valueSetter: numberValueSetter },
      { headerName: 'Rent UoM', field: 'RentUoM', width: 80, editable: true },
      { headerName: '$ Rent Due', field: 'Cash_Rent_Due_Date', editable: true, width: 80 },
      { headerName: 'Waived', field: 'Cash_Rent_Waived', width: 80, editable: true, cellEditor: "numericCellEditor", valueSetter: numberValueSetter },
      { headerName: '% Rent', field: 'Rentperc', width: 80, editable: true },
      { headerName: 'Perm to Ins', field: 'Permission_To_Insure', width: 80, editable: true },
      { headerName: 'IR Acres', field: 'Irr_Acres', width: 80, editable: true, cellEditor: "numericCellEditor", valueSetter: numberValueSetter },
      { headerName: 'NI Acres', field: 'NI_Acres', width: 80, editable: true, cellEditor: "numericCellEditor", valueSetter: numberValueSetter },
      { headerName: 'Total Acres', field: 'FC_Total_Acres', width: 80 },
      { headerName: '', field: 'value', width: 80, cellRenderer: "deletecolumn" },

    ];
    ///
    this.context = { componentParent: this };
  }
  ngOnInit() {
    this.localstorageservice.observe(environment.loankey).subscribe(res => {
      this.logging.checkandcreatelog(1, 'LoanFarms', "LocalStorage updated");
      debugger
      this.localloanobject = res;
      this.gridApi.setRowData(res.Farms.filter(p => p.ActionStatus != -1));

    });

    this.getdataforgrid();
    this.editType = "fullRow";
  }
  getdataforgrid() {
    let obj: loan_model = this.localstorageservice.retrieve(environment.loankey);
    this.logging.checkandcreatelog(1, 'LoanFarms', "LocalStorage retrieved");
    if (obj != null && obj != undefined) {
      this.localloanobject = obj;
      debugger
      this.rowData = obj.Farms.filter(p => p.ActionStatus != -1);
    }
  }


  rowvaluechanged(value: any) {
    debugger
    var obj = value.data;
    if (obj.Farm_ID == undefined) {
      obj.ActionStatus = -1;
    }
    else {
      obj.ActionStatus = 2;
    }
    this.localloanobject.Farms[value.rowIndex] = obj;
    this.loanserviceworker.performcalculationonloanobject(this.localloanobject);
  }

  synctoDb() {
    debugger
    this.indexsedit.forEach(element => {
      var obj = modelparserfordb(this.localloanobject.Farms[element]);
      this.farmservice.saveupdateFarm(obj).subscribe(res => {
        this.logging.checkandcreatelog(3, 'Farm', "Code Synced to DB with ResCode " + res.ResCode);
        if (res.ResCode == 1) {
          this.toaster.success("Object Synced Successfully");
        }
        else {
          this.toaster.error("Error Encountered while Syncing");
        }
      });
    });
    this.indexsedit = [];

  }

  //Grid Events
  addrow() {
    var newItem = new Loan_Farm();
    var res = this.gridApi.updateRowData({ add: [newItem] });
    this.gridApi.startEditingCell({
      rowIndex: this.rowData.length,
      colKey: "Farm_State_ID"
    });
  }

  DeleteClicked(rowIndex: any) {
    this.alertify.confirm("Confirm", "Do you Really Want to Delete this Record?").subscribe(res => {
      if (res == true) {
        var obj = this.localloanobject.Farms[rowIndex];
        if (obj.Farm_ID == undefined) {
          this.localloanobject.Farms.splice(rowIndex, 1);
        }
        else {
          obj.ActionStatus = -1;
        }
        this.loanserviceworker.performcalculationonloanobject(this.localloanobject);
      }
    })

  }
  //

}



