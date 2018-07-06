import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { environment } from '../../../environments/environment';
import { loan_model } from '../../models/loanmodel';
import * as _ from "lodash";
import { lookupCountyValue, lookupStateValue, lookupStateRefValue } from '../../Workers/utility/aggrid/stateandcountyboxes';
import { LoancalculationWorker } from '../../Workers/calculations/loancalculationworker';
@Component({
  selector: 'app-optimizer',
  templateUrl: './optimizer.component.html',
  styleUrls: ['./optimizer.component.scss']
})
export class OptimizerComponent implements OnInit {

  //Properties
  private gridApi;
  private columnApi;
  rowData = [];
  private rowClassRules;
  defaultColDef = {
    cellClass: function(params) {
      if(params.data.ID==undefined){
        return "aggregatecol";
      }
    }
  };
  style = {
    marginTop: '10px',
    width: '97%',
    height: '240px',
    boxSizing: 'border-box'
  };
  public loanmodel:loan_model;
  columnDefs = [
    { headerName: 'CropunitRecord', field: 'ID', hide: true },
    { headerName: 'Irr/NI', field: 'Practice', editable: false },
    { headerName: 'State', field: 'State', editable: false,
    valueFormatter: function (params) {
      return lookupStateRefValue(params.value);
    } },
    { headerName: 'County', field: 'County', valueFormatter: function (params) {
      return lookupCountyValue(params.value);
    },editable: false },
    { headerName: '% Prod.', field: 'Prodpercentage', editable: false },
    { headerName: 'Landlord', field: 'Landlord', editable: false },
    { headerName: 'FSN', field: 'FSN', editable: false },
    { headerName: 'Crop', field: 'Crop', editable: false },
    { headerName: 'Practice', field: 'Practice', editable: false },
    { headerName: 'CF', field: 'CF', editable: false },
    { headerName: 'RC', field: 'RC', editable: false },
    { headerName: 'Excess ins', field: 'ExcessIns', editable: false },
    { headerName: 'Acres', field: 'Acres', editable: true },

  ];
  //
  constructor(
    private localstorage: LocalStorageService,
    private loancalculationservice:LoancalculationWorker
  ) {
   // change row class contextually here
    this.rowClassRules = {
      "aggregaterow": function(params) {
      return params.data.ID==undefined
      }
    };
   // storage observer
   this.localstorage.observe(environment.loankey).subscribe(res=>{
    this.loanmodel=res;
     this.getgriddata();
   })
   }

  ngOnInit() {
      this.loanmodel= this.localstorage.retrieve(environment.loankey);
    this.getgriddata();
  }

  //Grid Functions
  getgriddata() {
    //Get localstorage first
    this.rowData=[];
    if ( this.loanmodel != null) {
      //Start making Rows here for IRR
      this.loanmodel.Farms.forEach(farm => {
        //get distinct crops for the farm
        
        let distinctrows =  this.loanmodel.LoanCropUnits.filter(p => p.Farm_ID == farm.Farm_ID && p.Crop_Practice_Type_Code == "IRR");
        distinctrows.forEach(crop => {
          let row: any = {};
          row.ID = crop.Loan_CU_ID;
          row.Practice = "IRR";
          row.State = farm.Farm_State_ID;
          row.County = farm.Farm_County_ID;
          row.Prodpercentage = "80%";
          row.Landlord = farm.Landowner;
          row.FSN = farm.FSN;
          row.Crop = crop.Crop_Code;
          row.CF = "";
          row.RC = "";
          row.ExcessIns = "";
          row.Acres = crop.CU_Acres
          this.rowData.push(row);
        });
        if (distinctrows.length > 0) {
          let row: any = {};
          row.Acres = _.sumBy(distinctrows, function (o) { return o.CU_Acres; })
          this.rowData.push(row);
        }
      });

      //NIR
      this.loanmodel.Farms.forEach(farm => {
        //get distinct crops for the farm
        
        let distinctrows =  this.loanmodel.LoanCropUnits.filter(p => p.Farm_ID == farm.Farm_ID && p.Crop_Practice_Type_Code == "NIR");
        distinctrows.forEach(crop => {
          let row: any = {};
          row.ID = crop.Loan_CU_ID;
          row.Practice = "NIR";
          row.State = farm.Farm_State_ID;
          row.County = farm.Farm_County_ID;
          row.Prodpercentage = "80%";
          row.Landlord = farm.Landowner;
          row.FSN = farm.FSN;
          row.Crop = crop.Crop_Code;
          row.CF = "";
          row.RC = "";
          row.ExcessIns = "";
          row.Acres = crop.CU_Acres
          this.rowData.push(row);
        });
        if (distinctrows.length > 0) {
          let row: any = {};
          row.Acres = _.sumBy(distinctrows, function (o) { return o.CU_Acres; })
          this.rowData.push(row);
        }
      });
      //End rows here
    }

  }

  syncenabled() {
    return false;
  }

  synctoDb() {

  }

  rowvaluechanged($event) {
    
     this.loanmodel.LoanCropUnits.find(p=>p.Loan_CU_ID==$event.data.ID).CU_Acres=parseInt($event.value);
     this.loancalculationservice.performcalculationonloanobject(this.loanmodel,false);
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
  }
  //Grid Functions End
}
