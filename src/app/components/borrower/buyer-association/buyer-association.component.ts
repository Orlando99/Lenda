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
import { getAlphaNumericCellEditor } from '../../../Workers/utility/aggrid/alphanumericboxes';
/// <reference path="../../../Workers/utility/aggrid/numericboxes.ts" />
@Component({
  selector: 'app-buyer-association',
  templateUrl: './buyer-association.component.html',
  styleUrls: ['./buyer-association.component.scss']
})
export class BuyerAssociationComponent implements OnInit {
  public refdata: any = {};
  indexsedit = [];
  public columnDefs = [];
  private localloanobject: loan_model = new loan_model();

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
  style = {
    marginTop: '10px',
    width: '97%',
    height: '110px',
    boxSizing: 'border-box'
  };

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
  ){
    this.frameworkcomponents = { selectEditor: SelectEditor, deletecolumn: DeleteButtonRenderer };
    this.components = { numericCellEditor: getNumericCellEditor(), alphaNumeric: getAlphaNumericCellEditor() };

    this.refdata = this.localstorageservice.retrieve(environment.referencedatakey);
    this.localloanobject = this.localstorageservice.retrieve(environment.loankey);
    //Coldef here

    this.columnDefs = [

      { headerName: 'Buyer', field: 'Assoc_Name',  editable: true, cellEditor: "alphaNumeric", cellClass: 'editable-color' },
      { headerName: 'Contact', field: 'Contact',  editable: true, cellEditor: "alphaNumeric", cellClass: 'editable-color' },
      { headerName: 'Location', field: 'Location',  editable: true, cellEditor: "alphaNumeric", cellClass: 'editable-color' },
      { headerName: 'Phone', field: 'Phone', editable: true, cellEditor: "alphaNumeric", cellClass: ['editable-color', 'text-right']},
      { headerName: 'Email', field: 'Email', editable: true, cellClass: 'editable-color'},
      { headerName: '', field: 'value', cellRenderer: "deletecolumn" },
    ];
    ///
    this.context = { componentParent: this };
  }
  ngOnInit() {
    this.localstorageservice.observe(environment.loankey).subscribe(res => {
      // this.logging.checkandcreatelog(1, 'LoanAgents', "LocalStorage retrieved");
      this.localloanobject = res
      
      if (res.srccomponentedit == "BuyerAssociationComponent") {
        //if the same table invoked the change .. change only the edited row
        this.localloanobject = res;
        this.rowData[res.lasteditrowindex] =    this.localloanobject.Association.filter(p => p.ActionStatus != 3 &&  p.Assoc_Type_Code=="BUY")[res.lasteditrowindex];
      }else{
        this.localloanobject = res
        this.rowData = [];
        this.rowData = this.rowData =  this.localloanobject.Association !== null?  this.localloanobject.Association.filter(p => p.ActionStatus != 3 &&  p.Assoc_Type_Code=="BUY"):[];
        
      }
      this.getgridheight();
      this.gridApi.refreshCells();
      // this.adjustgrid();
    });

    this.localloanobject = this.localstorageservice.retrieve(environment.loankey);
    
    if(this.localloanobject && this.localloanobject.Association.length>0){
      this.rowData = this.localloanobject.Association !== null? this.localloanobject.Association.filter(p => p.ActionStatus != 3 &&  p.Assoc_Type_Code=="BUY"):[];
    }else{
      this.rowData = [];
    }
  }

  getdataforgrid() {
    // let obj: loan_model = this.localstorageservice.retrieve(environment.loankey);
    // this.logging.checkandcreatelog(1, 'LoanAgents', "LocalStorage retrieved");
    //if (obj != null && obj != undefined) {
    if (this.localloanobject && this.localloanobject.Association && this.localloanobject.Association.length>0) {
      //this.localloanobject = obj;
      this.rowData = this.localloanobject.Association.filter(p => p.ActionStatus != 3 &&  p.Assoc_Type_Code=="BUY");
    }
  }

  getgridheight(){
    this.style.height=(30*(this.rowData.length+2)).toString()+"px";
  }

  rowvaluechanged(value: any) {
    var obj = value.data;
    if (!obj.Assoc_ID) {
      obj.ActionStatus = 1;
      obj.Assoc_ID=0;
      var length=this.localloanobject.Association.filter(p => p.Assoc_Type_Code=="BUY").length;
      this.localloanobject.Association.filter(p => p.Assoc_Type_Code=="BUY")[length - 1]=value.data;
    }
    else {
      var rowindex=this.localloanobject.Association.filter(p => p.ActionStatus != 3 &&  p.Assoc_Type_Code=="BUY").findIndex(p=>p.Assoc_ID==obj.Assoc_ID);
      obj.ActionStatus = 2;
      this.localloanobject.Association.filter(p => p.ActionStatus != 3 &&  p.Assoc_Type_Code=="BUY")[rowindex]=obj;
    }

    //this shall have the last edit
    this.localloanobject.srccomponentedit = "BuyerAssociationComponent";
    this.localloanobject.lasteditrowindex = value.rowIndex;
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
    var newItem = new Loan_Association();
    newItem.Loan_Full_ID=this.localloanobject.Loan_Full_ID;
    newItem.Assoc_Type_Code="BUY";
    newItem.Assoc_ID = 0;
    var res = this.rowData.push(newItem);
    this.gridApi.updateRowData({ add: [newItem] });
    this.gridApi.startEditingCell({
      rowIndex: this.rowData.length-1,
      colKey: "Assoc_Name"
    });
    this.localloanobject.Association.push(newItem);
    this.loanserviceworker.performcalculationonloanobject(this.localloanobject);
  }

  DeleteClicked(rowIndex: any) {
    this.alertify.confirm("Confirm", "Do you Really Want to Delete this Record?").subscribe(res => {
      if (res == true) {
        var obj = this.localloanobject.Association.filter(p => p.ActionStatus != 3 &&  p.Assoc_Type_Code=="BUY")[rowIndex];
        if (obj.Assoc_ID == 0) {
          this.localloanobject.Association.filter(p => p.ActionStatus != 3 &&  p.Assoc_Type_Code=="BUY").splice(rowIndex, 1);
        }
        else {
          obj.ActionStatus = 3;
        }
        this.loanserviceworker.performcalculationonloanobject(this.localloanobject);
      }
    })

  }

  syncenabled() {   
    if(this.rowData.filter(p => p.ActionStatus != null).length > 0)
      return '';
    else
      return 'disabled';
  }


}



