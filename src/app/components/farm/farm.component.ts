import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { loan_model } from '../../models/loanmodel';
import { LocalStorageService } from 'ngx-webstorage';
import { LoancalculationWorker } from '../../Workers/calculations/loancalculationworker';
import { ToastsManager } from 'ng2-toastr';
import { LoggingService } from '../../services/Logs/logging.service';
import { environment } from '../../../environments/environment.prod';
import { modelparserfordb } from '../../Workers/utility/modelparserfordb';
import { Loan_Farm } from '../../models/farmmodel.';
import { FarmapiService } from '../../services/farm/farmapi.service';
import { numberValueSetter, getNumericCellEditor, numberWithOneDecPrecValueSetter } from '../../Workers/utility/aggrid/numericboxes';
import { extractStateValues, lookupStateValue, Statevaluesetter, extractCountyValues, lookupCountyValue, Countyvaluesetter, getfilteredcounties } from '../../Workers/utility/aggrid/stateandcountyboxes';
import { SelectEditor } from '../../aggridfilters/selectbox';
import { DeleteButtonRenderer } from '../../aggridcolumns/deletebuttoncolumn';
import { AlertifyService } from '../../alertify/alertify.service';
import { LoanApiService } from '../../services/loan/loanapi.service';
import { JsonConvert } from 'json2typescript';
import { Action } from 'rxjs/scheduler/Action';
import { PriceFormatter, PercentageFormatter, numberWithOneDecPrecValueFormatter } from '../../Workers/utility/aggrid/formatters';
import { getAlphaNumericCellEditor } from '../../Workers/utility/aggrid/alphanumericboxes';
import { getDateCellEditor, getDateValue, formatDateValue } from '../../Workers/utility/aggrid/dateboxes';
import { ModelStatus, status } from '../../models/syncstatusmodel';
import { setgriddefaults } from '../../aggriddefinations/aggridoptions';
import { PublishService, Page } from '../../services/publish.service';
import { FarmService } from './farm.service';
/// <reference path="../../Workers/utility/aggrid/numericboxes.ts" />
@Component({
  selector: 'app-farm',
  templateUrl: './farm.component.html',
  styleUrls: ['./farm.component.scss'],
  encapsulation:ViewEncapsulation.None,
  providers:[FarmService]
})
export class FarmComponent implements OnInit {
  public refdata: any = {};
  public columnDefs = [];
  private localloanobject: loan_model = new loan_model();
  // Aggrid
  public rowData = [];
  public currenteditedfield: string = null;
  public currenteditrowindex: number = -1;
  public components;
  public context;
  public frameworkcomponents;
  public editType;
  private gridApi;
  private columnApi;
  public syncFarmStatus: status;
  defaultColDef: any;
  currentPageName : Page = Page.farm;
  
  //region Ag grid Configuration
  style = {
    marginTop: '10px',
    width: '93%',
    boxSizing: 'border-box'
  };

