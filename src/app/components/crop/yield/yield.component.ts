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
  context: any;
  
  frameworkcomponents: { selectEditor: typeof SelectEditor, deletecolumn: typeof DeleteButtonRenderer; };
  style = {
    marginTop: '10px',
    width: '93%',
    height: '240px',
    boxSizing: 'border-box'
  };

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
    let cropYear = this.localstorageservice.retrieve(environment.loankey).LoanMaster[0].Crop_Year;

    for(let i=1; i<8;i++){
      this.years.push(cropYear-i);
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
        valueSetter: cropNameValueSetter,
        width: 80
      },
      {
        headerName: 'Crop type', field: 'CropType',  editable: false,
        // valueFormatter: function (params) {return params.value;},
        // valueSetter: CropTypevaluesetter,
        width: 100
      },
      { headerName: 'Crop Practice', field: 'IrNI', editable: false,width: 120, cellEditor: "selectEditor",
        cellEditorParams: {
          values: [{'key': 'IRR','value':'IRR'},{'key':'NIR','value':'NIR'}]
        },
      },
      { headerName: 'Practice', field: 'Practice',   editable: false,width: 100, cellEditor: "selectEditor",
        cellEditorParams: {
          values: [{'key': 'IRR','value':'IRR'},{'key':'NIR','value':'NIR'}]
        },
      }
    ];

    this.years.forEach(element => {
     this.columnDefs.push({ headerName: element.toString(), field: element.toString(),   editable: true, cellEditor: "numericCellEditor", valueSetter: numberValueSetter,width: 80})
    });

    this.columnDefs.push({ headerName: 'Crop Yield', field: 'CropYield',   editable: false,width: 120});
    this.columnDefs.push({ headerName: 'APH', field: 'APH',   editable: false,width: 80});
    this.columnDefs.push({ headerName: 'Units', field: 'Bu',   editable: false,width: 80});
    this.columnDefs.push({  headerName: '', field: 'value',  cellRenderer: "deletecolumn",width: 100});
   
    this.context = { componentParent: this };
  }

  ngOnInit() {
    this.localstorageservice.observe(environment.loankey).subscribe(res=>{
      this.logging.checkandcreatelog(1,'CropYield',"LocalStorage updated");
      this.localloanobject=res;
      this.rowData=res.CropYield.filter(cy=>{return cy.ActionStatus != 3});;
      
    })
    this.croppricesdetails= this.localstorageservice.retrieve(environment.referencedatakey);
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

    if(obj.Crop_ID === 0){
      obj.ActionStatus = 1;
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
          edit.LoanID = value.data.Loan_ID;
          edit.PropertyName = value.colDef.field;
          edit.PropertyValue = value.value;
      this.edits.push(edit);
      console.log('EDITS',this.edits);
    }
    
    this.loanserviceworker.performcalculationonloanobject(this.localloanobject);
  }

  syncenabled(){
    return this.edits.length>0 || this.deleteAction || this.addAction
  }

  synctoDb() {
    if(this.deleteAction || this.addAction){
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
          // else{
          //   this.toaster.error("Error in Sync");
          // }
        })
      })
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
            // else{
            //   this.toaster.error("Error in Sync");
            // }
          })
        });
      });
      this.edits=[];
    }
   
    
  }

  getgridheight(){
   this.style.height=(28*(this.rowData.length+2)).toString()+"px";
  }

  DeleteClicked(rowIndex: any) {
    this.alertify.confirm("Confirm", "Do you Really Want to Delete this Record?").subscribe(res => {
      if (res == true) {
        var obj = this.rowData[rowIndex];
        if (obj.Loan_ID == 0) {
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
    let uniqueCrops = [];
    let cropLists = []

    // this.rowData.forEach(rd =>{
    //   if(uniqueCrops.indexOf(rd.Crop)== -1)
    //     uniqueCrops.push(rd.Crop);
    // });

    this.refdata.CropList.forEach(cl => {
      this.rowData.forEach(rd =>{
        
        if(rd.Crop === cl.Crop_Name){
            if(rd.Practice !== cl.Practice_type_code){
              console.log(rd.Crop, rd.Practice , cl.Crop_Name, cl.Practice_type_code)
              cropLists.push(cl);
            }
        }else{
          if(cropLists.indexOf(cl) === (-1)){
            console.log(cropLists.indexOf(cl), rd.Crop, rd.Practice , cl.Crop_Name, cl.Practice_type_code);
            cropLists.push(cl);
          }
        }
      })
        // uniqueCrops.push(cl.Crop_Name);
    });

    const dialogRef = this.dialog.open(YieldDialogComponent, {
      width: '250px',
      data: {crops:cropLists,
             selected:{crop:'', practice:''}}
    });

    dialogRef.afterClosed().subscribe(result => {
      cropLists = []
      if(result != undefined){
        var newItem = { Crop_ID:0,
                        Crop:result.crop.Crop_Name,
                        CropType: result.crop.Crop_Code,
                        Loan_ID:"",
                        IrNI:result.crop.Practice_type_code,
                        Practice:result.crop.Practice_type_code,
                        CropYield:"",
                        APH:"",
                        InsUOM:"",
                        ActionStatus: 1 }
        this.years.forEach(y=>{ newItem[y]=""; })
        this.rowData.push(newItem);
        this.localloanobject.CropYield.push(newItem);
        this.gridApi.setRowData(this.rowData);
        this.gridApi.startEditingCell({
          rowIndex: this.rowData.length,
          colKey: "Crop" 
        });
        this.getgridheight();
        }
    });
    
  }
}



@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'yield.dialog.component.html',
})
export class YieldDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<YieldDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}

