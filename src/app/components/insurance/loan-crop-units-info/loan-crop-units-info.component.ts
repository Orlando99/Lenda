import { Component, OnInit } from '@angular/core';
import { loan_model, Loan_Association } from '../../../models/loanmodel';
import { LocalStorageService } from 'ngx-webstorage';
import { LoancalculationWorker } from '../../../Workers/calculations/loancalculationworker';
import { ToastsManager } from 'ng2-toastr';
import { LoggingService } from '../../../services/Logs/logging.service';
import { environment } from '../../../../environments/environment';
import { modelparserfordb } from '../../../Workers/utility/modelparserfordb';
import { Loan_Farm } from '../../../models/farmmodel.';
import { InsuranceapiService } from '../../../services/insurance/insuranceapi.service';
import { numberValueSetter, getNumericCellEditor } from '../../../Workers/utility/aggrid/numericboxes';
import { extractStateValues, lookupStateValue, Statevaluesetter, extractCountyValues, lookupCountyValue, Countyvaluesetter, getfilteredcounties } from '../../../Workers/utility/aggrid/stateandcountyboxes';
import { SelectEditor } from '../../../aggridfilters/selectbox';
import { DeleteButtonRenderer } from '../../../aggridcolumns/deletebuttoncolumn';
import { AlertifyService } from '../../../alertify/alertify.service';
import { LoanApiService } from '../../../services/loan/loanapi.service';
import { JsonConvert } from 'json2typescript';
import {Loan_Crop_Unit} from '../../../models/cropmodel';
/// <reference path="../../../Workers/utility/aggrid/numericboxes.ts" />
@Component({
  selector: 'app-loan-crop-units-info',
  templateUrl: './loan-crop-units-info.component.html',
  styleUrls: ['./loan-crop-units-info.component.scss']
})
export class LoanCropUnitsInfoComponent implements OnInit {


