import { Component, OnInit, Input, OnChanges, EventEmitter, Output } from '@angular/core';
import { loan_model, Loan_Association, AssociationTypeCode } from '../../../models/loanmodel';
import { LocalStorageService } from 'ngx-webstorage';
import { LoancalculationWorker } from '../../../Workers/calculations/loancalculationworker';
import { ToastsManager } from 'ng2-toastr';
import { LoggingService } from '../../../services/Logs/logging.service';
import { environment } from '../../../../environments/environment.prod';
import { InsuranceapiService } from '../../../services/insurance/insuranceapi.service';
import { numberValueSetter, getNumericCellEditor, formatPhoneNumber, getPhoneCellEditor } from '../../../Workers/utility/aggrid/numericboxes';
import { SelectEditor } from '../../../aggridfilters/selectbox';
import { DeleteButtonRenderer } from '../../../aggridcolumns/deletebuttoncolumn';
import { AlertifyService } from '../../../alertify/alertify.service';
import { LoanApiService } from '../../../services/loan/loanapi.service';
import { EmailEditor } from '../../../Workers/utility/aggrid/emailboxes';
import { Preferred_Contact_Ind_Options, PreferredContactFormatter } from '../../../Workers/utility/aggrid/preferredcontactboxes';
import { getAlphaNumericCellEditor } from '../../../Workers/utility/aggrid/alphanumericboxes';
import { Page, PublishService } from '../../../services/publish.service';
import { currencyFormatter } from '../../../Workers/utility/aggrid/collateralboxes';

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
  private ReferredTypes = ['Word of Mouth','Distributer','Agency','Bank','Other'];
  private Responses = ['Positive','Nuetral','Negetive'];
  
  @Input('header')
  header :string = '';
  @Input('associationTypeCode')
  associationTypeCode :AssociationTypeCode;
  @Input("withoutChevron")
  withoutChevron : boolean = false;
  @Output('onRowCountChange')
  onRowCountChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() currentPageName: Page;
  @Input() expanded: boolean = true; 

  // Aggrid
  public rowData = new Array<Loan_Association>();
  public components;
  public context;
  public frameworkcomponents;
  public editType;
  public pinnedBottomRowData = [];
  private gridApi;
  //region Ag grid Configuration


  returncountylist() {
    return this.refdata.CountyList;
  }


  onGridReady(params) {
    this.gridApi = params.api;
    params.api.sizeColumnsToFit();
  }
  //End here
  // Aggrid ends
  constructor(public localstorageservice: LocalStorageService,
    public loanserviceworker: LoancalculationWorker,
    public insuranceservice: InsuranceapiService,
    public logging: LoggingService,
    public alertify: AlertifyService,
    public loanapi:LoanApiService,
    private publishService : PublishService
  ) {
    this.frameworkcomponents = { emaileditor:EmailEditor,selectEditor: SelectEditor, deletecolumn: DeleteButtonRenderer };
    this.components = { numericCellEditor: getNumericCellEditor(), alphaNumericCellEditor: getAlphaNumericCellEditor(), phoneCellEditor: getPhoneCellEditor() };

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

        { headerName: this.header, field: 'Assoc_Name', editable: true,cellClass: ['editable-color'],cellEditor: "alphaNumericCellEditor" } ,
        // { headerName: 'Agency', width: 80, field: 'Assoc_Type_Code',  editable: false },
        { headerName: 'Contact', field: 'Contact',width: 100,  editable: true,cellClass: ['editable-color'],cellEditor: "alphaNumericCellEditor" },
        { headerName: 'Location', field: 'Location',  editable: true,cellClass: ['editable-color'] },
        // { headerName: 'Phone', field: 'Phone', editable: true,cellClass: ['editable-color'], cellEditor: "numericCellEditor"},
        { headerName: 'Phone', field: 'Phone',width:140, editable: true,  cellEditor: "phoneCellEditor", valueFormatter:formatPhoneNumber, cellClass: ['editable-color']},
        { headerName: 'Email', field: 'Email', editable: true,cellClass: ['editable-color']},
        { headerName: 'Pref Contact',width:140, field: 'Preferred_Contact_Ind',  editable: true,cellEditor: "selectEditor",cellClass: ['editable-color'],
            cellEditorParams : {values : Preferred_Contact_Ind_Options},
            valueFormatter : PreferredContactFormatter
          },
        { headerName: '', field: 'value', width: 50, cellRenderer: "deletecolumn" },
      ];

      if(this.associationTypeCode == AssociationTypeCode.Rebator || this.associationTypeCode == AssociationTypeCode.LienHolder){
        
         let amountCol =  { headerName: 'Amount',width:120, field: 'Amount',  headerClass: "rightaligned", editable: true,  cellEditor: "numericCellEditor", valueSetter: numberValueSetter, cellClass: ['editable-color','rightaligned'],
              cellEditorParams: (params)=> {
                return { value : params.data.Amount || 0}
              },
              valueFormatter: currencyFormatter
          };
          this.columnDefs.splice(this.columnDefs.length-2,0,amountCol);
        }
      if(this.associationTypeCode == AssociationTypeCode.Rebator){
          let InsUOMCol = { headerName: 'Ins UOM',width:120, field: 'Ins_UOM',valueFormatter: function () {
            return 'bu';
          }};
          this.columnDefs.splice(this.columnDefs.length-2,0,InsUOMCol);
        
      }
      if(this.associationTypeCode == AssociationTypeCode.ReferredFrom){
        let REFColumn = { headerName: 'Type',width:140, field: 'Referred_Type',  editable: true,cellEditor: "selectEditor",cellClass: ['editable-color'],
        cellEditorParams : {values : this.getSelectBoxValueFromPremitiveArray(this.ReferredTypes)}
        };
        this.columnDefs.splice(this.columnDefs.length-2,0,REFColumn);
      }
      if(this.associationTypeCode == AssociationTypeCode.CreditRererrence){
        let CRFColumn = { headerName: 'Response',width:140, field: 'Response',  editable: true,cellEditor: "selectEditor",cellClass: ['editable-color'],
        cellEditorParams : {values : this.getSelectBoxValueFromPremitiveArray(this.Responses)}
        };
        this.columnDefs.splice(this.columnDefs.length-2,0,CRFColumn);
      }
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

  
  getSelectBoxValueFromPremitiveArray(array : Array<string>){
    let selectBoxOptions : Array< {key,value}>= [];
    array.forEach(element => selectBoxOptions.push({key : element,value : element}));
    return selectBoxOptions;
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
    this.publishService.enableSync(this.currentPageName);
  }

  // synctoDb() {
  //   this.gridApi.showLoadingOverlay();	
  // this.loanapi.syncloanobject(this.localloanobject).subscribe(res=>{
  //   if(res.ResCode==1){
  //    this.loanapi.getLoanById(this.localloanobject.Loan_Full_ID).subscribe(res => {

  //      this.logging.checkandcreatelog(3,'Overview',"APi LOAN GET with Response "+res.ResCode);
  //      if (res.ResCode == 1) {
  //        this.toaster.success("Records Synced");
  //        let jsonConvert: JsonConvert = new JsonConvert();
  //        this.loanserviceworker.performcalculationonloanobject(jsonConvert.deserialize(res.Data, loan_model));
  //      }
  //      else{
  //        this.toaster.error("Could not fetch Loan Object from API")
  //      }
  //      this.gridApi.hideOverlay()
  //    });
  //   }
  //   else{
  //     this.gridApi.hideOverlay()
  //     this.toaster.error("Error in Sync");
  //   }
  // })


  // }

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
    this.gridApi.updateRowData({ add: [newItem] });
    this.gridApi.startEditingCell({
      rowIndex: this.rowData.length,
      colKey: "Assoc_Name"
    });
    this.localloanobject.Association.push(newItem);
    this.onRowCountChange.emit({count : this.localloanobject.Association.filter(p => p.ActionStatus != 3 &&  p.Assoc_Type_Code==this.associationTypeCode).length});
    this.publishService.enableSync(this.currentPageName);
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
        this.onRowCountChange.emit({count : this.localloanobject.Association.filter(p => p.ActionStatus != 3 &&  p.Assoc_Type_Code==this.associationTypeCode).length});
        this.loanserviceworker.performcalculationonloanobject(this.localloanobject);
        this.publishService.enableSync(this.currentPageName);
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



