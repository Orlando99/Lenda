import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { loan_model, Loan_Association } from '../../../models/loanmodel';
import { LocalStorageService } from 'ngx-webstorage';
import { LoancalculationWorker } from '../../../Workers/calculations/loancalculationworker';
import { ToastsManager } from 'ng2-toastr';
import { LoggingService } from '../../../services/Logs/logging.service';
import { environment } from '../../../../environments/environment.prod';
import { modelparserfordb } from '../../../Workers/utility/modelparserfordb';
import { Loan_Farm } from '../../../models/farmmodel.';
import { InsuranceapiService } from '../../../services/insurance/insuranceapi.service';
import { numberValueSetter, getNumericCellEditor, formatPhoneNumber, getPhoneCellEditor } from '../../../Workers/utility/aggrid/numericboxes';
import { extractStateValues, lookupStateValue, Statevaluesetter, extractCountyValues, lookupCountyValue, Countyvaluesetter, getfilteredcounties } from '../../../Workers/utility/aggrid/stateandcountyboxes';
import { SelectEditor } from '../../../aggridfilters/selectbox';
import { DeleteButtonRenderer } from '../../../aggridcolumns/deletebuttoncolumn';
import { AlertifyService } from '../../../alertify/alertify.service';
import { LoanApiService } from '../../../services/loan/loanapi.service';
import { JsonConvert } from 'json2typescript';
import * as _ from 'lodash';
import { getAlphaNumericCellEditor } from '../../../Workers/utility/aggrid/alphanumericboxes';
/// <reference path="../../../Workers/utility/aggrid/numericboxes.ts" />
@Component({
  selector: 'app-harvester',
  templateUrl: './harvester.component.html',
  styleUrls: ['./harvester.component.scss']
})
export class HarvesterComponent implements OnInit {
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
  public savedData = [];
  private gridApi;
  private columnApi;
 
  style = {
    marginTop: '10px',
    width: '96%',
    boxSizing: 'border-box'
  };

  @ViewChild("myGrid") gridEl: ElementRef;

  defaultColDef = {
    enableValue: true,
    enableRowGroup: true,
    enablePivot: true
  };
  returncountylist() {
    return this.refdata.CountyList;
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
    this.components = { numericCellEditor: getNumericCellEditor() ,  phoneCellEditor: getPhoneCellEditor(), alphaNumeric: getAlphaNumericCellEditor(),};
    
    this.refdata = this.localstorageservice.retrieve(environment.referencedatakey);
    this.localloanobject = this.localstorageservice.retrieve(environment.loankey);
    //Coldef here
    
    this.columnDefs = [
      
      { headerName: 'Harvester', field: 'Assoc_Name',  editable: true,cellEditor: "alphaNumeric",cellClass: ['editable-color'] },      
      { headerName: 'Contact', field: 'Contact',  editable: true,cellEditor: "alphaNumeric",cellClass: ['editable-color'] },
      { headerName: 'Location', field: 'Location',  editable: true,cellEditor: "alphaNumeric",cellClass: ['editable-color'] },
      { headerName: 'Phone', field: 'Phone', editable: true,cellEditor: "phoneCellEditor", valueFormatter: formatPhoneNumber, cellClass: ['editable-color']},
      { headerName: 'Email', field: 'Email', editable: true,cellClass: ['editable-color']},
      { headerName: 'Pref Contact', width: 80, field: 'Preferred_Contact_Ind',  editable: true,cellEditor: "numericCellEditor", valueSetter: numberValueSetter,cellClass: ['editable-color'] },
      { headerName: '', field: 'value', width: 80, cellRenderer: "deletecolumn" },
    ];
    ///
    this.context = { componentParent: this };
  }
  ngOnInit() {  

    this.localstorageservice.observe(environment.loankey).subscribe(res=>{
      // this.logging.checkandcreatelog(1,'CropYield',"LocalStorage updated");
       if (res.srccomponentedit == "HarvesterComponent") {
         //if the same table invoked the change .. change only the edited row
         this.localloanobject = res;
         this.rowData[res.lasteditrowindex] =  this.localloanobject.Association.filter(p => p.ActionStatus != 3 &&  p.Assoc_Type_Code=="HAR")[res.lasteditrowindex];
         this.gridApi.refreshCells();
       }
       else {
         this.localloanobject = res;
         this.rowData= this.localloanobject.Association.filter(p => p.ActionStatus != 3 &&  p.Assoc_Type_Code=="HAR");
         this.gridApi.refreshCells();
       }
       this.gridApi.refreshCells();
     });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    //setgriddefaults(this.gridApi,this.columnApi);
    // toggletoolpanel(false,this.gridApi);
    // removeHeaderMenu(this.gridApi);
    params.api.sizeColumnsToFit();
    this.getdataforgrid();
  }

