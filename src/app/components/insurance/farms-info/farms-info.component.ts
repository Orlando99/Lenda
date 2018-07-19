import { Component, OnInit } from '@angular/core';
import { loan_model, Loan_Association } from '../../../models/loanmodel';
import { LocalStorageService } from 'ngx-webstorage';
import { LoancalculationWorker } from '../../../Workers/calculations/loancalculationworker';
import { ToastsManager } from 'ng2-toastr';
import { LoggingService } from '../../../services/Logs/logging.service';
import { environment } from '../../../../environments/environment.prod';
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
/// <reference path="../../../Workers/utility/aggrid/numericboxes.ts" />
@Component({
  selector: 'app-farms-info',
  templateUrl: './farms-info.component.html',
  styleUrls: ['./farms-info.component.scss']
})
export class FarmsInfoComponent implements OnInit {

  public refdata: any = {};
  indexsedit = [];
  public columnDefs = [];
  private localloanobject: loan_model = new loan_model();
  
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

      { headerName: 'State | County', field: 'Farm_County_ID',  editable: true,cellClass: ['lenda-editable-field'] },
      { headerName: 'FSN', field: 'FSN',  editable: false },
      { headerName: 'Landlord', field: 'Landowner',  editable: true,cellClass: ['lenda-editable-field'] },
      { headerName: 'Owned', field: 'Owned', editable: true,cellClass: ['lenda-editable-field']},
      // { headerName: 'AC-IR', field: 'Email', editable: true},
      // { headerName: 'AC-NI', field: 'Email', editable: true},
      // { headerName: 'Rent Type', field: 'Email', editable: true},
      { headerName: 'Rent Amount', field: 'Cash_Rent_Waived_Amount', editable: true,cellClass: ['lenda-editable-field']},
      { headerName: 'Rent Due', field: 'Cash_Rent_Due_Date', editable: true,cellClass: ['lenda-editable-field']},
      { headerName: 'Perm to Ins', field: 'Permission_To_Insure', editable: true,cellClass: ['lenda-editable-field']},
      { headerName: 'Waived', field: 'Cash_Rent_Waived', editable: true,cellClass: ['lenda-editable-field']},
      { headerName: 'Paid', field: 'Cash_Rent_Paid', editable: true,cellClass: ['lenda-editable-field']},
      { headerName: '', field: 'value', width: 80, cellRenderer: "deletecolumn" },
    ];
    ///
    this.context = { componentParent: this };
  }
  ngOnInit() {

    this.localstorageservice.observe(environment.loankey).subscribe(res => {
      this.logging.checkandcreatelog(1, 'LoanAgents', "LocalStorage updated");
      this.localloanobject = this.localstorageservice.retrieve(environment.loankey);

      //this.rowData = obj.Association.filter(p => p.ActionStatus != -1);
      this.rowData = this.localloanobject.Farms;

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
      this.rowData = this.localloanobject.Farms;
    }
  }


  rowvaluechanged(value: any) {
    var obj = value.data;
    if (obj.ActionStatus == undefined) {
      obj.ActionStatus = 1;
      obj.Assoc_ID=0;
      var rowIndex=this.localloanobject.Farms.length;
      this.localloanobject.Farms[rowIndex] = value.data;
    }
    else {
      var rowindex=this.localloanobject.Farms.length;
      obj.ActionStatus = 2;
      this.localloanobject.Farms[rowindex]=obj;
    }
    this.loanserviceworker.performcalculationonloanobject(this.localloanobject);
  }

  synctoDb() {
    this.gridApi.showLoadingOverlay();
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
          this.gridApi.hideOverlay()
        });
      }
      else{
        this.gridApi.hideOverlay()
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
    var newItem = new Loan_Farm();
    // newItem.Loan_ID=this.localloanobject.Loan_PK_ID;
    // newItem.Assoc_Type_Code="AGT";
    var res = this.rowData.push(newItem);
    this.gridApi.updateRowData({ add: [newItem] });
    this.gridApi.startEditingCell({
      rowIndex: this.rowData.length-1,
      colKey: "Assoc_Name"
    });
    this.localloanobject.Farms.push(newItem);
  }

  DeleteClicked(rowIndex: any) {
    this.alertify.confirm("Confirm", "Do you Really Want to Delete this Record?").subscribe(res => {
      if (res == true) {
        var obj = this.localloanobject.Farms[rowIndex];
          this.localloanobject.Farms.splice(rowIndex, 1);
        this.loanserviceworker.performcalculationonloanobject(this.localloanobject);
        this.rowData = this.localloanobject.Farms;

      }
    })

  }
  syncenabled() {
    debugger
    if(this.rowData.filter(p => p.ActionStatus != 0 && p.ActionStatus != null && p.ActionStatus != undefined).length == 0)
    return 'disabled';
    else
    return '';
  }

  //

}



