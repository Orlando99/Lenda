import { Component, OnInit } from '@angular/core';
import { modelparserfordb } from '../../../Workers/utility/modelparserfordb';
import { environment } from '../../../../environments/environment.prod';
import { loan_model, Loan_Association } from '../../../models/loanmodel';
import { LocalStorageService } from 'ngx-webstorage';
import { LoancalculationWorker } from '../../../Workers/calculations/loancalculationworker';
import { ToastsManager } from 'ng2-toastr';
import { LoggingService } from '../../../services/Logs/logging.service';
import { LoancropunitcalculationworkerService } from '../../../Workers/calculations/loancropunitcalculationworker.service';
import { CropapiService } from '../../../services/crop/cropapi.service';
import { getNumericCellEditor, numberValueSetter } from '../../../Workers/utility/aggrid/numericboxes';
import { SelectEditor } from '../../../aggridfilters/selectbox';
import { DeleteButtonRenderer } from '../../../aggridcolumns/deletebuttoncolumn';
import { extractCropValues, lookupCropValue, Cropvaluesetter, getfilteredCropType, lookupCropTypeValue, CropTypevaluesetter } from '../../../Workers/utility/aggrid/cropboxes';
import { AlertifyService } from '../../../alertify/alertify.service';
import { JsonConvert } from 'json2typescript';
import { LoanApiService } from '../../../services/loan/loanapi.service';

@Component({
  selector: 'app-rebator',
  templateUrl: './rebator.component.html',
  styleUrls: ['./rebator.component.scss']
})
export class RebatorComponent implements OnInit {
  public refdata: any = {};
  public columnDefs = [];
  private localloanobject: loan_model = new loan_model();
  // Aggrid
  public rowData = [];
  public components;
  public context;
  public frameworkcomponents;
  public editType;
  private gridApi;
  private columnApi;
  public deleteAction=false;
  style = {
    marginTop: '10px',
    width: '97%',
    height: '240px',
    boxSizing: 'border-box'
  };
  defaultColDef = {
    enableValue: true,
    enableRowGroup: true,
    enablePivot: true
  };
  //region Ag grid Configuration
  constructor(public localstorageservice: LocalStorageService,
    public loanserviceworker: LoancalculationWorker,
    public cropunitservice: CropapiService,
    private toaster: ToastsManager,
    public logging: LoggingService,
    public alertify:AlertifyService,
    public loanapi:LoanApiService){ 

      //Aggrid Specific Code
      this.components = { numericCellEditor: getNumericCellEditor() };
      this.refdata = this.localstorageservice.retrieve(environment.referencedatakey);
      this.frameworkcomponents = {deletecolumn: DeleteButtonRenderer };
      
      //Coldef here
      this.columnDefs = [
        { headerName: 'Rebator', field: 'Assoc_Name',  editable: true },
        { headerName: 'Contact', field: 'Contact',  editable: true},
        { headerName: 'Location', field: 'Location', editable: true},
        { headerName: 'Phone', field: 'Phone', editable: true,  cellEditor: "numericCellEditor", valueSetter: numberValueSetter},
        { headerName: 'Email', field: 'Email',  editable: true},
        { headerName: 'Pref Contact', field: 'Preferred_Contact_Ind',  editable: false },
        { headerName: 'Exp Rebate', field: '',  editable: false  },
        { headerName: 'Ins UOM', field: '',  editable: false},
        { headerName: '', field: 'value',  cellRenderer: "deletecolumn" }

      ];
      ///
      this.context = { componentParent: this };
      //
  }
  
  ngOnInit() {
    this.localstorageservice.observe(environment.loankey).subscribe(res => {
      this.logging.checkandcreatelog(1, 'CropRebator', "LocalStorage updated");
      this.localloanobject = res;
      this.rowData=[];
        this.rowData=this.localloanobject.Association !=null ? this.localloanobject.Association.filter(ac => ac.Assoc_Type_Code == "REB") : []
        this.getgridheight();
    })
    this.getdataforgrid();
    
  }

  getdataforgrid() {
    let obj: any = this.localstorageservice.retrieve(environment.loankey);
    this.logging.checkandcreatelog(1, 'CropRebator', "LocalStorage retrieved");
    if (obj != null && obj != undefined) {
      this.localloanobject = obj;
      this.rowData=[];
      this.rowData=this.localloanobject.Association !=null ? this.localloanobject.Association.filter(ac => ac.Assoc_Type_Code == "REB") : []

    }
  }
 
  synctoDb() {
    this.loanapi.syncloanobject(this.localloanobject).subscribe(res => {
      if (res.ResCode == 1) {
        this.deleteAction = false;
        this.loanapi.getLoanById(this.localloanobject.Loan_Full_ID).subscribe(res => {
          this.logging.checkandcreatelog(3, 'Overview', "APi LOAN GET with Response " + res.ResCode);
          if (res.ResCode == 1) {
            this.toaster.success("Records Synced");
            let jsonConvert: JsonConvert = new JsonConvert();
            this.loanserviceworker.performcalculationonloanobject(jsonConvert.deserialize(res.Data, loan_model));
          }
          else {
            this.toaster.error("Could not fetch Loan Object from API")
          }
        });
      }
      else {
        this.toaster.error("Error in Sync");
      }
    });
  }

  //Grid Events
  addrow() {
    var newItem = new Loan_Association();
    newItem.Loan_Full_ID=this.localloanobject.Loan_Full_ID;
    newItem.ActionStatus = 1;
    var res = this.rowData.push(newItem);
    this.gridApi.updateRowData({ add: [newItem] });
    this.gridApi.startEditingCell({
      rowIndex: this.rowData.length-1,
      colKey: "Assoc_Name"
    });
    this.localloanobject.Association.push(newItem);
    this.getgridheight();
  }


  rowvaluechanged(value: any) {
    var obj = value.data;
    if (obj.Assoc_ID == 0) {
      obj.ActionStatus = 1;
      this.localloanobject.Association[this.localloanobject.Association.length - 1] = value.data;
    }
    else {
      var rowindex = this.localloanobject.Association.findIndex(as => as.Assoc_ID == obj.Assoc_ID);
      if (obj.ActionStatus != 1)
        obj.ActionStatus = 2;
      this.localloanobject.Association[rowindex] = obj;
    }
    this.loanserviceworker.performcalculationonloanobject(this.localloanobject);

  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.getgridheight();
  }

  DeleteClicked(rowIndex: any) {
    this.alertify.confirm("Confirm", "Do you Really Want to Delete this Record?").subscribe(res => {
      if (res == true) {
        var obj = this.localloanobject.Association[rowIndex];
        if (obj.Assoc_ID == 0) {
          this.localloanobject.Association.splice(rowIndex, 1);
          
        }
        else {
          this.deleteAction = true;
          obj.ActionStatus = 3;
        }
        this.loanserviceworker.performcalculationonloanobject(this.localloanobject);
      }
    })

  }

  syncenabled(){
    return this.rowData.filter(p => p.ActionStatus != 0).length > 0 || this.deleteAction
  }

  getgridheight(){
    this.style.height=(28*(this.rowData.length+2)).toString()+"px";
  }

  onGridSizeChanged(Event: any) {
    debugger
    try{
    this.gridApi.sizeColumnsToFit();
  }
  catch{

  }
  }
}