  returncountylist() {
    return this.refdata.CountyList;
  }


  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    setgriddefaults(this.gridApi,this.columnApi);
    //params.api.sizeColumnsToFit();
  }
  //End here
  // Aggrid ends
  constructor(public localstorageservice: LocalStorageService,
    public loanserviceworker: LoancalculationWorker,
    public farmservice: FarmService,
    private toaster: ToastsManager,
    public logging: LoggingService,
    public alertify: AlertifyService,
    public loanapi: LoanApiService,
    private publishService : PublishService
  ) {
    this.frameworkcomponents = { selectEditor: SelectEditor, deletecolumn: DeleteButtonRenderer };
    this.components = { numericCellEditor: getNumericCellEditor(), alphaNumericCellEditor: getAlphaNumericCellEditor(), dateCellEditor: getDateCellEditor() };
    this.refdata = this.localstorageservice.retrieve(environment.referencedatakey);
    //Coldef here
    if (this.refdata != null)
      this.declarecolumns();
    ///
    this.context = { componentParent: this };
  }
  private declarecolumns() {
    this.columnDefs = [
      {
        headerName: 'State', field: 'Farm_State_ID', cellClass: 'editable-color', editable: true, cellEditor: "selectEditor",
        cellEditorParams: {
          values: extractStateValues(this.refdata.StateList)
        },
        valueFormatter: function (params) {
          return lookupStateValue(params.colDef.cellEditorParams.values, parseInt(params.value));
        },
        valueSetter: Statevaluesetter
        
      },
      {
        headerName: 'County', field: 'Farm_County_ID', cellClass: 'editable-color', editable: true, cellEditor: "selectEditor",
        cellEditorParams: getfilteredcounties,
        valueFormatter: function (params) {
          return params.value ? lookupCountyValue(params.value) : '';
        },
        valueSetter: Countyvaluesetter
      },
      {
        headerName: '% Prod',headerClass:"rightaligned",field: 'Percent_Prod', cellClass: 'editable-color rightaligned', editable: true, cellEditor: "numericCellEditor",
        valueFormatter: function (params) {
          return PercentageFormatter(params.value);
        },
        valueSetter: function (params) {
          numberValueSetter(params);
          if (params.newValue) {
            if(!(!!params.data.Owned)){
              params.data['Rentperc'] = 100 - parseFloat(params.newValue);
            }
          }
          return true;
        }
        
      },
      { headerName: 'Landlord', field: 'Landowner', cellClass: 'editable-color', editable: true, calculationinvoke: false },
      {
        headerName: 'Owned', field: 'Owned', cellClass: 'editable-color', editable: true, calculationinvoke: false, cellEditor: "selectEditor",
        cellEditorParams: { values: [{ key: 1, value: 'Yes' }, { key: 0, value: 'No' }] },
        valueFormatter: function(params){
          let selectedOption =  [{ key: 1, value: 'Yes' }, { key: 0, value: 'No' }].find(o=>o.key = params.value);
          return selectedOption ? selectedOption.value : 'No';

        },
        valueSetter: function (params) {
          params.data['Owned'] = parseInt(params.newValue);
          if(params.data['Owned']==1){
            params.data['Share_Rent'] = 0;
            params.data['Rent_UOM'] = 1;
            params.data['Cash_Rent_Due_Date'] = '';
            params.data['Cash_Rent_Waived'] = 0;
            params.data['Rentperc'] = 0;
          }else{
            params.data['Rentperc'] = 100 - parseFloat(params.newValue);
          }

          return true;
        }
      },
      { headerName: 'FSN', field: 'FSN',headerClass:"rightaligned", cellClass: 'editable-color rightaligned', editable: true, calculationinvoke: false, cellEditor: "alphaNumericCellEditor" },
      { headerName: 'Section', field: 'Section', cellClass: 'editable-color', editable: true, calculationinvoke: false, cellEditor: "alphaNumericCellEditor" },
      {
        headerName: 'Rated', field: 'Rated', cellClass: 'editable-color', editable: true, calculationinvoke: false, cellEditor: "selectEditor",
        cellEditorParams: { values: [{ key: 'AAA', value: 'AAA' }, { key: 'BBB', value: 'BBB' }, { key: 'NR', value: 'NR' }] },
      },
      {
        headerName: 'Rent',headerClass:"rightaligned", field: 'Share_Rent', cellClass: 'rightaligned',
        cellClassRules:{
          'editable-color' : function(params){ 
            return (!(!!params.data.Owned));
          }
        },
        editable: function(params){
          return !(!!params.data.Owned);
        },
        cellEditor: "numericCellEditor", valueSetter: numberValueSetter,
        valueFormatter: function (params) {
          return PriceFormatter(params.value);
        }
      },
      {
        headerName: 'Rent UoM', field: 'Rent_UOM', 
        cellClassRules:{
          'editable-color' : function(params){ 
            return (!(!!params.data.Owned));
          }
        },
        editable: function(params){
          return !(!!params.data.Owned);
        },
        cellEditor: "selectEditor",
        cellEditorParams: { values: [{ key: 1, value: '$ per acre' }, { key: 2, value: '$ Total' }] },
        valueFormatter: function (params) {
          let selected = [{ key: 1, value: '$ per acre' }, { key: 2, value: '$ Total' }].find(v => v.key == params.value);
          return selected ? selected.value : undefined;
        }
      },
      {
        headerName: '$ Rent Due',headerClass:"rightaligned", field: 'Cash_Rent_Due_Date', cellClass: 'rightaligned',
        cellClassRules:{
          'editable-color' : function(params){ 
            return (!(!!params.data.Owned));
          }
        },
        editable: function(params){
          
          return !(!!params.data.Owned);
        },
        cellEditor: "dateCellEditor",
        cellEditorParams: getDateValue,
        valueFormatter: formatDateValue,
        valueSetter: function (params) {
          if (params.newValue) {
            params.data['Cash_Rent_Due_Date'] = params.newValue;
          }else{
            params.data['Cash_Rent_Due_Date'] = null;
          }
          return true;
        }
      },
      {
        headerName: 'Waived', headerClass:"rightaligned",field: 'Cash_Rent_Waived', 
        cellClassRules:{
          'editable-color' : function(params){ 
            return (!(!!params.data.Owned));
          }
        },
        //cellClass: 'editable-color rightaligned', 
        editable: function(params){
          return !(!!params.data.Owned);
        },
        cellEditor: "numericCellEditor", valueSetter: numberValueSetter,
        valueFormatter: function (params) {
          return PriceFormatter(params.value);
        },
        
      },
      {
        headerName: '% Rent',headerClass:"rightaligned", cellClass: 'rightaligned',field: 'Rentperc',
        valueFormatter: function (params) {
          if (!(!!params.data.Owned) && params.data.Percent_Prod) {
            return PercentageFormatter(100 - params.data.Percent_Prod);
          }
          else {
            return PercentageFormatter(0);
          }
        }
      },
      {
        headerName: 'Perm to Ins', field: 'Permission_To_Insure', cellClass: 'editable-color', editable: true, cellEditor: "selectEditor",
        cellEditorParams: { values: [{ key: 1, value: 'Yes' }, { key: 0, value: 'No' }] },
        valueFormatter: function (params) {
          return params.value == 1 ? 'Yes' : 'No';
        }
      },
      {
        headerName: 'IR Acres',headerClass:"rightaligned", field: 'Irr_Acres', cellClass: 'editable-color rightaligned', editable: true, cellEditor: "numericCellEditor", valueSetter: numberWithOneDecPrecValueSetter,
        valueFormatter: numberWithOneDecPrecValueFormatter
      },
      {
        headerName: 'NI Acres',headerClass:"rightaligned", field: 'NI_Acres', cellClass: 'editable-color rightaligned', editable: true, cellEditor: "numericCellEditor", valueSetter: numberWithOneDecPrecValueSetter,
        valueFormatter: numberWithOneDecPrecValueFormatter
      },
      {
        headerName: 'Total Acres',headerClass:"rightaligned",cellClass:"rightaligned", field: 'FC_Total_Acres', cellEditor: "numericCellEditor", valueSetter: numberWithOneDecPrecValueSetter,
        valueFormatter: numberWithOneDecPrecValueFormatter
      },
      { headerName: '', field: 'value', cellRenderer: "deletecolumn" },
    ];
    
  }

  ngOnInit() {
    this.localstorageservice.observe(environment.loankey).subscribe(res => {
      if (res != null) {
        // this.logging.checkandcreatelog(1, 'LoanFarms', "LocalStorage updated");
        this.localloanobject = res;
        if (res.Farms && res.srccomponentedit == "FarmComponent") {
          this.rowData[res.lasteditrowindex] = this.localloanobject.Farms.filter(p => p.ActionStatus != 3)[res.lasteditrowindex];
          this.localloanobject.srccomponentedit = undefined;
          this.localloanobject.lasteditrowindex = undefined;
        }
        else if (res.Farms) {
          this.rowData = this.localloanobject.Farms.filter(p => p.ActionStatus != 3);
        } else {
          this.rowData = [];
        }
       this.updateSyncStatus(); 
      }
    });


  
    if (this.localloanobject != null && this.localloanobject != undefined)
      this.getdataforgrid();
    //this.editType = "fullRow";
  }
  getdataforgrid() {
    let obj: loan_model = this.localstorageservice.retrieve(environment.loankey);
    // this.logging.checkandcreatelog(1, 'LoanFarms', "LocalStorage retrieved");
    if (obj != null && obj != undefined) {
      this.localloanobject = obj;
      if (obj.Farms) {
        this.rowData = [];
        this.rowData = obj.Farms.filter(p => p.ActionStatus != 3);
      }
      else
        this.rowData = [];
    }
  }

  cellEditingStarted(value: any) {

    this.currenteditedfield = value.colDef.field;
    this.currenteditrowindex = value.rowIndex;
    this.gridApi.startEditingCell({
      rowIndex: this.currenteditrowindex,
      colKey: this.currenteditedfield
    });
  }
  rowvaluechanged(value: any) {
    this.currenteditedfield = null;
    this.currenteditrowindex = -1;
    if (!this.localloanobject.Farms) {
      this.localloanobject.Farms = [];
    }
    var obj = value.data;
    if (obj.Farm_ID == undefined) {
      obj.ActionStatus = 1;
      obj.Farm_ID = 0;
      this.localloanobject.Farms[this.localloanobject.Farms.length] = value.data;
    }
    else {
      //var rowindex=value.rowindex;
      if (obj.ActionStatus != 1)
        obj.ActionStatus = 2;
      //obj itself should have memory referece of localstorage respective farm object
      // this.localloanobject.Farms[value.rowIndex]=obj;
    }
    this.localloanobject.srccomponentedit = "FarmComponent";
    this.localloanobject.lasteditrowindex = value.rowIndex;
    this.updateSyncStatus();
    this.loanserviceworker.performcalculationonloanobject(this.localloanobject, value.colDef.calculationinvoke);
    this.publishService.enableSync(Page.farm);
  }

  /**
   * Sync to database - publish button event
   */
  synctoDb() {
    
      this.publishService.syncCompleted();
      this.farmservice.syncToDb(this.localstorageservice.retrieve(environment.loankey));
     
    
  }
  // synctoDb() {
  //   this.gridApi.showLoadingOverlay();
  //   this.loanapi.syncloanobject(this.localloanobject).subscribe(res => {
  //     if (res.ResCode == 1) {
  //       this.loanapi.getLoanById(this.localloanobject.Loan_Full_ID).subscribe(res => {
  //         this.logging.checkandcreatelog(3, 'Overview', "APi LOAN GET with Response " + res.ResCode);
  //         if (res.ResCode == 1) {
  //           this.toaster.success("Records Synced");
  //           let jsonConvert: JsonConvert = new JsonConvert();
  //           this.loanserviceworker.performcalculationonloanobject(jsonConvert.deserialize(res.Data, loan_model));
  //         }
  //         else {
  //           this.toaster.error("Could not fetch Loan Object from API")
  //         }
  //         this.gridApi.hideOverlay()
  //       });
  //     }
  //     else {
  //       this.gridApi.hideOverlay()
  //       this.toaster.error("Error in Sync");
  //     }
  //   })

  // }

  //Grid Events
  addrow() {
    if (!this.rowData) {
      this.rowData = [];
    }
    var newItem = new Loan_Farm();
    newItem.Loan_Full_ID = this.localloanobject.Loan_Full_ID;
    var res = this.rowData.push(newItem);
    this.gridApi.setRowData(this.rowData);
    this.gridApi.startEditingCell({
      rowIndex: this.rowData.length - 1,
      colKey: "Farm_State_ID"
    });
    this.publishService.enableSync(Page.farm);
  
  }

  DeleteClicked(rowIndex: any, data) {
    this.alertify.confirm("Confirm", "Do you Really Want to Delete this Record?").subscribe(res => {
      if (res == true) {
        var obj = this.rowData[rowIndex];
        //var localStorageRowIndex = this.localloanobject.Farms.findIndex(f=>f.Farm_ID === obj.Farm_ID);
        if (obj.Farm_ID == 0) {
          //there can be multipe row with Farm_ID = 0
          let localFarmRow = this.localloanobject.Farms.findIndex(f => f === data);
          this.localloanobject.Farms.splice(localFarmRow, 1); // it will then assigned to rowData so it will be affected to it
        }
        else {
          obj.ActionStatus = 3;
        }

        this.updateSyncStatus();
        this.localloanobject.srccomponentedit = undefined;
        this.localloanobject.lasteditrowindex = undefined;
        this.loanserviceworker.performcalculationonloanobject(this.localloanobject);
        this.publishService.enableSync(Page.farm);
      }
    
    })

  }

  getgridheight() {

    // this.style.height = (29 * (this.rowData.length + 2)).toString() + "px";
  }

  syncenabled() {
    
    if (this.syncFarmStatus === 0 || this.syncFarmStatus == undefined)
      return 'disabled';
    else
      return '';
  }

  updateSyncStatus() {
    if (this.localloanobject.Farms.filter(p => p.ActionStatus == 1 || p.ActionStatus == 3).length > 0) {
      this.syncFarmStatus = status.ADDORDELETE;
    } else if (this.localloanobject.Farms.filter(p => p.ActionStatus == 2).length > 0) {
      this.syncFarmStatus = status.EDITED;
    } else {
      this.syncFarmStatus = status.NOCHANGE;
    }


    this.localloanobject.SyncStatus.Status_Farm = this.syncFarmStatus;


  }


}



