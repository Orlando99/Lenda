import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { environment } from '../../../environments/environment';
import { loan_model } from '../../models/loanmodel';
import * as _ from "lodash";
import { lookupCountyValue, lookupStateValue, lookupStateRefValue, extractStateValues, lookupStateAbvRefValue, lookupCountyRefValue } from '../../Workers/utility/aggrid/stateandcountyboxes';
import { LoancalculationWorker } from '../../Workers/calculations/loancalculationworker';
import { ToastsManager } from 'ng2-toastr';
import { LoggingService } from '../../services/Logs/logging.service';
import { AlertifyService } from '../../alertify/alertify.service';
import { LoanApiService } from '../../services/loan/loanapi.service';
import { JsonConvert } from 'json2typescript';
import { EmptyEditor } from '../../aggridfilters/emptybox';
import { setgriddefaults, calculatecolumnwidths } from '../../aggriddefinations/aggridoptions';
import { NumericEditor } from '../../aggridfilters/numericaggrid';
import { numberWithOneDecPrecValueFormatter } from '../../Workers/utility/aggrid/formatters';
import { Page, PublishService } from '../../services/publish.service';
import { OptimizerService } from './optimizer.service';
import { acresFormatter } from '../../aggridformatters/valueformatters';
@Component({
  selector: 'app-optimizer',
  templateUrl: './optimizer.component.html',
  styleUrls: ['./optimizer.component.scss'],
  providers : [OptimizerService]
})
export class OptimizerComponent implements OnInit {

  //Properties


  private gridApi;
  private columnApi;
  rowDataNIR = [];
  rowDataIIR = [];
  public frameworkcomponents;
  public loading = false;
  public context;
  public rowClassRules;
  private refdata;
  currentPageName : Page =  Page.optimizer;
  defaultColDef = {
    cellClass: function (params) {
      if (params.data.ID == undefined || params.data==undefined) {
        return "aggregatecol";
      }
    }
    // ,
    // cellRenderer: function (params) {
      
    //   if (params.value != undefined)
    //     return '<span id=' + params.column.colId + "_" + params.data.ID + '>' + params.value + '</span>';
    //   else
    //     return "<span></span>"
    // }
  };
  style = {
    marginTop: '10px',
    width: '97%',
    boxSizing: 'border-box'
  };
  public loanmodel: loan_model;

  columnDefs = [
    { headerName: 'CropunitRecord', field: 'ID', hide: true },
    { headerName: 'Irr/NI', field: 'Practice', editable: false },
    {
      headerName: 'State', field: 'State', editable: false
    },
    {
      headerName: 'County', field: 'County', editable: false
    },
    { headerName: '% Prod.', headerClass: "rightaligned", cellClass: "rightaligned aggregatecol", field: 'Prodpercentage', editable: false },
    { headerName: 'Landlord', field: 'Landlord', editable: false },
    { headerName: 'FSN', headerClass: "rightaligned", cellClass: "rightaligned aggregatecol", field: 'FSN', editable: false },
    { headerName: 'Crop', field: 'Crop', editable: false },
    { headerName: 'Practice', field: 'Practice', editable: false },
    { headerName: 'CF', headerClass: "rightaligned", cellClass: "rightaligned aggregatecol", field: 'CF', editable: false },
    { headerName: 'RC', minWidth: 100, headerClass: "rightaligned", cellClass: "rightaligned aggregatecol", field: 'RC', editable: false },
    { headerName: 'Excess ins', headerClass: "rightaligned", cellClass: "rightaligned aggregatecol", field: 'ExcessIns', editable: false },
    {
      headerName: 'Acres', headerClass: "rightaligned", field: 'Acres', cellClass: 'editable-color rightaligned aggregatecol', editable: true,
      cellEditorSelector: function (params) {
        if (params.data.ID == undefined) {
          return {
            component: 'emptyeditor'
          };
        }
        else
        return {
          component: 'numericCellEditor'
        }; 
      },
      valueFormatter: acresFormatter,
      valueSetter: function (value) {
         
        let result = value.context.componentParent.validateacresvalue(value.data.ID, parseFloat(value.newValue));
        if (result) {
          
          value.data.Acres = parseFloat(value.newValue);
          // //unset error
          // var el = document.getElementById('Acres_'+value.data.ID);
          // el.parentElement.parentElement.classList.remove("error");
          // el.parentElement.parentElement.setAttribute("title","");
          // //
          return true;
        }
        else {
          var el = document.getElementById('Acres_' + value.data.ID);
          try {
            el.parentElement.parentElement.classList.add("dirty");
            el.parentElement.parentElement.setAttribute("title", "Acres cannot exceed total acres in Farm");
          }
          catch{

          }
          return false;
        }

      },
    },

  ];
  
