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
import { NumericEditor } from '../../../aggridfilters/numericaggrid';
import { DeleteButtonRenderer } from '../../../aggridcolumns/deletebuttoncolumn';
import { AlertifyService } from '../../../alertify/alertify.service';
import { LoanApiService } from '../../../services/loan/loanapi.service';
import { JsonConvert } from 'json2typescript';
import { EmailEditor } from '../../../Workers/utility/aggrid/emailboxes';

/// <reference path="../../../Workers/utility/aggrid/numericboxes.ts" />
@Component({
  selector: 'app-agent',
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.scss']
})
export class AgentComponent implements OnInit {
  public refdata: any = {};
  public isgriddirty:boolean;
  indexsedit = [];
  public columnDefs = [];
  private localloanobject: loan_model = new loan_model();
  public syncenabled = true;
  // Aggrid
  public rowData = new Array<Loan_Association>();
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
    this.frameworkcomponents = { emaileditor:EmailEditor,selectEditor: SelectEditor, deletecolumn: DeleteButtonRenderer };
    this.components = { numericCellEditor: getNumericCellEditor() };

    this.refdata = this.localstorageservice.retrieve(environment.referencedatakey);
    this.localloanobject = this.localstorageservice.retrieve(environment.loankey);
    //Coldef here

    this.columnDefs = [

      { headerName: 'Agent', field: 'Assoc_Name', editable: true,cellClass: ['lenda-editable-field'] },
      // { headerName: 'Agency', width: 80, field: 'Assoc_Type_Code',  editable: false },
      { headerName: 'Contact', field: 'Contact',  editable: true,cellClass: ['lenda-editable-field'] },
      { headerName: 'Location', field: 'Location',  editable: true,cellClass: ['lenda-editable-field'] },
      { headerName: 'Phone', field: 'Phone', editable: true,cellClass: ['lenda-editable-field']},
      { headerName: 'Email', field: 'Email', editable: true,cellClass: ['lenda-editable-field']},
      { headerName: 'Pref Contact', width: 80, field: 'Preferred_Contact_Ind',  editable: true,cellClass: ['lenda-editable-field'] },
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
    this.localstorageservice.observe(environment.loankey).subscribe(res => {
      this.logging.checkandcreatelog(1, 'LoanAgents', "LocalStorage updated");
      this.localloanobject = this.localstorageservice.retrieve(environment.loankey);

      //this.rowData = obj.Association.filter(p => p.ActionStatus != -1);
      this.rowData = this.localloanobject.Association.filter(p => p.ActionStatus != -1 &&  p.Assoc_Type_Code=="AGT");

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
      this.rowData = this.localloanobject.Association.filter(p => p.ActionStatus != -1 &&  p.Assoc_Type_Code=="AGT");
    }
  }


  rowvaluechanged(value: any) {
    debugger
    var obj = value.data;
    if (obj.ActionStatus == undefined) {
      obj.ActionStatus = 1;
      obj.Assoc_ID=0;
      var rowIndex=this.localloanobject.Association.filter(p => p.Assoc_Type_Code=="AGT").length;
      this.localloanobject.Association.filter(p => p.Assoc_Type_Code=="AGT")[rowIndex]=value.data;
    }
    else {
      var rowindex=this.localloanobject.Association.filter(p => p.ActionStatus != -1 &&  p.Assoc_Type_Code=="AGT").findIndex(p=>p.Assoc_ID==obj.Assoc_ID);
      obj.ActionStatus = 2;
      this.localloanobject.Association.filter(p => p.ActionStatus != -1 &&  p.Assoc_Type_Code=="AGT")[rowindex]=obj;
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
    var newItem = new Loan_Association();
    newItem.Loan_Full_ID=this.localloanobject.Loan_Full_ID;
    newItem.Assoc_Type_Code="AGT";
    newItem.Preferred_Contact_Ind=1;
    var res = this.rowData.push(newItem);
    this.gridApi.updateRowData({ add: [newItem] });
    this.gridApi.startEditingCell({
      rowIndex: this.rowData.length-1,
      colKey: "Assoc_Name"
    });
    this.localloanobject.Association.push(newItem);
  }

  DeleteClicked(rowIndex: any) {
    this.alertify.confirm("Confirm", "Do you Really Want to Delete this Record?").subscribe(res => {
      if (res == true) {
        var obj = this.localloanobject.Association.filter(p => p.ActionStatus != -1 &&  p.Assoc_Type_Code=="AGT")[rowIndex];

        if (obj.Assoc_ID === 0) {
          let filteting = this.localloanobject.Association.filter(p => p.ActionStatus != -1 &&  p.Assoc_Type_Code=="AGT");

          this.localloanobject.Association.splice(this.localloanobject.Association.indexOf(filteting[rowIndex]), 1);

        }
        else {
          obj.ActionStatus = -1;
        }

        console.log(res,rowIndex, obj, obj.Assoc_ID, this.localloanobject)

        this.loanserviceworker.performcalculationonloanobject(this.localloanobject);
      }
    })

  }


  //

}



