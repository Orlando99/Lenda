import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { environment } from '../../../environments/environment';
import { loan_model } from '../../models/loanmodel';
import * as _ from "lodash";
import { lookupCountyValue, lookupStateValue, lookupStateRefValue } from '../../Workers/utility/aggrid/stateandcountyboxes';
import { LoancalculationWorker } from '../../Workers/calculations/loancalculationworker';
import { ToastsManager } from '../../../../node_modules/ng2-toastr';
import { LoggingService } from '../../services/Logs/logging.service';
import { AlertifyService } from '../../alertify/alertify.service';
import { LoanApiService } from '../../services/loan/loanapi.service';
import { JsonConvert } from '../../../../node_modules/json2typescript';
import { EmptyEditor } from '../../aggridfilters/emptybox';
@Component({
  selector: 'app-optimizer',
  templateUrl: './optimizer.component.html'
})
export class OptimizerComponent implements OnInit {

  //Properties
  private gridApi;
  private columnApi;
  rowData = [];
  public loading=false;
  public context;
  public rowClassRules;
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
      cellEditorSelector:function (params){
        if(params.data.ID==undefined){
          return {
            component: 'emptyeditor'
          };
        }
      },
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
  frameworkcomponents: { emptyeditor: typeof EmptyEditor; };
  //Generic Functions and validations
  validateacresvalue(id, newvalue: number) {

    try {
      let Cropunit = this.loanmodel.LoanCropUnits.find(p => p.Loan_CU_ID == id);
      if (Cropunit != undefined) {
        let farmid = Cropunit.Farm_ID;
        let farm = this.loanmodel.Farms.find(p => p.Farm_ID == Cropunit.Farm_ID);
        let sumofcurrentvalues = _.sumBy(this.loanmodel.LoanCropUnits.filter(p => p.Farm_ID == farmid && p.Crop_Practice_Type_Code == Cropunit.Crop_Practice_Type_Code && p.Loan_CU_ID != Cropunit.Loan_CU_ID),  function(o) { return o.CU_Acres; });
        let acres = 0
        if (Cropunit.Crop_Practice_Type_Code == "IRR") {
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
        if (Cropunit.Crop_Practice_Type_Code == "IRR") {
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
    private loancalculationservice: LoancalculationWorker,
    private toaster: ToastsManager,
              public logging: LoggingService,
              public alertify: AlertifyService,
              public loanapi:LoanApiService
  ) {
    this.frameworkcomponents = { emptyeditor: EmptyEditor };
    this.context = { componentParent: this };
    // change row class contextually here
    this.rowClassRules = {
      "aggregaterow": function (params) {
        return params.data.ID == undefined
      }
    };
    // storage observer
    this.localstorage.observe(environment.loankey).subscribe(res => {
      // debugger
      if(res!=null && res.srccomponentedit!=undefined && res.srccomponentedit!="optimizercomponent")
      {
      this.loanmodel = res;
      this.getgriddata();
      }
      else{
        this.loanmodel = res;
        this.getgriddata();
        this.gridApi.startEditingCell({
          rowIndex: this.loanmodel.lasteditrowindex,
          colKey: "Acres"
        });
        
      }
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
          row.RC = "TotalAcres=";
          row.ExcessIns =""+farm.Irr_Acres;
          this.rowData.push(row);
        }
      });

      //NIR
      this.loanmodel.Farms.forEach(farm => {
        //get distinct crops for the farm
debugger
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
          row.RC = "TotalAcres =";
          row.ExcessIns =""+farm.NI_Acres;
          this.rowData.push(row);
        }
      });
      //End rows here
    }

  }

  syncenabled() {
    return true;
  }

  synctoDb() {
    debugger
    this.loading=true;
    this.loanapi.syncloanobject(this.loanmodel).subscribe(res=>{
      if(res.ResCode==1){
        this.loanapi.getLoanById(this.loanmodel.Loan_Full_ID).subscribe(res => {

          this.logging.checkandcreatelog(3,'Overview',"APi LOAN GET with Response "+res.ResCode);
          if (res.ResCode == 1) {
            this.toaster.success("Records Synced");
            let jsonConvert: JsonConvert = new JsonConvert();
            this.loancalculationservice.performcalculationonloanobject(jsonConvert.deserialize(res.Data, loan_model));
          }
          else{
            this.toaster.error("Could not fetch Loan Object from API")
          }
        });
      }
      else{
        this.toaster.error("Error in Sync");
      }
      this.loading=false;
    })
  }

  rowvaluechanged($event) {
    debugger
    let oldvalue=this.loanmodel.LoanCropUnits.find(p => p.Loan_CU_ID == $event.data.ID).CU_Acres;
    if(oldvalue!=$event.value){
      this.loanmodel.LoanCropUnits.find(p => p.Loan_CU_ID == $event.data.ID && p.Crop_Practice_Type_Code==$event.data.Practice).CU_Acres =parseInt($event.value);
      this.loanmodel.LoanCropUnits.find(p => p.Loan_CU_ID == $event.data.ID && p.Crop_Practice_Type_Code==$event.data.Practice).ActionStatus =2;
      this.loanmodel.srccomponentedit="optimizercomponent";
      this.loanmodel.lasteditrowindex=$event.rowIndex;
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
