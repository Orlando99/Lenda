import { Component, OnInit, Input, OnChanges } from '@angular/core';
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
import { NumericEditor } from '../../../aggridfilters/numericaggrid';
import { DeleteButtonRenderer } from '../../../aggridcolumns/deletebuttoncolumn';
import { AlertifyService } from '../../../alertify/alertify.service';
import { LoanApiService } from '../../../services/loan/loanapi.service';
import { JsonConvert } from 'json2typescript';
import { EmailEditor } from '../../../Workers/utility/aggrid/emailboxes';
import { Preferred_Contact_Ind_Options, PreferredContactFormatter } from '../../../Workers/utility/aggrid/preferredcontactboxes';
import { getAlphaNumericCellEditor } from '../../../Workers/utility/aggrid/alphanumericboxes';

/// <reference path="../../../Workers/utility/aggrid/numericboxes.ts" />
@Component({
  selector: 'app-association',
  templateUrl: './association.component.html',
  styleUrls: ['./association.component.scss']
})
export class AssociationComponent implements OnInit, OnChanges {
  public refdata: any = {};
  public isgriddirty:boolean;
  indexsedit = [];
  public columnDefs = [];
  private localloanobject: loan_model = new loan_model();
  @Input('header')
  header :string = '';
  @Input('associationTypeCode')
  associationTypeCode :string = '';
  @Input("withoutChevron")
  withoutChevron : boolean = false;
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
    this.components = { numericCellEditor: getNumericCellEditor(), alphaNumericCellEditor: getAlphaNumericCellEditor(), };

