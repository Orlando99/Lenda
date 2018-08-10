import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { modelparserfordb } from '../../../Workers/utility/modelparserfordb';
import { environment } from '../../../../environments/environment.prod';
import { loan_model, Loan_Association } from '../../../models/loanmodel';
import { LocalStorageService } from 'ngx-webstorage';
import { LoancalculationWorker } from '../../../Workers/calculations/loancalculationworker';
import { ToastsManager } from 'ng2-toastr';
import { LoggingService } from '../../../services/Logs/logging.service';
import { LoancropunitcalculationworkerService } from '../../../Workers/calculations/loancropunitcalculationworker.service';
import { CropapiService } from '../../../services/crop/cropapi.service';
import { getNumericCellEditor, numberValueSetter, formatPhoneNumber, getPhoneCellEditor } from '../../../Workers/utility/aggrid/numericboxes';
import { SelectEditor } from '../../../aggridfilters/selectbox';
import { DeleteButtonRenderer } from '../../../aggridcolumns/deletebuttoncolumn';
import { extractCropValues, lookupCropValue, Cropvaluesetter, getfilteredCropType, lookupCropTypeValue, CropTypevaluesetter } from '../../../Workers/utility/aggrid/cropboxes';
import { AlertifyService } from '../../../alertify/alertify.service';
import { JsonConvert } from 'json2typescript';
import { LoanApiService } from '../../../services/loan/loanapi.service';
import { getAlphaNumericCellEditor } from '../../../Workers/utility/aggrid/alphanumericboxes';
import * as _ from 'lodash';
import { PriceFormatter } from '../../../Workers/utility/aggrid/formatters';
import { setgriddefaults, toggletoolpanel, removeHeaderMenu } from '../../../aggriddefinations/aggridoptions';
import { Preferred_Contact_Ind_Options, PreferredContactFormatter } from '../../../Workers/utility/aggrid/preferredcontactboxes';
@Component({
  selector: 'app-rebator',
  templateUrl: './rebator.component.html',
  styleUrls: ['./rebator.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RebatorComponent implements OnInit {
  public refdata: any = {};
  public columnDefs = [];
  private localloanobject: loan_model = new loan_model();
  // Aggrid
  public rowData = [];
  public savedData = [];
  public components;
  public context;
  public frameworkcomponents;
  public editType;
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
  //region Ag grid Configuration
  constructor(
    public localstorageservice: LocalStorageService,
    public loanserviceworker: LoancalculationWorker,
    public cropunitservice: CropapiService,
    private toaster: ToastsManager,
    public logging: LoggingService,
    public alertify:AlertifyService,
    public loanapi:LoanApiService){

      //Aggrid Specific Code
      this.components = { numericCellEditor: getNumericCellEditor(), alphaNumeric: getAlphaNumericCellEditor(), phoneCellEditor: getPhoneCellEditor()};
      this.refdata = this.localstorageservice.retrieve(environment.referencedatakey);
      this.frameworkcomponents = { selectEditor: SelectEditor, deletecolumn: DeleteButtonRenderer };

      //Coldef here
      this.columnDefs = [
        { headerName: 'Rebator', field: 'Assoc_Name',width:100,  editable: true, cellEditor: "alphaNumeric", cellClass: ['editable-color'] },
        { headerName: 'Contact', field: 'Contact',width:100,  editable: true, cellClass: ['editable-color']},
        { headerName: 'Location', field: 'Location',width:100, editable: true, cellClass: ['editable-color']},
        { headerName: 'Phone', field: 'Phone',width:100, editable: true,  cellEditor: "phoneCellEditor", valueFormatter:formatPhoneNumber,cellStyle: function(params) {
          if (params.value.length < 10) {
              return {color: 'red'};
          }else{
            return {color: 'blue'}
          }
        }, cellClass: ['editable-color','text-right']},
        { headerName: 'Email', field: 'Email',width:180,  editable: true,  cellClass: ['editable-color']},
        { headerName: 'Pref Contact',width:140, field: 'Preferred_Contact_Ind',  editable: true,cellEditor: "selectEditor",cellClass: ['editable-color'],
          cellEditorParams : {values : Preferred_Contact_Ind_Options},
          valueFormatter : PreferredContactFormatter
        },
        { headerName: 'Exp Rebate',width:140, field: 'Amount',  editable: true,  cellEditor: "numericCellEditor", valueSetter: numberValueSetter, cellClass: ['editable-color','text-right'],
        cellEditorParams: (params)=> {
          return { value : params.data.Amount || 0}
        },
        valueFormatter: function (params) {
          return PriceFormatter(params.value);
        }
      },
        { headerName: 'Ins UOM',width:100, field: 'Ins_UOM',valueFormatter: function (params) {
          return 'bu';
        }
        },
        { headerName: '', field: 'value',  cellRenderer: "deletecolumn" ,width:100}

      ];
      ///
      this.context = { componentParent: this };
      //
  }

  ngOnInit() {
    this.localstorageservice.observe(environment.loankey).subscribe(res => {
      // this.logging.checkandcreatelog(1, 'CropRebator', "LocalStorage updated");
      this.localloanobject = res
      
      if (res.srccomponentedit == "RebatorComponent") {
        //if the same table invoked the change .. change only the edited row
        this.localloanobject = res;
        this.rowData[res.lasteditrowindex] =  this.localloanobject.Association.filter(ac => ac.Assoc_Type_Code == "REB")[res.lasteditrowindex];
      }else{
        this.localloanobject = res
        this.rowData = [];
        this.rowData=this.localloanobject.Association !=null ? this.localloanobject.Association.filter(ac => ac.Assoc_Type_Code == "REB") : []
        
      }
      this.savedData = _.cloneDeep(this.rowData);
      //this.getgridheight();
      this.gridApi && this.gridApi.refreshCells();
      // this.adjustgrid();
    });


  }

  getdataforgrid() {
    let obj: any = this.localstorageservice.retrieve(environment.loankey);
    // this.logging.checkandcreatelog(1, 'CropRebator', "LocalStorage retrieved");
    if (obj != null && obj != undefined) {
      this.localloanobject = obj;
      this.rowData=[];
      this.rowData=this.localloanobject.Association !=null ? this.localloanobject.Association.filter(ac => ac.Assoc_Type_Code == "REB") : []
      this.rowData = this.rowData.map(row=>{ row.ActionStatus=0; return row;});
      this.savedData = _.cloneDeep(this.rowData);
      //this.getgridheight();
    }
  }

synctoDb() {
 this.gridApi.showLoadingOverlay();
    let observables = [];
    observables.push(this.loanapi.syncloanobject(this.localloanobject));
    
    this.rowData.forEach(row=>{
      if (row.ActionStatus == 1) observables.push( this.cropunitservice.addLoanAssociation(row));
      if (row.ActionStatus == 2) observables.push( this.cropunitservice.updateLoanAssociation(row));
    });

    this.loanapi.syncloanobject(this.localloanobject).subscribe(res => {
      if (res.ResCode == 1) {
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
          this.gridApi.hideOverlay();
        });
      }
      else {
        this.gridApi.hideOverlay();
        this.toaster.error("Error in Sync");
      }
    });
  }

  //Grid Events
  addrow() {
    var newItem = new Loan_Association();
    newItem.Loan_Full_ID=this.localloanobject.Loan_Full_ID;
    newItem.ActionStatus = 1;
    newItem.Preferred_Contact_Ind = 1;

    newItem.Assoc_Type_Code = "REB";
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

    this.localloanobject.srccomponentedit = "RebatorComponent";
    this.localloanobject.lasteditrowindex = params.rowIndex;

    //this.loanserviceworker.performcalculationonloanobject(this.localloanobject);
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

  syncenabled(){
    // var errPhne = this.rowData.filter(rd => { console.log(rd.Phone.length); return rd.Phone.length < 10;});
    // console.log(errPhne);
    if ( this.isArrayEqual(this.rowData, this.savedData)){
      return 'disabled';
    } else 
      return '';
  }

  getgridheight(){
    //this.style.height=(29 * (this.rowData.length + 2) ).toString()+"px";
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
