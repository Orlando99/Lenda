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
import { numberValueSetter, getNumericCellEditor, formatPhoneNumber, getPhoneCellEditor } from '../../../Workers/utility/aggrid/numericboxes';
import { extractStateValues, lookupStateValue, Statevaluesetter, extractCountyValues, lookupCountyValue, Countyvaluesetter, getfilteredcounties } from '../../../Workers/utility/aggrid/stateandcountyboxes';
import { SelectEditor } from '../../../aggridfilters/selectbox';
import { DeleteButtonRenderer } from '../../../aggridcolumns/deletebuttoncolumn';
import { AlertifyService } from '../../../alertify/alertify.service';
import { LoanApiService } from '../../../services/loan/loanapi.service';
import { JsonConvert } from 'json2typescript';
/// <reference path="../../../Workers/utility/aggrid/numericboxes.ts" />
@Component({
  selector: 'app-distributer',
  templateUrl: './distributer.component.html',
  styleUrls: ['./distributer.component.scss']
})
export class DistributerComponent implements OnInit {
  public refdata: any = {};
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
  style = {
    marginTop: '10px',
    width: '96%',
    //height: '240px',
    boxSizing: 'border-box'
  };
  //region Ag grid Configuration


  returncountylist() {
    return this.refdata.CountyList;
  }


  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    params.api.sizeColumnsToFit();
    //this.getgridheight();
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
    this.components = { numericCellEditor: getNumericCellEditor() ,  phoneCellEditor: getPhoneCellEditor()};
    
    this.refdata = this.localstorageservice.retrieve(environment.referencedatakey);
    this.localloanobject = this.localstorageservice.retrieve(environment.loankey);
    //Coldef here
    
    this.columnDefs = [
      
      { headerName: 'Distributor', field: 'Assoc_Name',  editable: true,cellClass: ['lenda-editable-field'] },      
      { headerName: 'Contact', field: 'Contact',  editable: true,cellClass: ['lenda-editable-field'] },
      { headerName: 'Location', field: 'Location',  editable: true,cellClass: ['lenda-editable-field'] },
      { headerName: 'Phone', field: 'Phone', editable: true,cellEditor: "phoneCellEditor", valueFormatter: formatPhoneNumber, cellClass: ['lenda-editable-field']},
      { headerName: 'Email', field: 'Email', editable: true,cellClass: ['lenda-editable-field']},
      { headerName: 'Pref Contact', width: 80, field: 'Preferred_Contact_Ind',  editable: true,cellEditor: "numericCellEditor", valueSetter: numberValueSetter,cellClass: ['lenda-editable-field'] },
      { headerName: '', field: 'value', width: 80, cellRenderer: "deletecolumn" },
    ];
    ///
    this.context = { componentParent: this };
  }
  ngOnInit() {  

    this.localstorageservice.observe(environment.loankey).subscribe(res => {
      // this.logging.checkandcreatelog(1, 'LoanAgents', "LocalStorage updated");
      //this.localloanobject = this.localstorageservice.retrieve(environment.loankey);
      if(res){
        this.localloanobject = res;
        if (this.localloanobject != null && this.localloanobject != undefined && this.localloanobject.Association!=null && this.localloanobject.Association !=undefined) {
          this.rowData = this.localloanobject.Association.filter(p => p.ActionStatus != 3 &&  p.Assoc_Type_Code=="DIS");
        }
        this.gridApi && this.gridApi.refreshCells();
    }
    });
  

    this.getdataforgrid();
    this.editType = "fullRow";
  }
  getdataforgrid() {
   this.localloanobject = this.localstorageservice.retrieve(environment.loankey);
    if (this.localloanobject != null && this.localloanobject != undefined && this.localloanobject.Association!=null && this.localloanobject.Association !=undefined) {
      this.rowData = this.localloanobject.Association.filter(p => p.ActionStatus != 3 &&  p.Assoc_Type_Code=="DIS");
    }
  }


  rowvaluechanged(value: any) {
    
    var obj = value.data;
    if (obj.Assoc_ID == undefined) {
      obj.ActionStatus = 1;
      obj.Assoc_ID=0;  
      // var rowIndex=this.localloanobject.Association.filter(p => p.Assoc_Type_Code=="DIS").length;
      // this.localloanobject.Association.filter(p => p.Assoc_Type_Code=="DIS")[rowIndex]=value.data;
    }
    else {
      if(obj.Assoc_ID){
        obj.ActionStatus = 2;
      }
      
      //this.localloanobject.Association.filter(p => p.ActionStatus != 3 &&  p.Assoc_Type_Code=="DIS")[rowindex]=obj;
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
        
    var newItem = new Loan_Association();
    newItem.Loan_Full_ID=this.localloanobject.Loan_Full_ID;
    newItem.Assoc_Type_Code="DIS";
    newItem.Preferred_Contact_Ind=1;
    newItem.Assoc_ID = undefined;
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
        var obj = this.rowData[rowIndex];
        if(obj){
          let associationIndex = this.localloanobject.Association.findIndex(assoc=>assoc == obj);
          if(!obj.Assoc_ID){
            this.localloanobject.Association.splice(associationIndex,1);
          }else{
            obj.ActionStatus =3;
          }
        }
          
        
        // var obj = this.localloanobject.Association.filter(p => p.ActionStatus != 3 &&  p.Assoc_Type_Code=="DIS")[rowIndex];
        // if (obj.Assoc_ID == 0) {
        //   let discAssoc = this.localloanobject.Association.filter(p => p.ActionStatus != 3 &&  p.Assoc_Type_Code=="DIS");
        //   discAssoc.splice(rowIndex, 1);
        // }
        // else {
        //   obj.ActionStatus = 3;
        // }
        this.loanserviceworker.performcalculationonloanobject(this.localloanobject);
      }
    })

  }

  // getgridheight(){
  //   this.style.height=(28*(this.rowData.length+2)).toString()+"px";
  //  }
  //

}



