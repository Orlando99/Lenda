import { Component, OnInit } from '@angular/core';
import { loan_model } from '../../../models/loanmodel';
import { LocalStorageService } from 'ngx-webstorage';
import { LoancalculationWorker } from '../../../Workers/calculations/loancalculationworker';
import { ToastsManager } from 'ng2-toastr';
import { LoggingService } from '../../../services/Logs/logging.service';
import { environment } from '../../../../environments/environment';
import { modelparserfordb } from '../../../Workers/utility/modelparserfordb';
import { Loan_Crop_Type_Practice_Type_Yield_EditModel, Loan_Crop_Type_Practice_Type_Yield_AddModel } from '../../../models/cropmodel';
import { CropapiService } from '../../../services/crop/cropapi.service';
import { getNumericCellEditor, numberValueSetter } from '../../../Workers/utility/aggrid/numericboxes';
import { lookupCropValue, Cropvaluesetter, lookupCropTypeValue, CropTypevaluesetter, extractCropValues, lookupCropValuewithoutmapping } from '../../../Workers/utility/aggrid/cropboxes';
import { LoanApiService } from '../../../services/loan/loanapi.service';
import { JsonConvert } from 'json2typescript';
import { DeleteButtonRenderer } from '../../../aggridcolumns/deletebuttoncolumn';
import { AlertifyService } from '../../../alertify/alertify.service';
import { tick } from '@angular/core/testing';

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
  
  context: any;
  
  frameworkcomponents: { deletecolumn: typeof DeleteButtonRenderer; };
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
  public alertify:AlertifyService
  ) { 

    this.refdata = this.localstorageservice.retrieve(environment.referencedatakey);
    this.localloanobject = this.localstorageservice.retrieve(environment.loankey);
    let cropYear = this.localstorageservice.retrieve(environment.loankey).LoanMaster[0].Crop_Year;

    for(let i=1; i<7;i++){
      this.years.push(cropYear-i);
    };

    this.components = { numericCellEditor: getNumericCellEditor() };
    this.frameworkcomponents = {deletecolumn: DeleteButtonRenderer };
    
    this.columnDefs = [
      {
        headerName: 'Crop', field: 'CropType',
        valueFormatter: function (params) { return lookupCropValuewithoutmapping( params.value);},
        valueSetter: Cropvaluesetter
      },
      {
        headerName: 'Crop type', field: 'Crop_Type_Code',
        valueFormatter: function (params) {return lookupCropTypeValue(params.value);},
        valueSetter: CropTypevaluesetter
      },
      { headerName: 'Crop Practice', field: 'IrNI',  editable: false},
      { headerName: 'Practice', field: 'Practice',   editable: false}
    ];

    this.years.forEach(element => {
     this.columnDefs.push({ headerName: element.toString(), field: element.toString(),   editable: true, cellEditor: "numericCellEditor", valueSetter: numberValueSetter})
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
      this.localloanobject=res;
      this.rowData=res.CropYield;
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
      this.rowData=obj.CropYield;
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
    obj.ActionStatus = 2;
    this.localloanobject.CropYield[rowindex]=obj;
    let edit = new Loan_Crop_Type_Practice_Type_Yield_EditModel();
        edit.CropId = value.data.Crop_ID;
        edit.YieldLine = value.colDef.field;
        edit.IsPropertyYear = true;
        edit.LoanID = value.data.Loan_ID;
        edit.PropertyName = value.colDef.field;
        edit.PropertyValue = value.value;
    this.edits.push(edit);
    this.loanserviceworker.performcalculationonloanobject(this.localloanobject);
  }

  syncenabled(){
    return this.edits.length>0
  }

  synctoDb() {
    this.edits.forEach(element => {
      this.cropserviceapi.saveupdateLoanCropYield(element).subscribe(res=>{
      });
    });
   
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
      this.edits=[];
      // else{
      //   this.toaster.error("Error in Sync");
      // }
    })
  }

  getgridheight(){
   this.style.height=(28*(this.rowData.length+2)).toString()+"px";
  }


  DeleteClicked(rowIndex: any) {
    // this.alertify.confirm("Confirm", "Do you Really Want to Delete this Record?").subscribe(res => {
    //   console.log(res)
    //   if (res == true) {
    //     var obj = this.localloanobject.CropYield[rowIndex];
    //     obj.ActionStatus = 3;
    //     console.log('Object',obj);
    //     this.loanapi.syncloanobject(this.localloanobject).subscribe(res=>{
    //         console.log(res);
    //     });
        
    //     this.loanapi.getLoanById(this.localloanobject.Loan_Full_ID).subscribe(res => {
      
    //       this.logging.checkandcreatelog(3,'Overview',"APi LOAN GET with Response "+res.ResCode);
    //       if (res.ResCode == 1) {
    //         this.toaster.success("Records Synced");
    //         let jsonConvert: JsonConvert = new JsonConvert();
    //         this.loanserviceworker.performcalculationonloanobject(jsonConvert.deserialize(res.Data, loan_model));
    //       }
    //       else{
    //         this.toaster.error("Could not fetch Loan Object from API")
    //       }
    //     })
    //   }
    // })

    this.alertify.confirm("Confirm", "Do you Really Want to Delete this Record?").subscribe(res => {
      if (res == true) {
        var obj = this.localloanobject.CropYield[rowIndex];
        console.log(obj);
        if (obj.Loan_ID == 0) {
          this.localloanobject.CropYield.splice(rowIndex, 1);
        }
        else {
          console.log("test");
          this.localloanobject.CropYield.splice(rowIndex, 1);
          this.rowData = this.localloanobject.CropYield;
          console.log(this.rowData);
          obj.ActionStatus = 3;
        }
        this.loanserviceworker.performcalculationonloanobject(this.localloanobject);
      }
    })
  
  }
}
