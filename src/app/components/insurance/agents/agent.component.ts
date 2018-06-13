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
/// <reference path="../../../Workers/utility/aggrid/numericboxes.ts" />
@Component({
  selector: 'app-agent',
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.scss']
})
export class AgentComponent implements OnInit {
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
    debugger
    this.refdata = this.localstorageservice.retrieve(environment.referencedatakey);
    this.localloanobject = this.localstorageservice.retrieve(environment.loankey);
    //Coldef here
    debugger
    this.columnDefs = [
      
      { headerName: 'Agent', field: 'Assoc_Name',  editable: true },
      { headerName: 'Agency', field: 'Assoc_Type_Code',  editable: false },
      { headerName: 'Location', field: 'Location',  editable: true },
      { headerName: 'Phone', field: 'Phone', editable: true},
      { headerName: 'Email', field: 'Email', editable: true},
      { headerName: '', field: 'value', width: 80, cellRenderer: "deletecolumn" },
    ];
    ///
    this.context = { componentParent: this };
  }
  ngOnInit() {
    debugger
    let obj: loan_model = this.localstorageservice.retrieve(environment.loankey);
    this.logging.checkandcreatelog(1, 'LoanInsuranceAgent', "LocalStorage retrieved");
    if (obj != null && obj != undefined) {
      this.localloanobject = obj;
      debugger
      this.rowData = obj.Association.filter(p => p.ActionStatus != -1 &&  p.Assoc_Type_Code=="AGT");
    }

    // this.localstorageservice.observe(environment.loankey).subscribe(res => {
    //   this.logging.checkandcreatelog(1, 'LoanAgents', "LocalStorage updated");
    //   this.localloanobject = res.Data;
      
    //   //this.rowData = obj.Association.filter(p => p.ActionStatus != -1);
    //   this.rowData = this.localloanobject.Association.filter(p => p.ActionStatus != -1 &&  p.Assoc_Type_Code=="AGT");

    // });
  

    this.getdataforgrid();
    this.editType = "fullRow";
  }
  getdataforgrid() {
    let obj: loan_model = this.localstorageservice.retrieve(environment.loankey);
    this.logging.checkandcreatelog(1, 'LoanAgents', "LocalStorage retrieved");
    if (obj != null && obj != undefined) {
    //if (this.localloanobject != null && this.localloanobject != undefined) {
      this.localloanobject = obj;
      this.rowData = obj.Association.filter(p => p.ActionStatus != -1 &&  p.Assoc_Type_Code=="AGT");
    }
  }


  rowvaluechanged(value: any) {
    debugger
    var obj = value.data;
    if (obj.ActionStatus == undefined) {
      obj.ActionStatus = 1;
      obj.Assoc_ID=0;      
      this.localloanobject.Association[this.localloanobject.Association.length]=value.data;
    }
    else {
      var rowindex=this.localloanobject.Association.findIndex(p=>p.Assoc_ID==obj.Assoc_ID);
      obj.ActionStatus = 2;
      this.localloanobject.Association[rowindex]=obj;
    }
    this.loanserviceworker.performcalculationonloanobject(this.localloanobject);
  }

  synctoDb() {
    debugger  
  this.loanapi.syncloanobject(this.localloanobject).subscribe(res=>{
    if(res.ResCode==1){
     this.loanapi.getLoanById(this.localloanobject.Loan_PK_ID).subscribe(res => {
       
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
    debugger
    var newItem = new Loan_Association();
    newItem.Loan_ID=this.localloanobject.Loan_PK_ID;
    newItem.Assoc_Type_Code="AGT";
    var res = this.gridApi.updateRowData({ add: [newItem] });
    this.gridApi.startEditingCell({
      rowIndex: this.rowData.length,
      colKey: "Assoc_ID"
    });
  }

  DeleteClicked(rowIndex: any) {
    debugger
    this.alertify.confirm("Confirm", "Do you Really Want to Delete this Record?").subscribe(res => {
      if (res == true) {
        var obj = this.localloanobject.Association[rowIndex];
        if (obj.Assoc_ID == 0) {
          this.localloanobject.Association.splice(rowIndex, 1);
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