    this.refdata = this.localstorageservice.retrieve(environment.referencedatakey);
    this.localloanobject = this.localstorageservice.retrieve(environment.loankey);
    //Coldef here

    
  }
  
  ngOnInit() {
    this.prepareColDefs();
    this.localstorageservice.observe(environment.loankey).subscribe(res => {
      // this.logging.checkandcreatelog(1, 'LoanAgents', "LocalStorage updated");
      //this.localloanobject = this.localstorageservice.retrieve(environment.loankey);
      if(res){
        this.localloanobject = res;
        if(this.localloanobject.Association){
          if(this.localloanobject.srccomponentedit == this.associationTypeCode+"AssociationComponent"){
            this.rowData[this.localloanobject.lasteditrowindex] = this.localloanobject.Association.filter(p => p.ActionStatus != 3 &&  p.Assoc_Type_Code==this.associationTypeCode)[this.localloanobject.lasteditrowindex];
          }else{
            this.rowData = this.localloanobject.Association.filter(p => p.ActionStatus != 3 &&  p.Assoc_Type_Code==this.associationTypeCode);    
          }
        }
        
      }
      

    });
    
  }

  ngOnChanges(){
    this.prepareColDefs();
  }

  prepareColDefs(){
    if(this.header && this.associationTypeCode){

      this.columnDefs = [

        { headerName: this.header, field: 'Assoc_Name', editable: true,cellClass: ['editable-color'],cellEditor: "alphaNumericCellEditor" },
        // { headerName: 'Agency', width: 80, field: 'Assoc_Type_Code',  editable: false },
        { headerName: 'Contact', field: 'Contact',  editable: true,cellClass: ['editable-color'],cellEditor: "alphaNumericCellEditor" },
        { headerName: 'Location', field: 'Location',  editable: true,cellClass: ['editable-color'],cellEditor: "alphaNumericCellEditor" },
        { headerName: 'Phone', field: 'Phone', editable: true,cellClass: ['editable-color'], cellEditor: "numericCellEditor"},
        { headerName: 'Email', field: 'Email', editable: true,cellClass: ['editable-color']},
        { headerName: 'Pref Contact',width:140, field: 'Preferred_Contact_Ind',  editable: true,cellEditor: "selectEditor",cellClass: ['editable-color'],
            cellEditorParams : {values : Preferred_Contact_Ind_Options},
            valueFormatter : PreferredContactFormatter
          },
        { headerName: '', field: 'value', width: 80, cellRenderer: "deletecolumn" },
      ];
      ///
      this.context = { componentParent: this };

      


      this.getdataforgrid();
      this.editType = "";
    }else{
      throw new Error("'header' and 'associationTypeCode' are required for Association Component");
       
    }
  }
  getdataforgrid() {
   // let obj: loan_model = this.localstorageservice.retrieve(environment.loankey);
    // this.logging.checkandcreatelog(1, 'LoanAgents', "LocalStorage retrieved");
    //if (obj != null && obj != undefined) {
    if (this.localloanobject != null && this.localloanobject != undefined) {
      //this.localloanobject = obj;
      if(this.localloanobject.Association)
        this.rowData = this.localloanobject.Association.filter(p => p.ActionStatus != 3 &&  p.Assoc_Type_Code==this.associationTypeCode);
      else
        this.rowData = null;
    }
  }


  rowvaluechanged(value: any) {

    var obj = value.data;
    if (obj.Assoc_ID==0 || obj.Assoc_ID==undefined) {
      obj.ActionStatus = 1;
      obj.Assoc_ID=0;
      // not required as memory reference are same so automatically updates the localStorage
      //var rowIndex=this.localloanobject.Association.filter(p => p.Assoc_Type_Code==this.associationTypeCode).length;
      //this.localloanobject.Association.filter(p => p.Assoc_Type_Code==this.associationTypeCode)[rowIndex]=value.data;
    }
    else {
      //var rowindex=this.localloanobject.Association.filter(p => p.ActionStatus != 3 &&  p.Assoc_Type_Code==this.associationTypeCode).findIndex(p=>p.Assoc_ID==obj.Assoc_ID);
      if(obj.ActionStatus!=1)
      obj.ActionStatus = 2;
      //this.localloanobject.Association.filter(p => p.ActionStatus != 3 &&  p.Assoc_Type_Code==this.associationTypeCode)[rowindex]=obj;
    }
    this.localloanobject.srccomponentedit = this.associationTypeCode+"AssociationComponent";
    this.localloanobject.lasteditrowindex = value.rowIndex;
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
    // newItem.Assoc_Type_Code=this.associationTypeCode;
    // var res = this.gridApi.updateRowData({ add: [newItem] });
    // this.gridApi.startEditingCell({
    //   rowIndex: this.rowData.length,
    //   colKey: "Assoc_ID"
    // });
    var newItem = new Loan_Association();
    newItem.Loan_Full_ID=this.localloanobject.Loan_Full_ID;
    newItem.Assoc_Type_Code=this.associationTypeCode;
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

        let assocObj  = this.rowData[rowIndex];
        let localObjIndex = this.localloanobject.Association.findIndex(assoc => assoc == assocObj);
        if(localObjIndex > -1){
          if(assocObj.ActionStatus == 1){

            this.localloanobject.Association.splice(localObjIndex,1);
          }else{
            assocObj.ActionStatus = 3;
          }
          this.localloanobject.srccomponentedit = undefined;
          this.localloanobject.lasteditrowindex = undefined;
        }
        // var obj = this.localloanobject.Association.filter(p => p.ActionStatus != 3 &&  p.Assoc_Type_Code==this.associationTypeCode)[rowIndex];

        // if (obj.Assoc_ID === 0) {
        //   let filteting = this.localloanobject.Association.filter(p => p.ActionStatus != 3 &&  p.Assoc_Type_Code==this.associationTypeCode);

        //   this.localloanobject.Association.splice(this.localloanobject.Association.indexOf(filteting[rowIndex]), 1);

        // }
        // else {
        //   obj.ActionStatus = 3;
        // }

        // console.log(res,rowIndex, obj, obj.Assoc_ID, this.localloanobject)

        this.loanserviceworker.performcalculationonloanobject(this.localloanobject);
      }
    })

  }

  syncenabled() {
    if(this.localloanobject.Association.filter(p => p.ActionStatus && p.Assoc_Type_Code == this.associationTypeCode).length == 0)
    return 'disabled';
    else
    return '';
  }


  //

}