  //Generic Functions and validations
  validateacresvalue(id, newvalue: number) {

    try {
      let Cropunit = this.loanmodel.LoanCropUnits.find(p => p.Loan_CU_ID == id);
      if (Cropunit != undefined) {
        let farmid = Cropunit.Farm_ID;
        let farm = this.loanmodel.Farms.find(p => p.Farm_ID == Cropunit.Farm_ID);
        let sumofcurrentvalues = _.sumBy(this.loanmodel.LoanCropUnits.filter(p => p.Farm_ID == farmid && p.Crop_Practice_Type_Code == Cropunit.Crop_Practice_Type_Code && p.Loan_CU_ID != Cropunit.Loan_CU_ID), function (o) { return o.CU_Acres; });
        let acres = 0
        if (Cropunit.Crop_Practice_Type_Code == "IRR") {
          acres = farm.Irr_Acres;
        }
        else {
          acres = farm.NI_Acres;
        }
        if ((sumofcurrentvalues + newvalue) > acres) {
          return false
        }
        else {
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
    public loanapi: LoanApiService,
    private publishService : PublishService,
    private optimizerService : OptimizerService
  ) {
    this.frameworkcomponents= { emptyeditor:EmptyEditor, numericCellEditor: NumericEditor};
    this.context = { componentParent: this };
    // change row class contextually here
    this.rowClassRules = {
      "aggregaterow": function (params) {
        return params.data.ID == undefined
      }
    };
    // storage observer
    this.localstorage.observe(environment.loankey).subscribe(res => {
      //  
      if (res != null && res.srccomponentedit != undefined && res.srccomponentedit != "optimizercomponent") {
        this.loanmodel = res;
        this.getgriddata();
      }
      else {
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
    this.refdata = this.localstorage.retrieve(environment.referencedatakey);
    this.loanmodel = this.localstorage.retrieve(environment.loankey);
    this.getgriddata();
  }

  //Grid Functions
  getgriddata() {
    //Get localstorage first
    this.rowDataIIR = [];
    this.rowDataNIR = [];
    if (this.loanmodel != null) {
      //Start making Rows here for IRR
      this.loanmodel.Farms.forEach(farm => {
        //get distinct crops for the farm

        let distinctrows = this.loanmodel.LoanCropUnits.filter(p => p.Farm_ID == farm.Farm_ID && p.Crop_Practice_Type_Code == "IRR");
        distinctrows.forEach(crop => {
          let row: any = {};
          row.ID = crop.Loan_CU_ID;
          row.Practice = "IRR";
          row.State = lookupStateAbvRefValue(farm.Farm_State_ID, this.refdata);
          row.County = lookupCountyRefValue(farm.Farm_County_ID, this.refdata);
          row.Prodpercentage = farm.Percent_Prod;
          row.Landlord = farm.Landowner;
          row.FSN = farm.FSN;
          row.Crop = crop.Crop_Code;
          row.CF = "";
          row.RC = "";
          row.ExcessIns = "";
          row.Acres = crop.CU_Acres
          this.rowDataIIR.push(row);
        });
        if (distinctrows.length > 0) {
          let row: any = {};
          row.Acres = _.sumBy(distinctrows, function (o) { return o.CU_Acres; })
          row.RC = "TotalAcres=";
          row.ExcessIns = "" + farm.Irr_Acres.toFixed(1);
          this.rowDataIIR.push(row);
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
          row.State = lookupStateAbvRefValue(farm.Farm_State_ID, this.refdata);
          row.County = lookupCountyRefValue(farm.Farm_County_ID, this.refdata);
          row.Prodpercentage =farm.Percent_Prod +" %";
          row.Landlord = farm.Landowner;
          row.FSN = farm.FSN;
          row.Crop = crop.Crop_Code;
          row.CF = "";
          row.RC = "";
          row.ExcessIns = "";
          row.Acres = crop.CU_Acres
          this.rowDataNIR.push(row);
        });
        if (distinctrows.length > 0) {
          let row: any = {};
          row.Acres = _.sumBy(distinctrows, function (o) { return o.CU_Acres; })
          row.RC = "TotalAcres =";
          row.ExcessIns = "" + farm.NI_Acres.toFixed(1);
          this.rowDataNIR.push(row);
        }
      });
      //End rows here
    }

  }

  syncenabled() {
    if (this.loanmodel.LoanCropUnits.filter(p => p.ActionStatus == 2).length == 0)
      return 'disabled';
    else
      return '';
  }

   /**
   * Sync to database - publish button event
   */
  synctoDb() {
    this.publishService.syncCompleted();
    this.optimizerService.syncToDb(this.localstorage.retrieve(environment.loankey));
  }
  // synctoDb() {

  //   this.loading = true;
  //   this.loanapi.syncloanobject(this.loanmodel).subscribe(res => {
  //     if (res.ResCode == 1) {
  //       this.loanapi.getLoanById(this.loanmodel.Loan_Full_ID).subscribe(res => {

  //         this.logging.checkandcreatelog(3, 'Overview', "APi LOAN GET with Response " + res.ResCode);
  //         if (res.ResCode == 1) {
  //           this.toaster.success("Records Synced");
  //           let jsonConvert: JsonConvert = new JsonConvert();
  //           this.loancalculationservice.performcalculationonloanobject(jsonConvert.deserialize(res.Data, loan_model));
  //         }
  //         else {
  //           this.toaster.error("Could not fetch Loan Object from API")
  //         }
  //       });
  //     }
  //     else {
  //       this.toaster.error("Error in Sync");
  //     }
  //     this.loading = false;
  //   })
  // }

  rowvaluechangedirr($event) {

    if ($event.data.ID != undefined || $event.data.ID != null) {
      let oldvalue = this.loanmodel.LoanCropUnits.find(p => p.Loan_CU_ID == $event.data.ID).CU_Acres;
      if (oldvalue != $event.value) {
        this.loanmodel.LoanCropUnits.find(p => p.Loan_CU_ID == $event.data.ID && p.Crop_Practice_Type_Code == $event.data.Practice).CU_Acres = parseFloat($event.value);
        this.loanmodel.LoanCropUnits.find(p => p.Loan_CU_ID == $event.data.ID && p.Crop_Practice_Type_Code == $event.data.Practice).ActionStatus = 2;
        this.loanmodel.srccomponentedit = "optimizercomponent";
        this.loanmodel.lasteditrowindex = $event.rowIndex;
        this.loancalculationservice.performcalculationonloanobject(this.loanmodel, true);
        this.publishService.enableSync(Page.optimizer);
      }
    }
  }

  rowvaluechangednir($event) {
    if ($event.data.ID != undefined || $event.data.ID != null) {
      let oldvalue = this.loanmodel.LoanCropUnits.find(p => p.Loan_CU_ID == $event.data.ID).CU_Acres;
      if (oldvalue != $event.value) {
        this.loanmodel.LoanCropUnits.find(p => p.Loan_CU_ID == $event.data.ID && p.Crop_Practice_Type_Code == $event.data.Practice).CU_Acres = parseFloat($event.value);
        this.loanmodel.LoanCropUnits.find(p => p.Loan_CU_ID == $event.data.ID && p.Crop_Practice_Type_Code == $event.data.Practice).ActionStatus = 2;
        this.loanmodel.srccomponentedit = "optimizercomponent";
        this.loanmodel.lasteditrowindex = $event.rowIndex;
        this.loancalculationservice.performcalculationonloanobject(this.loanmodel, true);
        this.publishService.enableSync(Page.optimizer);
      }

    }
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    setgriddefaults(this.gridApi, this.columnApi);
    this.style.width = calculatecolumnwidths(this.columnApi) + 2 + "px";

    //params.api.sizeColumnsToFit();//autoresizing
  }
  //Grid Functions End
}
