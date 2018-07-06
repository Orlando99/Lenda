import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { environment } from '../../../environments/environment';
import { loan_model } from '../../models/loanmodel';
import * as _ from "lodash";
@Component({
  selector: 'app-optimizer',
  templateUrl: './optimizer.component.html',
  styleUrls: ['./optimizer.component.scss']
})
export class OptimizerComponent implements OnInit {

  //Properties
  private gridApi;
  private columnApi;
  rowData=[];
  style = {
    marginTop: '10px',
    width: '97%',
    height: '240px',
    boxSizing: 'border-box'
  };
  defaultColDef = {
    enableValue: true,
    enableRowGroup: true,
    enablePivot: true,
    allowedAggFuncs: ["sum", "min", "max"]
  };
  columnDefs = [
    { headerName: 'FarmNumber', field: 'Farm_ID',hide:true,rowGroup: true},
    { headerName: 'Irr/NI', field: 'Practice',  editable: false },
    { headerName: 'State', field: 'State',  editable: false},
    { headerName: 'County', field: 'County', editable: false},
    { headerName: '% Prod.', field: 'Prodpercentage', editable: false},
    { headerName: 'Landlord', field: 'Landlord',  editable: false},
    { headerName: 'FSN', field: 'FSN',  editable: false },
    { headerName: 'Crop', field: 'Crop',  editable: false  },
    { headerName: 'Practice', field: 'Practice',  editable: false},
    { headerName: 'CF', field: 'CF',  editable: false },
    { headerName: 'RC', field: 'RC',  editable: false},
    { headerName: 'Excess ins', field: 'ExcessIns',  editable: false},
    { headerName: 'Acres', field: 'Acres',  editable: true,aggFunc: "sum"},

  ];
  //
  constructor(private localstorage:LocalStorageService) { }

  ngOnInit() {
    this.getgriddata();
  }

  //Grid Functions
  getgriddata(){
       //Get localstorage first
       let loanmodel:loan_model=this.localstorage.retrieve(environment.loankey);
       if(loanmodel!=null){
         //Start making Rows here
         loanmodel.Farms.forEach(farm => {
               //get distinct crops for the farm
              let distinctrows= _.uniqBy(loanmodel.LoanCropUnits.filter(p=>p.Farm_ID==farm.Farm_ID),v=>[v.Crop_Code].join());
              distinctrows.forEach(crop => {
                let row:any={};
                row.Farm_ID=farm.Farm_ID;
                row.Practice="Irr";
                row.State=farm.Farm_State_ID;
                row.County=farm.Farm_County_ID;
                row.Prodpercentage="80%";
                row.Landlord=farm.Landowner;
                row.FSN=farm.FSN;
                row.Crop=crop.Crop_Code;
                row.CF="";
                row.RC="";
                row.ExcessIns="";
                let cropselected=distinctrows.find(p=>p.Crop_Code==crop.Crop_Code && p.Crop_Practice_Type_Code=="Irr");
                row.Acres=(cropselected==undefined)?5:cropselected.CU_Acres;
                this.rowData.push(row);
              });
              let row:any={};
              
         });
         //End rows here
       }

  }

  syncenabled(){
    return false;
  }

  synctoDb(){

  }
  
  rowvaluechanged($event){
    this.gridApi.refreshClientSideRowModel('aggregate')
  }

  onGridReady(params){
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
  }
  //Grid Functions End
}
