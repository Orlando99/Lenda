import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { loan_model } from '../../../models/loanmodel';
import { numberValueSetter, getNumericCellEditor } from '../../../Workers/utility/aggrid/numericboxes';
import { environment } from '../../../../environments/environment.prod';
import { Loan_Crop_Unit } from '../../../models/cropmodel';
import { LoancalculationWorker } from '../../../Workers/calculations/loancalculationworker';
import { LoanApiService } from '../../../services/loan/loanapi.service';
import { ToastsManager } from 'ng2-toastr';
import { JsonConvert } from 'json2typescript';

@Component({
  selector: 'app-aph',
  templateUrl: './aph.component.html',
  styleUrls: ['./aph.component.scss']
})
export class AphComponent implements OnInit {

  public columnDefs = [];
  public rowData = [];
  private localloanobject: loan_model;
  public components;
  private gridApi;
  private columnApi;
  public refdata: any = {};
  
  constructor(private localstorageservice: LocalStorageService,
  private loanserviceworker : LoancalculationWorker,
  public loanapi:LoanApiService,
  private toaster: ToastsManager,) {

    this.components = { numericCellEditor: getNumericCellEditor() };
    this.refdata = this.localstorageservice.retrieve(environment.referencedatakey);
    this.columnDefs = [
      {
        headerName: 'State | County', field: 'Farm_ID',
        valueFormatter: (params) => {
          let matchedFarm = this.localloanobject.Farms.find(f=>f.Farm_ID == params.data.Farm_ID);
          if(matchedFarm){
            let state = this.refdata.StateList.find(sl=>sl.State_ID == matchedFarm.Farm_State_ID);
            let county = this.refdata.CountyList.find(sl=>sl.County_ID == matchedFarm.Farm_County_ID);
            return (state ? state.State_Abbrev : '') +" | "+ (county ? county.County_Name : '');
          }
          return '';
        },

        width: 150
      },
      {
        headerName: 'Crop', field: 'Crop_Code',
        valueFormatter: (params) => {
          let matchedCrop = this.refdata.Crops.find(crp=>crp.Crop_Code == params.data.Crop_Code);
          return matchedCrop ? matchedCrop.Crop_Name || '' : '';
        },
      },
      {
        headerName: 'Practice', field: 'Crop_Practice_Type_Code',
       
        width: 70
      },
      {
        headerName: 'FSN', field: 'Farm_ID',
        valueFormatter: (params) => {
          let matchedFarm = this.localloanobject.Farms.find(f=>f.Farm_ID == params.data.Farm_ID);
          return matchedFarm ? matchedFarm.FSN || '' : '';
        },

        width: 70
      },
      {
        headerName: 'APH', field: 'Ins_APH', editable: true, cellEditor: "numericCellEditor", cellClass: ['editable-color', 'text-right'],
        cellEditorParams: (params)=> {
          return { value : params.data.Ins_APH || 0}
        },
        valueSetter: numberValueSetter,

      },
      {
        headerName: 'UoM', field: 'UoM',
        valueFormatter: function (params) {
          return 'bu';
        },

        width: 70
      }
    ];

  }

  ngOnInit() {

    this.localstorageservice.observe(environment.loankey).subscribe(res => {
      if (res != null) {
        this.localloanobject = res;
        if (this.localloanobject.LoanCropUnits && this.localloanobject.srccomponentedit == "APH") {
          this.rowData[res.lasteditrowindex] = this.localloanobject.LoanCropUnits.filter(p => p.ActionStatus != 3)[res.lasteditrowindex];
          this.localloanobject.srccomponentedit = undefined;
          this.localloanobject.lasteditrowindex = undefined;
        }
        else if (this.localloanobject && this.localloanobject.LoanCropUnits) {

          this.rowData = this.localloanobject.LoanCropUnits.filter(p => p.ActionStatus != 3);
        } else {
          this.rowData = [];
        }
      }
    });

    this.localloanobject = this.localstorageservice.retrieve(environment.loankey);
    if (this.localloanobject && this.localloanobject.LoanCropUnits) {
      this.rowData = this.localloanobject.LoanCropUnits.filter(p => p.ActionStatus != 3);
    }
  }

  syncenabled(){
    if(this.localloanobject && this.localloanobject.LoanCropUnits.length>0){
      return this.localloanobject.LoanCropUnits.filter(p=>p.ActionStatus).length>0;
    }else{
      return false;
    }
  }

  synctoDb(){
    
      this.loanapi.syncloanobject(this.localloanobject).subscribe(res=>{
        if(res.ResCode == 1){
          this.loanapi.getLoanById(this.localloanobject.Loan_Full_ID).subscribe(res => {
           
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
      });
    
  }

  rowvaluechanged(value : any){
    
    var obj : Loan_Crop_Unit = value.data;
    if(obj && obj.Loan_CU_ID){

      var edittedCUIndex =this.localloanobject.LoanCropUnits.findIndex(cu=>cu.Loan_CU_ID==obj.Loan_CU_ID);
      let edittedCU = this.localloanobject.LoanCropUnits[edittedCUIndex];
      if(edittedCU){
        edittedCU.ActionStatus = 2;
      }
    }
    
    this.localloanobject.srccomponentedit = "APH";
    this.localloanobject.lasteditrowindex =edittedCUIndex;
    this.loanserviceworker.performcalculationonloanobject(this.localloanobject);
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    params.api.sizeColumnsToFit();//autoresizing
  }



}