  getdataforgrid() {
    let obj: any = this.localstorageservice.retrieve(environment.loankey);
    // this.logging.checkandcreatelog(1, 'CropRebator', "LocalStorage retrieved");
    if (obj != null && obj != undefined) {
      this.localloanobject = obj;
      this.rowData=[];
      this.rowData=this.localloanobject.Association !=null ? this.localloanobject.Association.filter(ac => ac.Assoc_Type_Code == "HAR") : []
      this.rowData = this.rowData.map(row=>{ row.ActionStatus=0; return row;});
      this.savedData = _.cloneDeep(this.rowData);
      //this.getgridheight();
    }
  }


  rowvaluechanged(params: any) {
    
    var obj = params.data;
    if (obj.Assoc_ID == 0) {
      obj.ActionStatus = 1;
      this.localloanobject.Association[this.localloanobject.Association.length - 1] = obj;
    }
    else {
      var rowindex = this.localloanobject.Association.findIndex(as => as.Assoc_ID == obj.Assoc_ID);
      if (obj.ActionStatus != 1){
        obj.ActionStatus = 2;  
        if (params.value != this.localloanobject.Association[rowindex][params.colDef.field]){
          this.localloanobject.Association[rowindex][params.colDef.field] = params.value;        
        }
      }
       
      this.localloanobject.Association[rowindex] = obj;
    }

    this.localloanobject.srccomponentedit = "HarvesterComponent";
    this.localloanobject.lasteditrowindex = params.rowIndex;
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
    newItem.ActionStatus = 1;
    newItem.Preferred_Contact_Ind = 1;

    newItem.Assoc_Type_Code = "HAR";
    var res = this.rowData.push(newItem);

    //this.gridApi.updateRowData({ add: [newItem] });
    this.gridApi.setRowData(this.rowData);
    this.gridApi.startEditingCell({
      rowIndex: this.rowData.length-1,
      colKey: "Assoc_Name"
    });
    
    this.localloanobject.Association.push(newItem);
    // this.getgridheight();
    
  }

  DeleteClicked(rowIndex: any) {

    this.alertify.confirm("Confirm", "Do you Really Want to Delete this Record?").subscribe(
      res => {
      if (res == true) {
        var obj = this.rowData[rowIndex];
        this.rowData.splice(rowIndex, 1);
        this.gridApi.setRowData(this.rowData);
        let index = this.localloanobject.Association.findIndex(as=>as==obj);
        if (obj.ActionStatus != 1) {
          this.localloanobject.Association[index].ActionStatus = 3;
        } else {
          this.localloanobject.Association.splice(index, 1);
          this.localloanobject.LoanCollateral.splice(this.localloanobject.Association.indexOf(obj), 1);
        }

      }
    })

  }

  // getgridheight(){
  //   this.style.height=(28*(this.rowData.length+2)).toString()+"px";
  //  }
  //

  syncenabled(){
    // var errPhne = this.rowData.filter(rd => { console.log(rd.Phone.length); return rd.Phone.length < 10;});
    // console.log(errPhne);
    console.log(this.rowData, this.savedData);
    if ( this.isArrayEqual(this.rowData, this.savedData)){
      return 'disabled';
    } else 
      return '';
  }

  onGridSizeChanged(params) {
    //params.api.sizeColumnsToFit();
    params.api.resetRowHeights();
  }

  isArrayEqual(x, y) {
    if (x.length != y.length ) return false;
    return _(x).differenceWith(y, _.isEqual).isEmpty() ;
  };

}



