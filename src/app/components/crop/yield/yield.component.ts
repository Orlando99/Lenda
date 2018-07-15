import { Component, OnInit, Inject } from '@angular/core';
import { loan_model } from '../../../models/loanmodel';
import { LocalStorageService } from 'ngx-webstorage';
import { LoancalculationWorker } from '../../../Workers/calculations/loancalculationworker';
import { ToastsManager } from 'ng2-toastr';
import { LoggingService } from '../../../services/Logs/logging.service';
import { environment } from '../../../../environments/environment.prod';
import { modelparserfordb } from '../../../Workers/utility/modelparserfordb';
import { Loan_Crop_Type_Practice_Type_Yield_EditModel, Loan_Crop_Type_Practice_Type_Yield_AddModel } from '../../../models/cropmodel';
import { CropapiService } from '../../../services/crop/cropapi.service';
import { getNumericCellEditor, numberValueSetter } from '../../../Workers/utility/aggrid/numericboxes';
import { lookupCropValue, Cropvaluesetter, lookupCropTypeValue, CropTypevaluesetter, extractCropValues, lookupCropValuewithoutmapping, cropNameValueSetter } from '../../../Workers/utility/aggrid/cropboxes';
import { LoanApiService } from '../../../services/loan/loanapi.service';
import { JsonConvert } from 'json2typescript';
import { DeleteButtonRenderer } from '../../../aggridcolumns/deletebuttoncolumn';
import { AlertifyService } from '../../../alertify/alertify.service';
import { tick } from '@angular/core/testing';
import { SelectEditor } from '../../../aggridfilters/selectbox';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { empty } from 'rxjs/observable/empty';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-yield',
  templateUrl: './yield.component.html',
  styleUrls: ['./yield.component.scss']
})
export class YieldComponent implements OnInit {
  public refdata: any = {};
  public years=[];
  public edits=[];
  public rowData=[];
  public columnDefs=[];
  public croppricesdetails:[any];
  public localloanobject:loan_model=new loan_model();
  public components;
  public gridApi;
  public columnApi;
  public deleteAction = false;
  public addAction = false;
  public cropYear;
  context: any;

  frameworkcomponents: { selectEditor: typeof SelectEditor, deletecolumn: typeof DeleteButtonRenderer; };
  style = {
    marginTop: '10px',
    width: '97%',
    height: '240px',
    boxSizing: 'border-box'
  };
  defaultColDef: { headerComponentParams: { template: string; }; };

  constructor(public localstorageservice:LocalStorageService,
  public loanserviceworker:LoancalculationWorker,
  public cropserviceapi:CropapiService,
  private toaster: ToastsManager,
  public logging:LoggingService,
  public loanapi:LoanApiService,
  public alertify:AlertifyService,
  public dialog: MatDialog
  ) {

    this.refdata = this.localstorageservice.retrieve(environment.referencedatakey);
    this.localloanobject = this.localstorageservice.retrieve(environment.loankey);
    this.cropYear = this.localstorageservice.retrieve(environment.loankey).LoanMaster[0].Crop_Year;

    for(let i=1; i<8;i++){
      this.years.push(this.cropYear-i);
    };

    this.components = { numericCellEditor: getNumericCellEditor() };
    this.frameworkcomponents = {selectEditor: SelectEditor, deletecolumn: DeleteButtonRenderer};

    this.defaultColDef = {
      headerComponentParams : {
      template:
          '<div class="ag-cell-label-container" role="presentation">' +
          '  <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>' +
          '  <div ref="eLabel" class="ag-header-cell-label" role="presentation">' +
          '    <span ref="eSortOrder" class="ag-header-icon ag-sort-order" ></span>' +
          '    <span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon" ></span>' +
          '    <span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon" ></span>' +
          '    <span ref="eSortNone" class="ag-header-icon ag-sort-none-icon" ></span>' +
          '    <div ref="eText" class="ag-header-cell-text" role="columnheader"> </div>' +
          '    <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>' +
          '  </div>' +
          '</div>'
      }
    };
    this.columnDefs = [
      {
        headerName: 'Crop', field: 'Crop', editable: false, cellEditor: "selectEditor",width:140,
        cellEditorParams: {
          values: extractCropValues(this.refdata.CropList)
        },
        valueFormatter: function (params) {
          return params.value;
        },
        valueSetter: cropNameValueSetter
      },
      // {
      //   headerName: 'Crop type', field: 'CropType',  editable: false,
      //   // valueFormatter: function (params) {return params.value;},
      //   // valueSetter: CropTypevaluesetter,
      //   width: 100
      // },
      { headerName: 'Crop Practice', field: 'Practice', editable: false, cellEditor: "selectEditor",
        cellEditorParams: {
          values: [{'key': 'IRR','value':'IRR'},{'key':'NIR','value':'NIR'}]
        },
      },
      // { headerName: 'Practice', field: 'Practice',   editable: false,width: 100, cellEditor: "selectEditor",
      //   cellEditorParams: {
      //     values: [{'key': 'IRR','value':'IRR'},{'key':'NIR','value':'NIR'}]
      //   },
      // }
    ];

    this.years.forEach(element => {
     this.columnDefs.push({ headerName: element.toString(), field: element.toString(), cellClass: 'editable-color',  editable: true, cellEditor: "numericCellEditor", valueSetter: numberValueSetter})
    });

    this.columnDefs.push({ headerName: 'Crop Yield', field: 'CropYield',   editable: false});
    this.columnDefs.push({ headerName: 'APH', field: 'APH',   editable: false});
    this.columnDefs.push({ headerName: 'Units', field: 'Bu',   editable: false});
    this.columnDefs.push({  headerName: '', field: 'value',  cellRenderer: "deletecolumn"});

    this.context = { componentParent: this };
  }

