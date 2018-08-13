import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { loan_model } from '../../../models/loanmodel';
import { LocalStorageService } from 'ngx-webstorage';
import { LoancalculationWorker } from '../../../Workers/calculations/loancalculationworker';
import { ToastsManager } from 'ng2-toastr';
import { LoggingService } from '../../../services/Logs/logging.service';
import { environment } from '../../../../environments/environment.prod';
import { modelparserfordb } from '../../../Workers/utility/modelparserfordb';
import { Loan_Crop_Type_Practice_Type_Yield_EditModel, Loan_Crop_Type_Practice_Type_Yield_AddModel } from '../../../models/cropmodel';
import { CropapiService } from '../../../services/crop/cropapi.service';
import { getNumericCellEditor, yieldValueSetter } from '../../../Workers/utility/aggrid/numericboxes';
import { lookupCropValue, Cropvaluesetter, lookupCropTypeValue, CropTypevaluesetter, extractCropValues, lookupCropValuewithoutmapping, cropNameValueSetter, APHRoundValueSetter } from '../../../Workers/utility/aggrid/cropboxes';
import { LoanApiService } from '../../../services/loan/loanapi.service';
import { JsonConvert } from 'json2typescript';
import { DeleteButtonRenderer } from '../../../aggridcolumns/deletebuttoncolumn';
import { AlertifyService } from '../../../alertify/alertify.service';
import { tick } from '@angular/core/testing';
import { SelectEditor } from '../../../aggridfilters/selectbox';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { empty } from 'rxjs/observable/empty';
import { status } from '../../../models/syncstatusmodel';
import { NO_CHANGE } from '@angular/core/src/render3/instructions';
import { Observable } from 'rxjs';
import { setgriddefaults } from '../../../aggriddefinations/aggridoptions';
import { Page, PublishService } from '../../../services/publish.service';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-yield',
  templateUrl: './yield.component.html',
  styleUrls: ['./yield.component.scss'],
  encapsulation: ViewEncapsulation.None
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

  public cropYear;
  context: any;
  public syncYieldStatus : status = 0;

  frameworkcomponents;
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


  constructor(public localstorageservice:LocalStorageService,
  public loanserviceworker:LoancalculationWorker,
  public cropserviceapi:CropapiService,
  private toaster: ToastsManager,
  public logging:LoggingService,
  public loanapi:LoanApiService,
  public alertify:AlertifyService,
  public dialog: MatDialog,
  private publishService : PublishService
  ) {

    this.refdata = this.localstorageservice.retrieve(environment.referencedatakey);
    this.localloanobject = this.localstorageservice.retrieve(environment.loankey);
    this.cropYear = this.localstorageservice.retrieve(environment.loankey) != null ? this.localstorageservice.retrieve(environment.loankey).LoanMaster[0].Crop_Year : 0;

    for(let i=1; i<8;i++){
      this.years.push(this.cropYear-i);
    };

    this.components = { numericCellEditor: getNumericCellEditor() };
    this.frameworkcomponents = {selectEditor: SelectEditor, deletecolumn: DeleteButtonRenderer};

    this.columnDefs = [
      {
        headerName: 'Crop', field: 'Crop', editable: false, cellEditor: "selectEditor",
        cellEditorParams: {
          values: extractCropValues(this.refdata.CropList)
        },
        valueFormatter: function (params) {
          return params.value;
        },
        valueSetter: cropNameValueSetter
      },
      { headerName: 'Crop Practice', field: 'Practice', editable: false}
    ];

    this.years.forEach(element => {
     this.columnDefs.push({ headerName: element.toString(), field: element.toString(), cellClass: 'editable-color',  editable: true, cellEditor: "numericCellEditor", valueSetter: yieldValueSetter,cellStyle: { textAlign: "right" }})
    });

    this.columnDefs.push({ headerName: 'Crop Yield', field: 'CropYield',   editable: false, cellStyle: { textAlign: "right" }});
    this.columnDefs.push({ headerName: 'APH', field: 'APH',   editable: false, cellClass: 'text-right',valueFormatter: APHRoundValueSetter });
    this.columnDefs.push({ headerName: 'Units', field: 'Bu',   editable: false});
    this.columnDefs.push({  headerName: '', field: 'value',  cellRenderer: "deletecolumn", width: 120});

    this.context = { componentParent: this };
  }

  ngOnInit() {
    this.localstorageservice.observe(environment.loankey).subscribe(res=>{
     // this.logging.checkandcreatelog(1,'CropYield',"LocalStorage updated");
      if (res.srccomponentedit == "YieldComponent") {
        //if the same table invoked the change .. change only the edited row
        this.localloanobject = res;
        this.rowData[res.lasteditrowindex] = this.localloanobject.CropYield.filter(p => p.ActionStatus != 3)[res.lasteditrowindex];
        this.gridApi.refreshCells();
      }
      else {
        this.localloanobject = res;
        this.rowData=res.CropYield.filter(cy=>{return cy.ActionStatus != 3});;
        this.gridApi.refreshCells();
      }
      this.getgridheight();
      this.gridApi.refreshCells();
    });
    
    //this.getdataforgrid();
  }

  getdataforgrid(){
    let obj:any=this.localstorageservice.retrieve(environment.loankey);
    // this.logging.checkandcreatelog(1,'CropYield',"LocalStorage retrieved");
    if(obj!=null && obj!=undefined)
    {
      this.localloanobject=obj;
      this.rowData=obj.CropYield.filter(cy=>{return cy.ActionStatus != 3});
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    params.api.sizeColumnsToFit();
    this.getdataforgrid();
  }

  rowvaluechanged(value:any){
    var obj = value.data;
    var rowindex = value.rowIndex;
    if (obj.ActionStatus  == 0) {
      obj.ActionStatus = 1;
      this.localloanobject.CropYield[rowindex]=value.data;
    }
    else {
      if(obj.ActionStatus!=1)
        obj.ActionStatus = 2;
      this.localloanobject.CropYield[rowindex]=obj;
    }
    this.localloanobject.srccomponentedit = "YieldComponent";
    this.localloanobject.lasteditrowindex = value.rowIndex;
  
    this.loanserviceworker.performcalculationonloanobject(this.localloanobject);
    this.publishService.enableSync(Page.crop);
  }

  // synctoDb() {
  //   this.loanapi.syncloanobject(this.localloanobject).subscribe(res=>{
  //       if(res.ResCode == 1){
  //         this.deleteAction = false;
  //         this.loanapi.getLoanById(this.localloanobject.Loan_Full_ID).subscribe(res => {
  //           this.logging.checkandcreatelog(3,'Overview',"APi LOAN GET with Response "+res.ResCode);
  //           if (res.ResCode == 1) {
  //             this.toaster.success("Records Synced");
  //             let jsonConvert: JsonConvert = new JsonConvert();
  //             this.loanserviceworker.performcalculationonloanobject(jsonConvert.deserialize(res.Data, loan_model));
  //           }
  //           else{
  //             this.toaster.error("Could not fetch Loan Object from API")
  //           }
  //         });
  //       }
  //       else{
  //         this.toaster.error("Error in Sync");
  //       }
  //   });
  // }

  addrow() {
    let distinctCrops = [];
    let cropLists = []

    this.rowData.forEach(rd =>{
      if(distinctCrops.indexOf(rd.Crop)== -1)
      distinctCrops.push(rd.Crop);
    });

    this.refdata.CropList.forEach(cl => {
      if(distinctCrops.indexOf(cl.Crop_Name) == -1){
        distinctCrops.push(cl.Crop_Name);
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
        var cropIRR = this.refdata.CropList.find(crp => { return crp.Crop_Name == result.crop.Crop_Name && crp.Practice_type_code == 'IRR' });
        var newIRR = { Crop_ID:cropIRR.Crop_And_Practice_ID,
                        Crop:cropIRR.Crop_Name,
                        CropType:cropIRR.Crop_Code,
                        Loan_ID:"",
                        Loan_Full_ID: this.localloanobject.Loan_Full_ID,
                        IrNI:"IRR",
                        Practice:"IRR",
                        CropYield:"",
                        APH:"",
                        InsUOM:"",
                        ActionStatus: 1,
                        CropYear: this.localloanobject.LoanMaster[0].Crop_Year}
        var cropNIR = this.refdata.CropList.find(crp => { return crp.Crop_Name == result.crop.Crop_Name && crp.Practice_type_code == 'NIR' });
        var newNIR = { Crop_ID:cropNIR.Crop_And_Practice_ID,
                        Crop:cropNIR.Crop_Name,
                        CropType: cropNIR.Crop_Code,
                        Loan_ID:"",
                        Loan_Full_ID: this.localloanobject.Loan_Full_ID,
                        IrNI:"NIR",
                        Practice:"NIR",
                        CropYield:"",
                        APH:"",
                        InsUOM:"",
                        ActionStatus: 1,
                        CropYear: this.localloanobject.LoanMaster[0].Crop_Year}
        this.years.forEach(y=> { 
          newIRR[y]=null; 
          newNIR[y] = null; 
        });
        this.rowData.push(newIRR);
        this.rowData.push(newNIR);
        this.localloanobject.CropYield.push(newIRR);
        this.localloanobject.CropYield.push(newNIR);
        this.localloanobject.SyncStatus.Status_Crop_Practice=2;
        this.loanserviceworker.performcalculationonloanobject(this.localloanobject);
        this.gridApi.setRowData(this.rowData);
        
        //this.getgridheight();
        }
    });
    this.publishService.enableSync(Page.crop);
  }

  DeleteClicked(rowIndex: any) {
    this.alertify.confirm("Confirm", "Do you really want to delete both "+ this.rowData[rowIndex].Crop  + " NIR and IRR on this record?").subscribe(
      res => {
        if (res == true) {
          var obj = this.rowData[rowIndex];
          if (obj.ActionStatus == 1) {
            this.localloanobject.CropYield = this.localloanobject.CropYield.filter(lcl => { return lcl.Crop !== obj.Crop;})
          }else {
            this.deleteAction = true;
            this.localloanobject.CropYield.forEach(row =>{
              if(row.Crop === obj.Crop){
                row.ActionStatus = 3
              }
            });
            this.localloanobject.SyncStatus.Status_Crop_Practice=2;
            //obj.ActionStatus = 3;
          }
          this.rowData=this.localloanobject.CropYield.filter(cy=>{return cy.ActionStatus != 3});
          // this.loanserviceworker.performcalculationonloanobject(this.localloanobject);
          this.publishService.enableSync(Page.crop);
        }
    })
  }

  getgridheight(){
    //this.style.height=(29*(this.rowData.length+2)).toString()+"px";
  }

  onGridSizeChanged(params) {
    //params.api.sizeColumnsToFit();
    params.api.resetRowHeights();
  }

  syncenabled() {   
    if(this.rowData.filter(p => p.ActionStatus != undefined).length > 0 || this.deleteAction)
      return '';
    else
      return 'disabled';
  }
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

