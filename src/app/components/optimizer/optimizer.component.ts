import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { environment } from '../../../environments/environment';
import { loan_model } from '../../models/loanmodel';
import * as _ from "lodash";
import { lookupCountyValue, lookupStateValue, lookupStateRefValue } from '../../Workers/utility/aggrid/stateandcountyboxes';
import { LoancalculationWorker } from '../../Workers/calculations/loancalculationworker';
@Component({
  selector: 'app-optimizer',
  templateUrl: './optimizer.component.html'
})
export class OptimizerComponent implements OnInit {

  //Properties
  private gridApi;
  private columnApi;
  rowData = [];
  public context;
  private rowClassRules;
  defaultColDef = {
    cellClass: function (params) {
      if (params.data.ID == undefined) {
        return "aggregatecol";
      }
    },
    cellRenderer: function(params) {
      if(params.value!=undefined)
      return '<span id='+params.column.colId+"_"+params.data.ID+'>' + params.value + '</span>';
      else
      return "<span></span>"
    }
  };
  style = {
    marginTop: '10px',
    width: '97%',
    height: '240px',
    boxSizing: 'border-box'
  };
  public loanmodel: loan_model;
  columnDefs = [
    { headerName: 'CropunitRecord', field: 'ID', hide: true },
    { headerName: 'Irr/NI', field: 'Practice', editable: false },
    {
      headerName: 'State', field: 'State', editable: false,
      valueFormatter: function (params) {
        return lookupStateRefValue(params.value);
      }
    },
    {
      headerName: 'County', field: 'County', valueFormatter: function (params) {
        return lookupCountyValue(params.value);
      }, editable: false
    },
    { headerName: '% Prod.', field: 'Prodpercentage', editable: false },
    { headerName: 'Landlord', field: 'Landlord', editable: false },
    { headerName: 'FSN', field: 'FSN', editable: false },
    { headerName: 'Crop', field: 'Crop', editable: false },
    { headerName: 'Practice', field: 'Practice', editable: false },
    { headerName: 'CF', field: 'CF', editable: false },
    { headerName: 'RC', field: 'RC', editable: false },
    { headerName: 'Excess ins', field: 'ExcessIns', editable: false },
    {
      headerName: 'Acres', field: 'Acres', editable: true,
      valueSetter: function (value) {
        let result = value.context.componentParent.validateacresvalue(value.data.ID,parseInt(value.newValue));
        if(result)
        {
        value.data.Acres = parseInt(value.newValue);
        // //unset error
        // var el = document.getElementById('Acres_'+value.data.ID);
        // el.parentElement.parentElement.classList.remove("error");
        // el.parentElement.parentElement.setAttribute("title","");
        // //
        return true;
      }
        else
        {
          var el = document.getElementById('Acres_'+value.data.ID);
          el.parentElement.parentElement.classList.add("error");
          el.parentElement.parentElement.setAttribute("title","Acres cannot exceed total acres in Farm");
          return false;
        }

      }
    },

  ];
  //Generic Functions and validations
  validateacresvalue(id, newvalue: number) {
    
    try {
      let Cropunit = this.loanmodel.LoanCropUnits.find(p => p.Loan_CU_ID == id);
      if (Cropunit != undefined) {
        let farmid = Cropunit.Farm_ID;
        let farm = this.loanmodel.Farms.find(p => p.Farm_ID == Cropunit.Farm_ID);
        let sumofcurrentvalues = _.sumBy(this.loanmodel.LoanCropUnits.filter(p => p.Farm_ID == farmid && p.Crop_Practice_Type_Code == Cropunit.Crop_Practice_Type_Code && p.Loan_CU_ID != Cropunit.Loan_CU_ID),  function(o) { return o.CU_Acres; });
        let acres = 0
        if (Cropunit.Crop_Practice_Type_Code = "IRR") {
          acres = farm.Irr_Acres;
        }
        else {
          acres = farm.NI_Acres;
        }
        if((sumofcurrentvalues+newvalue)>acres){
          return false
        }
        else{
          return true;
        }
      }
    }
    catch{
      return false;
    }
  }


  gettotalacresonfarmbycropunitid(id: number) {
    try {
      let Cropunit = this.loanmodel.LoanCropUnits.find(p => p.Loan_CU_ID == id);
      if (Cropunit != undefined) {
        let farm = this.loanmodel.Farms.find(p => p.Farm_ID == Cropunit.Farm_ID);
        if (Cropunit.Crop_Practice_Type_Code = "IRR") {
          return farm.Irr_Acres;
        }
        else {
          return farm.NI_Acres;
        }
      }
      else {
        return 0;
      }
    }
    catch{
      return 0;
    }

  }


  constructor(
    private localstorage: LocalStorageService,
    private loancalculationservice: LoancalculationWorker
  ) {
    this.context = { componentParent: this };
    // change row class contextually here
    this.rowClassRules = {
      "aggregaterow": function (params) {
        return params.data.ID == undefined
      }
    };
    // storage observer
    this.localstorage.observe(environment.loankey).subscribe(res => {
      this.loanmodel = res;
      this.getgriddata();
    })
  }

  ngOnInit() {
    this.loanmodel = this.localstorage.retrieve(environment.loankey);
    this.getgriddata();
  }

  //Grid Functions
  getgriddata() {
    //Get localstorage first
    this.rowData = [];
    if (this.loanmodel != null) {
      //Start making Rows here for IRR
      this.loanmodel.Farms.forEach(farm => {
        //get distinct crops for the farm

        let distinctrows = this.loanmodel.LoanCropUnits.filter(p => p.Farm_ID == farm.Farm_ID && p.Crop_Practice_Type_Code == "IRR");
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

        let distinctrows = this.loanmodel.LoanCropUnits.filter(p => p.Farm_ID == farm.Farm_ID && p.Crop_Practice_Type_Code == "NIR");
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
    let oldvalue=this.loanmodel.LoanCropUnits.find(p => p.Loan_CU_ID == $event.data.ID).CU_Acres;
    if(oldvalue!=$event.value){
    this.loanmodel.LoanCropUnits.find(p => p.Loan_CU_ID == $event.data.ID).CU_Acres = parseInt($event.value);
    this.loancalculationservice.performcalculationonloanobject(this.loanmodel, false);
  }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    params.api.sizeColumnsToFit();//autoresizing
  }
  //Grid Functions End
}