  ngOnInit() {
    this.localstorageservice.observe(environment.loankey).subscribe(res=>{
      this.logging.checkandcreatelog(1,'CropYield',"LocalStorage updated");
      debugger
      if (res.srccomponentedit == "YieldComponent") {
        //if the same table invoked the change .. change only the edited row
        this.localloanobject = res;
        this.rowData[res.lasteditrowindex] = this.localloanobject.CropYield.filter(p => p.ActionStatus != 3)[res.lasteditrowindex];
        debugger
        let rownode=this.gridApi.getrowNode("aa");
        this.gridApi.refreshCells();
      }
      else {
        this.localloanobject = res;
        this.rowData=res.CropYield.filter(cy=>{return cy.ActionStatus != 3});;
        this.gridApi.refreshCells();
      }
      this.getgridheight();
    });
    this.getdataforgrid();
  }

  getdataforgrid(){
    let obj:any=this.localstorageservice.retrieve(environment.loankey);
    this.logging.checkandcreatelog(1,'CropYield',"LocalStorage retrieved");
    if(obj!=null && obj!=undefined)
    {
      this.localloanobject=obj;
      this.rowData=obj.CropYield.filter(cy=>{return cy.ActionStatus != 3});
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.getgridheight();
  }

  rowvaluechanged(value:any){
    var obj = value.data;
    var rowindex = value.rowIndex;

    if(obj.ActionStatus === 0){
      this.localloanobject.CropYield[rowindex]=obj;
      if(obj.Crop && obj.CropType && obj.Practice){
        this.addAction = true;
      }else{
        this.addAction = false;
      }
    }else{
        // obj.ActionStatus = 2;
        this.localloanobject.CropYield[rowindex]=obj;
        let edit = new Loan_Crop_Type_Practice_Type_Yield_EditModel();
            edit.CropId = value.data.Crop_ID;
            edit.YieldLine = value.colDef.field;
            edit.IsPropertyYear = true;
            edit.LoanFullID = value.data.Loan_Full_ID;
            edit.PropertyName = value.colDef.field;
            edit.PropertyValue = value.value;
        this.edits.push(edit);
        console.log('edits',this.edits);
      }
    this.localloanobject.srccomponentedit = "YieldComponent";
    this.localloanobject.lasteditrowindex = value.rowIndex;
    this.loanserviceworker.performcalculationonloanobject(this.localloanobject);
  }

  syncenabled(){
    return this.edits.length>0 || this.deleteAction || this.addAction
  }

  synctoDb() {
    console.log('edits',this.edits);
    if(this.deleteAction){
      this.loanapi.syncloanobject(this.localloanobject).subscribe(res=>{
        this.loanapi.getLoanById(this.localloanobject.Loan_Full_ID).subscribe(res => {
          this.logging.checkandcreatelog(3,'Overview',"APi LOAN GET with Response "+res.ResCode);
          if (res.ResCode == 1) {
            this.deleteAction = false;
            this.toaster.success("Records Synced");
            let jsonConvert: JsonConvert = new JsonConvert();
            this.loanserviceworker.performcalculationonloanobject(jsonConvert.deserialize(res.Data, loan_model));
          }
          else{
            this.toaster.error("Could not fetch Loan Object from API")
          }
          this.edits=[];
        })
      })
    }else if(this.addAction){
        let newYield = this.localloanobject.CropYield.filter(cy =>{ return cy.ActionStatus==0});
        newYield.forEach(ay => {
          this.years.forEach(y=>{
            if(ay[y] !== "" && ay[y] !== null){
              var params = {
                Loan_ID : 0,
                Loan_Full_ID: ay.Loan_Full_ID,
                Crop_ID : ay.Crop_ID,
                Z_Crop_Name: ay.Crop,
                Loan_Seq_Num: 0,
                Z_Crop_Type_Code: 'NA',
                Z_Practice_Type_Code: ay.Practice,
                Crop_Year: this.cropYear,
                Yield_Line: y,
                Crop_Yield: ay[y],
                Status:0,
                ActionStatus: 1
              }
              this.localloanobject.CropYield.push(params);
            }
          });
        });
        this.loanapi.syncloanobject(this.localloanobject).subscribe(res=>{
          this.loanapi.getLoanById(this.localloanobject.Loan_Full_ID).subscribe(res => {
            this.logging.checkandcreatelog(3,'Overview',"APi LOAN GET with Response "+res.ResCode);
            if (res.ResCode == 1) {
              this.deleteAction = false;
              this.toaster.success("Records Synced");
              let jsonConvert: JsonConvert = new JsonConvert();
              this.loanserviceworker.performcalculationonloanobject(jsonConvert.deserialize(res.Data, loan_model));
            }
            else{
              this.toaster.error("Could not fetch Loan Object from API")
            }
            this.edits=[];
          })
        })
        this.addAction = false;
  }else{
      this.edits.forEach(element => {
        this.cropserviceapi.saveupdateLoanCropYield(element).subscribe(res=>{
          this.loanapi.getLoanById(this.localloanobject.Loan_Full_ID).subscribe(res => {
            this.logging.checkandcreatelog(3,'Overview',"APi LOAN GET with Response "+res.ResCode);
            if (res.ResCode == 1) {
              this.deleteAction = false;
              this.toaster.success("Records Synced");
              let jsonConvert: JsonConvert = new JsonConvert();
              this.loanserviceworker.performcalculationonloanobject(jsonConvert.deserialize(res.Data, loan_model));
            }
            else{
              this.toaster.error("Could not fetch Loan Object from API")
            }
            this.edits=[];
          })
        });
      });
      this.edits=[];
    }
  }

  DeleteClicked(rowIndex: any) {
    this.alertify.confirm("Confirm", "Do you Really Want to Delete this Record?").subscribe(res => {
      if (res == true) {
        var obj = this.rowData[rowIndex];
        if (obj.ActionStatus == 1) {
          this.rowData.splice(rowIndex, 1);
          this.localloanobject.CropYield.splice(this.localloanobject.LoanCollateral.indexOf(obj), 1);
        }else {
          this.deleteAction = true;
          obj.ActionStatus = 3;
        }
        this.loanserviceworker.performcalculationonloanobject(this.localloanobject);
      }
    })
  }

  addrow() {
    let distinctCrops = [];
    let cropLists = []

    this.rowData.forEach(rd =>{
      if(distinctCrops.indexOf(rd.Crop)== -1)
      distinctCrops.push(rd.Crop_ID);
    });

    this.refdata.CropList.forEach(cl => {
      if(distinctCrops.indexOf(cl.Crop_And_Practice_ID) == -1){
        distinctCrops.push(cl.Crop_And_Practice_ID);
        cropLists.push(cl);
      }
    });

    const dialogRef = this.dialog.open(YieldDialogComponent, {
      width: '250px',
      data: {crops:cropLists,
             selected:{crop:'', practice:''}}
    });

    dialogRef.afterClosed().subscribe(result => {
      cropLists = []
      if(result != undefined){
        var newItem = { Crop_ID:result.crop.Crop_And_Practice_ID,
                        Crop:result.crop.Crop_Name,
                        CropType: result.crop.Crop_Code,
                        Loan_ID:"",
                        Loan_Full_ID: this.localloanobject.Loan_Full_ID,
                        IrNI:result.crop.Practice_type_code,
                        Practice:result.crop.Practice_type_code,
                        CropYield:"",
                        APH:"",
                        InsUOM:"",
                        ActionStatus: 0 }
        this.years.forEach(y=>{ newItem[y]=""; })
        this.rowData.push(newItem);
        this.localloanobject.CropYield.push(newItem);
        this.gridApi.setRowData(this.rowData);

        this.getgridheight();
        }
    });

  }

  getgridheight() {

    this.style.height = (30 * (this.rowData.length + 1)+9).toString() + "px";
  }
  onGridSizeChanged(Event: any) {

    try{
    this.gridApi.sizeColumnsToFit();
  }
  catch{

  }
  }
}
function adjustheader(): void {

  document.getElementsByClassName("ag-header-cell-label")[0].setAttribute("style","width:100%")
}


@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'yield.dialog.component.html',
})
export class YieldDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<YieldDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

