import { Component, OnInit } from '@angular/core';
import { modelparserfordb } from '../../../Workers/utility/modelparserfordb';
import { environment } from '../../../../environments/environment';
import { loan_model } from '../../../models/loanmodel';
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

@Component({
  selector: 'app-price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.scss']
})
export class PriceComponent implements OnInit {
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
  //region Ag grid Configuration
  constructor(public localstorageservice: LocalStorageService,
    public loanserviceworker: LoancalculationWorker,
    public cropunitservice: CropapiService,
    private toaster: ToastsManager,
    public logging: LoggingService,
    public alertify:AlertifyService
  ) {

    //Aggrid Specific Code
    this.frameworkcomponents = { selectEditor: SelectEditor, deletecolumn: DeleteButtonRenderer };
    this.components = { numericCellEditor: getNumericCellEditor() };
    this.refdata = this.localstorageservice.retrieve(environment.referencedatakey);
    //Coldef here
    this.columnDefs = [
      {
        headerName: 'Crop', field: 'Crop_Code', width: 120, editable: true, cellEditor: "selectEditor",
        cellEditorParams: {
          values: extractCropValues(this.refdata.CropList)
        },
        valueFormatter: function (params) {
          return lookupCropValue(params.colDef.cellEditorParams.values, params.value);
        },
        valueSetter: Cropvaluesetter
      },
      {
        headerName: 'Crop type', field: 'Crop_Type_Code', width: 120, editable: true, cellEditor: "selectEditor",
        cellEditorParams: getfilteredCropType,
        valueFormatter: function (params) {
          return lookupCropTypeValue(params.value);
        },
        valueSetter: CropTypevaluesetter
      },
      { headerName: 'Crop Price', field: 'Z_Price', width: 120, editable: false , cellEditor: "numericCellEditor", valueSetter: numberValueSetter},
      { headerName: 'Basis_Adj', field: 'Z_Basis_Adj', width: 120, editable: false , cellEditor: "numericCellEditor", valueSetter: numberValueSetter},
      { headerName: 'Marketing_Adj', field: 'Marketing_Adj', editable: true, width: 120 , cellEditor: "numericCellEditor", valueSetter: numberValueSetter},
      { headerName: 'Rebate_Adj', field: 'Z_Rebate_Adj', editable: true, width: 120 , cellEditor: "numericCellEditor", valueSetter: numberValueSetter},
      { headerName: 'Adj Price', field: 'Z_Adj_Price', width: 120, editable: true, cellEditor: "numericCellEditor", valueSetter: numberValueSetter },
      { headerName: 'Contract Qty', field: 'value', width: 120, editable: true, cellEditor: "numericCellEditor", valueSetter: numberValueSetter },
      { headerName: 'Contract Price', field: 'value', width: 120, editable: true , cellEditor: "numericCellEditor", valueSetter: numberValueSetter},
      { headerName: '% Booked', field: 'Booking_Ind', editable: true, width: 120 , cellEditor: "numericCellEditor", valueSetter: numberValueSetter},
      { headerName: 'Ins UOM', field: 'Bu', width: 120, editable: true, cellEditor: "numericCellEditor", valueSetter: numberValueSetter },
      { headerName: '', field: 'value', width: 120, cellRenderer: "deletecolumn" },

    ];
    ///
    this.context = { componentParent: this };
    //
  }
  ngOnInit() {
    this.localstorageservice.observe(environment.loankey).subscribe(res => {
      this.logging.checkandcreatelog(1, 'CropPrice', "LocalStorage updated");
      this.localloanobject = res;
        this.rowData=this.localloanobject.LoanCropUnits;
    })
    this.getdataforgrid();
  }
  getdataforgrid() {
    let obj: any = this.localstorageservice.retrieve(environment.loankey);
    this.logging.checkandcreatelog(1, 'CropPrice', "LocalStorage retrieved");
    if (obj != null && obj != undefined) {
      this.localloanobject = obj;
      this.rowData=this.localloanobject.LoanCropUnits;
    }
  }


  // valueupdate(value: any, key: string, lon_id: number) {
  //   debugger
  //   this.editarray[key] = false;
  //   if(value==""){
  //     value="0";
  //   }
  //   this.localloanobject.LoanCropUnits.find(p => p.Loan_CU_ID == lon_id)[key.substr(0, key.length - 1)] = parseFloat(value);
  //   this.editedLoanCuids.push(lon_id);
  //   this.logging.checkandcreatelog(3, 'CropPrice', "Field Edited -" + key);
  //   this.loanserviceworker.performcalculationonloanobject(this.localloanobject);
  //   this.syncenabled = true;
  // }

  // synctoDb() {
  //   debugger
  //   var edits = this.editedLoanCuids.filter((value, index, self) => self.indexOf(value) === index);

  //   edits.forEach(element => {
  //     let obj = this.localloanobject.LoanCropUnits.find(p => p.Loan_CU_ID == element);
  //     this.cropunitservice.saveupdateLoanCropUnit(obj).subscribe(res => {
  //       this.logging.checkandcreatelog(3, 'CropPrice', "Code Synced to DB with ResCode " + res.ResCode);
  //       if (res.ResCode == 1) {
  //         this.toaster.success("Object Synced Successfully");
  //       }
  //       else {
  //         this.toaster.error("Error Encountered while Syncing");
  //       }
  //     })
  //   });
  //   this.syncenabled = false;
  // }

 //Grid Events
 addrow() {
  debugger
  // var newItem = new Loan_Farm();
  // newItem.Loan_Full_ID=this.localloanobject.Loan_PK_ID;
  // var res = this.rowData.push(newItem);
  // this.gridApi.setRowData(this.rowData);
  // this.gridApi.startEditingCell({
  //   rowIndex: this.rowData.length-1,
  //   colKey: "Farm_State_ID"
  // });
}

rowvaluechanged(value: any) {
  var obj = value.data;
  if (obj.Loan_CU_ID == undefined) {
    obj.ActionStatus = 1;
    obj.Loan_CU_ID=0;
    this.localloanobject.LoanCropUnits[this.localloanobject.LoanCropUnits.length]=value.data;
  }
  else {
    var rowindex=this.localloanobject.LoanCropUnits.findIndex(p=>p.Loan_CU_ID==obj.Loan_CU_ID);
    if(obj.ActionStatus!=1)
     obj.ActionStatus = 2;
    this.localloanobject.LoanCropUnits[rowindex]=obj;
  }
  this.loanserviceworker.performcalculationonloanobject(this.localloanobject);

}
onGridReady(params) {
  this.gridApi = params.api;
  this.columnApi = params.columnApi;

}
DeleteClicked(rowIndex: any) {
  this.alertify.confirm("Confirm", "Do you Really Want to Delete this Record?").subscribe(res => {
    if (res == true) {
      var obj = this.localloanobject.Farms[rowIndex];
      if (obj.Farm_ID == 0) {
        this.localloanobject.Farms.splice(rowIndex, 1);
      }
      else {
        obj.ActionStatus = 3;
      }
      this.loanserviceworker.performcalculationonloanobject(this.localloanobject);
    }
  })

}

  syncenabled(){
   return this.rowData.filter(p=>p.ActionStatus!=0).length>0
  }
}
