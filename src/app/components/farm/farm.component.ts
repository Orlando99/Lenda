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
import { LoanApiService } from '../../services/loan/loanapi.service';
import { JsonConvert } from 'json2typescript';
import { Action } from 'rxjs/scheduler/Action';
/// <reference path="../../Workers/utility/aggrid/numericboxes.ts" />
@Component({
  selector: 'app-farm',
  templateUrl: './farm.component.html',
  styleUrls: ['./farm.component.scss']
})
export class FarmComponent implements OnInit {
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
  //region Ag grid Configuration


  returncountylist() {
    return this.refdata.CountyList;
  }


  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    params.api.sizeColumnsToFit();
  }
  //End here
  // Aggrid ends
  constructor(public localstorageservice: LocalStorageService,
    public loanserviceworker: LoancalculationWorker,
    public farmservice: FarmapiService,
    private toaster: ToastsManager,
    public logging: LoggingService,
    public alertify: AlertifyService,
    public loanapi:LoanApiService
  ) {
    this.frameworkcomponents = { selectEditor: SelectEditor, deletecolumn: DeleteButtonRenderer };
    this.components = { numericCellEditor: getNumericCellEditor() };
    this.refdata = this.localstorageservice.retrieve(environment.referencedatakey);
    //Coldef here
    this.columnDefs = [
      {
        headerName: 'State', field: 'Farm_State_ID',  editable: true, cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: extractStateValues(this.refdata.StateList)
        },
        valueFormatter: function (params) {
          return lookupStateValue(params.colDef.cellEditorParams.values, params.value);
        },
        valueSetter: Statevaluesetter
      },
      {
        headerName: 'County', field: 'Farm_County_ID',  editable: true, cellEditor: "agSelectCellEditor",
        cellEditorParams: getfilteredcounties,
        valueFormatter: function (params) {
          return lookupCountyValue(params.value);
        },
        valueSetter: Countyvaluesetter
      },
      { headerName: '% Prod', field: 'Prod',  editable: false },
      { headerName: 'Landlord', field: 'Landowner', editable: true },
      { headerName: 'FSN', field: 'FSN', editable: true },
      { headerName: 'Section', field: 'Section',  editable: true },
      { headerName: 'Rated', field: 'Rated',  editable: true },
      { headerName: 'Rent', field: 'Share_Rent',  editable: true, cellEditor: "numericCellEditor", valueSetter: numberValueSetter },
      { headerName: 'Rent UoM', field: 'RentUoM',  editable: true },
      { headerName: '$ Rent Due', field: 'Cash_Rent_Due_Date', editable: true },
      { headerName: 'Waived', field: 'Cash_Rent_Waived',  editable: true, cellEditor: "numericCellEditor", valueSetter: numberValueSetter },
      { headerName: '% Rent', field: 'Rentperc',  editable: true },
      { headerName: 'Perm to Ins', field: 'Permission_To_Insure',  editable: true },
      { headerName: 'IR Acres', field: 'Irr_Acres',  editable: true, cellEditor: "numericCellEditor", valueSetter: numberValueSetter },
      { headerName: 'NI Acres', field: 'NI_Acres',  editable: true, cellEditor: "numericCellEditor", valueSetter: numberValueSetter },
      { headerName: 'Total Acres', field: 'FC_Total_Acres'},
      { headerName: '', field: 'value',  cellRenderer: "deletecolumn" },

    ];
    ///
    this.context = { componentParent: this };
  }
  ngOnInit() {
    this.localstorageservice.observe(environment.loankey).subscribe(res => {
      this.logging.checkandcreatelog(1, 'LoanFarms', "LocalStorage updated");
      debugger
      this.localloanobject = res;
      this.rowData = res.Farms.filter(p => p.ActionStatus != 3);
      this.gridApi.setRowData(this.rowData);

    });

    this.getdataforgrid();
    //this.editType = "fullRow";
  }
  getdataforgrid() {
    let obj: loan_model = this.localstorageservice.retrieve(environment.loankey);
    this.logging.checkandcreatelog(1, 'LoanFarms', "LocalStorage retrieved");
    if (obj != null && obj != undefined) {
      this.localloanobject = obj;
      this.rowData = obj.Farms.filter(p => p.ActionStatus != 3);
    }
  }


  rowvaluechanged(value: any) {
    var obj = value.data;
    if (obj.Farm_ID == undefined) {
      obj.ActionStatus = 1;
      obj.Farm_ID=0;
      this.localloanobject.Farms[this.localloanobject.Farms.length]=value.data;
    }
    else {
      var rowindex=this.localloanobject.Farms.findIndex(p=>p.Farm_ID==obj.Farm_ID);
      if(obj.ActionStatus!=1)
       obj.ActionStatus = 2;
      this.localloanobject.Farms[rowindex]=obj;
    }
    this.loanserviceworker.performcalculationonloanobject(this.localloanobject);
  }

  synctoDb() {
    debugger
   this.loanapi.syncloanobject(this.localloanobject).subscribe(res=>{
     if(res.ResCode==1){
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
   })

  }

  //Grid Events
  addrow() {
    var newItem = new Loan_Farm();
    newItem.Loan_Full_ID=this.localloanobject.Loan_Full_ID;
    var res = this.rowData.push(newItem);
    this.gridApi.setRowData(this.rowData);
    this.gridApi.startEditingCell({
      rowIndex: this.rowData.length-1,
      colKey: "Farm_State_ID"
    });
  }

  DeleteClicked(rowIndex: any) {
    this.alertify.confirm("Confirm", "Do you Really Want to Delete this Record?").subscribe(res => {
      if (res == true) {
        var obj = this.localloanobject.Farms[rowIndex];
        if (obj.Farm_ID == 0) {
          this.localloanobject.Farms.splice(rowIndex, 1);
        }
        else {
          obj.ActionStatus = 3;
        }
        this.loanserviceworker.performcalculationonloanobject(this.localloanobject);
      }
    })

  }


  syncenabled(){

   return this.rowData.filter(p=>p.ActionStatus!=0).length>0
  }

  //

}