  public refdata: any = {};
  indexsedit = [];
  public columnDefs = [];
  private localloanobject: loan_model = new loan_model();
  public syncenabled = true;
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
    params.api.sizeColumnsToFit();
  }
  //End here
  // Aggrid ends
  constructor(public localstorageservice: LocalStorageService,
              public loanserviceworker: LoancalculationWorker,
              public insuranceservice: InsuranceapiService,
              private toaster: ToastsManager,
              public logging: LoggingService,
              public alertify: AlertifyService,
              public loanapi:LoanApiService
  ) {
    this.frameworkcomponents = { selectEditor: SelectEditor, deletecolumn: DeleteButtonRenderer };
    this.components = { numericCellEditor: getNumericCellEditor() };

    this.refdata = this.localstorageservice.retrieve(environment.referencedatakey);
    this.localloanobject = this.localstorageservice.retrieve(environment.loankey);
    //Coldef here

    this.columnDefs = [

      { headerName: 'Crop', field: 'Crop_Code',  editable: true ,cellClass: ['editable']},
      { headerName: 'Acres', field: 'CU_Acres', editable: true,cellClass: ['editable']},
      { headerName: 'Status', field: 'Status', editable: true,cellClass: ['editable']},
      { headerName: 'Rebate Adj', field: 'Z_Rebate_Adj', editable: true,cellClass: ['editable']},
      { headerName: 'Price', field: 'Z_Price', editable: true,cellClass: ['editable']},
      { headerName: 'Marketing Adj', field: 'Z_Marketing_Adj', editable: true,cellClass: ['editable']},
      { headerName: 'Basis Adj', field: 'Z_Basis_Adj', editable: true,cellClass: ['editable']},
      { headerName: 'Adj Price', field: 'Z_Adj_Price', editable: true,cellClass: ['editable']},
      { headerName: 'Revenue', field: 'FC_Revenue', editable: true,cellClass: ['editable']},
      { headerName: '', field: 'value', width: 80, cellRenderer: "deletecolumn" },
    ];
    ///
    this.context = { componentParent: this };
  }
  ngOnInit() {
    // debugger
    // let obj: loan_model = this.localstorageservice.retrieve(environment.loankey);
    // this.logging.checkandcreatelog(1, 'LoanInsuranceAgent', "LocalStorage retrieved");
    // if (obj != null && obj != undefined) {
    //   this.localloanobject = obj;
    //   debugger
    //   this.rowData = obj.Association.filter(p => p.ActionStatus != -1 &&  p.Assoc_Type_Code=="AGT");
    // }


    // Booking_Ind
    //   :
    //   1
    // CU_Acres
    //   :
    //   200
    // Crop_Code
    //   :
    //   "CRN"
    // Crop_Practice_Type_Code
    //   :
    //   "IRR"
    // Crop_Type_Code
    //   :
    //   "NA"
    // FC_Revenue
    //   :
    //   21249979.999999996
    // Farm_ID
    //   :
    //   1
    // Loan_CU_ID
    //   :
    //   1
    // Loan_ID
    //   :
    //   1
    // Status
    //   :
    //   0
    // Z_Adj_Price
    //   :
    //   4.9563
    // Z_Basis_Adj
    //   :
    //   0.9778
    // Z_Marketing_Adj
    //   :
    //   0.268
    // Z_Price
    //   :
    //   3.89
    // Z_Rebate_Adj
    //   :
    //   0.4563

    this.localstorageservice.observe(environment.loankey).subscribe(res => {
      this.logging.checkandcreatelog(1, 'LoanAgents', "LocalStorage updated");
      this.localloanobject = this.localstorageservice.retrieve(environment.loankey);

      //this.rowData = obj.Association.filter(p => p.ActionStatus != -1);
      this.rowData = this.localloanobject.LoanCropUnits;

    });


    this.getdataforgrid();
    this.editType = "fullRow";
  }
  getdataforgrid() {
    // let obj: loan_model = this.localstorageservice.retrieve(environment.loankey);
    this.logging.checkandcreatelog(1, 'LoanAgents', "LocalStorage retrieved");
    //if (obj != null && obj != undefined) {
    if (this.localloanobject != null && this.localloanobject != undefined) {
      //this.localloanobject = obj;
      this.rowData = this.localloanobject.LoanCropUnits;
    }
  }


  rowvaluechanged(value: any) {
    var obj = value.data;
    if (obj.ActionStatus == undefined) {
      obj.ActionStatus = 1;
      obj.Assoc_ID=0;
      var rowIndex=this.localloanobject.LoanCropUnits.length;
      this.localloanobject.LoanCropUnits[rowIndex]=value.data;
    }
    else {
      var rowindex=this.localloanobject.LoanCropUnits.length;
      obj.ActionStatus = 2;
      this.localloanobject.LoanCropUnits[rowindex]=obj;
    }
    this.loanserviceworker.performcalculationonloanobject(this.localloanobject);
  }

  synctoDb() {
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
    // var newItem = new Loan_Association();
    // newItem.Loan_ID=this.localloanobject.Loan_PK_ID;
    // newItem.Assoc_Type_Code="AGT";
    // var res = this.gridApi.updateRowData({ add: [newItem] });
    // this.gridApi.startEditingCell({
    //   rowIndex: this.rowData.length,
    //   colKey: "Assoc_ID"
    // });
    var newItem = new Loan_Crop_Unit();
    // newItem.Loan_ID=this.localloanobject.Loan_PK_ID;
    // newItem.Assoc_Type_Code="AGT";
    var res = this.rowData.push(newItem);
    this.gridApi.updateRowData({ add: [newItem] });
    this.gridApi.startEditingCell({
      rowIndex: this.rowData.length-1,
      colKey: "Assoc_Name"
    });
    this.localloanobject.LoanCropUnits.push(newItem);
  }

  DeleteClicked(rowIndex: any) {
    this.alertify.confirm("Confirm", "Do you Really Want to Delete this Record?").subscribe(res => {
      if (res == true) {
        var obj = this.localloanobject.LoanCropUnits[rowIndex];
          this.localloanobject.LoanCropUnits.splice(rowIndex, 1);

        this.loanserviceworker.performcalculationonloanobject(this.localloanobject);
      }
    })

  }


  //

}




