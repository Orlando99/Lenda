import { Component, OnInit } from '@angular/core';
import { loan_model } from '../../../models/loanmodel';
import { lookupStateRefValue, lookupCountyValue, extractStateValues, lookupStateValue, Statevaluesetter, getfilteredcounties, Countyvaluesetter, lookupStateValueinRefobj } from '../../../Workers/utility/aggrid/stateandcountyboxes';
import { LocalStorageService } from 'ngx-webstorage';
import { LoancalculationWorker } from '../../../Workers/calculations/loancalculationworker';
import { environment } from '../../../../environments/environment.prod';
import * as _ from 'lodash'
import { ChipsListEditor } from '../../../aggridcolumns/chipscelleditor';
import { GridOptions } from 'ag-grid';
import { SelectEditor } from '../../../aggridfilters/selectbox';
import { extractCropValues, lookupCropValue, Cropvaluesetter, getfilteredCropType, lookupCropTypeValue, CropTypevaluesetter, lookupCropValuewithoutmapping } from '../../../Workers/utility/aggrid/cropboxes';
import { PercentageFormatter, PriceFormatter } from '../../../Workers/utility/aggrid/formatters';
import { numberValueSetter } from '../../../Workers/utility/aggrid/numericboxes';
import { NumericEditor } from '../../../aggridfilters/numericaggrid';
import { DebugContext } from '@angular/core/src/view';
import { EmptyEditor } from '../../../aggridfilters/emptybox';
import { Insurance_Policy } from '../../../models/insurancemodel';

@Component({
  selector: 'app-policies',
  templateUrl: './policies.component.html',
  styleUrls: ['./policies.component.scss']
})
export class PoliciesComponent implements OnInit {
 


  deleteunwantedcolumn(): any {
    var currentvisiblecolumns = this.columnDefs.filter(p => p.headerName.includes("Subtype")).map(p => p.headerName.split("_")[0]);
    currentvisiblecolumns.forEach(element => {
      let included = false;
      this.rowData.forEach(row => {
        if (row.SecInsurance.includes(element)) {
          included = true;
        }
      });
      if (!included) {
        // let indexofcolumn= this.columnDefs.findIndex(p=>p.headerName.includes(element))
        // this.columnDefs.splice(indexofcolumn,1);
        //Delete insurance Value Columns
        _.remove(this.columnDefs, p => p.headerName.includes(element))

      }
    });


  }
  PlanTypes(): any {
    return { values: ['MPCI', 'HMAX', 'STAX'] };
  }
  //validations
  checkcropandinsurancecombination(crop: string, maintype: string, subtype: string) {

  }

  addNumericColumn(element: string) {
    debugger
    this.columnDefs.push({
      headerName: element, field: element, editable: true,
      cellEditorSelector: function (params) {
        debugger
        let arrays = params.colDef.headerName.split('_');
        if (arrays.length > 0) {
          if (params.data.SecInsurance.includes(arrays[1])) {
            return {
              component: 'numericCellEditor'
            };
          }
          else {
            return {
              component: 'emptyeditor'
            };
          }
        }

      },
      cellClass: function (params) {
        let arrays = params.colDef.headerName.split('_');
        if (arrays.length > 0) {
          if (!params.data.SecInsurance.includes(arrays[1])) {
            return 'grayedcell';
          }
        }
      }
    })
  }

  ShowHideColumnsonselection(value: string) {
    let rendervalues = [];
    if (value == "HMAX") { //these values are Suffixed rather than prefixed
      //HMAX
      rendervalues = ['Upper_HMAX', 'Lower_HMAX', 'Price_HMAX']
      //HMAX
    }
    if (value == "STAX") {
      rendervalues = ['Upper_STAX', 'Yield_STAX']
    }
    if (value == "RAMP") {
      rendervalues = ['Upper_RAMP', 'Lower_RAMP', 'Price_RAMP', 'Liability_RAMP']
    }
    if (value == "ICE") {
      rendervalues = ['Yield_ICE', 'Price_ICE']
    }
    if (value == "ABC") {
      rendervalues = ['Upper_ABC', 'Lower_ABC']
    }
    if (value == "PCI") {
      rendervalues = ['FCMC_PCI']
    }
    if (value == "CROPHAIL") {
      rendervalues = ['Upper_CROPHAIL', 'Deduct_CROPHAIL', 'Price_CROPHAIL', 'Liability_CROPHAIL']
    }

    rendervalues.forEach(element => {
      this.addNumericColumn(element);
    });
  }
  //
  getsubtypeforinsurance(type: string) {
    if (type == "STAX") {
      return { values: [] };
    }
    if (type == "SCO") {
      return { values: [] };
    }
    if (type == "HMAX") {
      return { values: ['Standard', 'X1', 'Max-RP'] };
    }
    if (type == "RAMP") {
      return { values: ['RY', 'RR'] };
    }
    if (type == "ICE") {
      return { values: ['AY', 'BY', 'BR', 'CY', 'CR'] };
    }
    if (type == "ABC") {
      return { values: ['AY', 'AR'] };
    }
    if (type == "PCI") {
      return { values: [] };
    }
  }
  GetPlanSubType(type: string): any {
    if (type == "MPCI") {
      return { values: ['CAT', 'YP', 'RP-HPE', 'RP', 'ARH'] };
    }
    if (type == "HMAX") {
      return { values: ['STANDARD', 'X1', 'MAXRP'] };
    }
    if (type == "STAX") {
      return { values: [] };
    }
  }
  getAIPs(): any {
    return { values: ['ADM', 'AFBIS', 'ARMTECH'] };
  }
  getAgents(): any {
    debugger
    let ret = this.loanobj.Association.map(p => p.Assoc_Name);
    let obj: string[] = [];
    ret.forEach(element => {
      obj.push(element.toString());
    });
    return { values: obj };
  }

  //Properties
  private refdata;
  private gridApi;
  private columnApi;
  rowData = [];
  public frameworkcomponents;
  public context;
  public loanobj: loan_model;
  public rowClassRules;
  public paginationPageSize;
  public paginationNumberFormatter;

  defaultColDef = {

  };
  style = {
    marginTop: '10px',
    width: '93%',
    height: '240px',

  };
  public loanmodel: loan_model;

  gridOptions: GridOptions;
  columnDefs: any[];
  constructor(
    private localstorage: LocalStorageService,
    private loancalculationservice: LoancalculationWorker
  ) {
    this.frameworkcomponents = { chipeditor: ChipsListEditor, selectEditor: SelectEditor, numericCellEditor: NumericEditor, emptyeditor: EmptyEditor };
    this.refdata = this.localstorage.retrieve(environment.referencedatakey);
    this.loanobj = this.localstorage.retrieve(environment.loankey);
    this.context = { componentParent: this };
    this.paginationPageSize = 10;
    this.paginationNumberFormatter = function (params) {
      return "[" + params.value.toLocaleString() + "]";
    };
    //Col defs
    this.columnDefs = [
      {
        headerName: 'Agent', field: 'Agentid', cellClass: 'editable-color', editable: true, cellEditor: "agSelectCellEditor",
        cellEditorParams: this.getAgents()

      },
      {
        headerName: 'Proposed AIP', field: 'ProposedAIP', cellClass: 'editable-color', editable: true, cellEditor: "agSelectCellEditor",
        cellEditorParams: this.getAIPs()

      },
      {
        headerName: 'County | State', field: 'StateandCountry'
      },
      {
        headerName: 'Crop', field: 'CropName'
      },
      {
        headerName: 'Practice', field: 'Practice'
      },
      // {
      //   headerName: 'PlanType', field: 'Plan', cellClass: 'editable-color', editable: true, cellEditor: "agSelectCellEditor",
      //   cellEditorParams:this.PlanTypes()
      // },
      {
        headerName: 'SubPlanType', field: 'PlanSubtype', cellClass: 'editable-color', editable: true, cellEditor: "agSelectCellEditor",
        cellEditorParams: this.GetPlanSubType('MPCI')
      },
      {
        headerName: 'Options', field: 'SecInsurance', cellClass: 'editable-color', editable: true, cellEditor: "chipeditor",
        cellEditorParams: {
          items: [
            { "id": 1, "itemName": "STAX" },
            { "id": 2, "itemName": "RAMP" },
            { "id": 3, "itemName": "ICE" },
            { "id": 4, "itemName": "SCO" },
            { "id": 5, "itemName": "HMAX" },
            { "id": 6, "itemName": "ABC" },
            { "id": 7, "itemName": "PCI" },
            { "id": 8, "itemName": "CROPHAIL" }
          ]
        }
        //   valueSetter: function (params) {
        //    return params.newValue;

        // }
      },
      {
        headerName: 'Unit', field: 'Rent_UOM', cellClass: 'editable-color', editable: true, cellEditor: "selectEditor",
        cellEditorParams: { values: [{ key: 1, value: 'EU' }, { key: 2, value: 'BU' }, { key: 2, value: 'EP' }, { key: 2, value: 'OU' }] },
        valueFormatter: function (params) {
          let selected = [{ key: 1, value: '$ per acre' }, { key: 2, value: '$ Total' }].find(v => v.key == params.value);
          return selected ? selected.value : undefined;
        }
      },
      {
        headerName: 'Level', field: 'Percent_Prod', cellClass: 'editable-color', editable: true, cellEditor: "numericCellEditor",
        valueFormatter: function (params) {
          return PercentageFormatter(params.value);
        },
        valueSetter: function (params) {

          numberValueSetter(params);
          if (params.newValue) {
            params.data['Rentperc'] = 100 - parseFloat(params.newValue);
          }
          return true;
        }
      },
      {
        headerName: 'Price', field: 'Cash_Rent_Waived', cellClass: 'editable-color', editable: true, cellEditor: "numericCellEditor", valueSetter: numberValueSetter,
        valueFormatter: function (params) {
          return PriceFormatter(params.value);
        }
      },
      {
        headerName: 'Premium', field: 'Cash_Rent_Waived', cellClass: 'editable-color', editable: true, cellEditor: "numericCellEditor", valueSetter: numberValueSetter,
        valueFormatter: function (params) {
          return PriceFormatter(params.value);
        }
      }

    ];
    // Ends Here
    // storage observer
    this.localstorage.observe(environment.loankey).subscribe(res => {
      this.loanmodel = res;
      //this.getgriddata();
    })
  }

  ngOnInit() {
    this.loanmodel = this.localstorage.retrieve(environment.loankey);
    this.getgriddata();
  }

  //chips callbacks
  chipitemsselected(items: any[]) {
    //  debugger
    //  this.columnDefs.push({headerName: 'Nowhere', field: 'Nowhere'})
    //  this.gridApi.setColumnDefs(this.columnDefs);
  }
  //
  //Grid Functions
  getgriddata() {
    //Get localstorage first
    this.rowData = [];
    if (this.loanmodel != null) {
      this.loanobj.Farms.forEach(farm => {
        debugger
        let distinctrows = this.loanmodel.LoanCropUnits.filter(p => p.Farm_ID == farm.Farm_ID);
        distinctrows.forEach(crop => {
          let row: any = {};
          row.Farm_ID = farm.Farm_ID;
          row.CropRecord_ID = crop.Loan_CU_ID
          row.Agentid = null;
          row.ProposedAIP = null;
          row.StateandCountry = lookupStateValueinRefobj(farm.Farm_State_ID) + "|" + lookupCountyValue(farm.Farm_County_ID);
          row.CropName = lookupCropValuewithoutmapping(crop.Crop_Code);
          row.Practice = crop.Crop_Practice_Type_Code;
          row.Crop_Code = crop.Crop_Code;
          row.Crop_Practice = crop.Crop_Practice_Type_Code;
          row.Plan = null;
          row.Countyid = farm.Farm_County_ID;
          row.Stateid = farm.Farm_State_ID;
          row.PlanSubtype = null;
          row.SecInsurance = "";
          row.Unit = null;
          row.Level = 0;
          row.Price = 0;
          row.Premium = 0;
          this.rowData.push(row);
        });
      });

    }

  }

  //DB Operations

  deleteanyotherrecord(options: [string], farmid: any, cropcode: any, practice: any): any {
    let itemsinloan=this.loanmodel.InsurancePolicies.filter(p => p.Farmid == farmid && p.Crop_Code == cropcode && p.Crop_Practice_Code == practice)
    itemsinloan.forEach((element,index) => {
      if(options.find(p=>p==element.Option)==undefined){
        this.loanmodel.InsurancePolicies.splice(index,1);
      }
    });
  }
  synclocalloanobject(event: any): any {
    debugger
    let selectedfarm = event.data.Farm_ID;
    let recordsforthefarm = this.loanmodel.InsurancePolicies.filter(p => p.Farmid == selectedfarm);
    debugger
    if (recordsforthefarm.length > 0) {
      let optionsselected = event.data.SecInsurance.split(",");
      if (optionsselected != "") {
        optionsselected.forEach(element => {
          let foundoldrecord = this.loanmodel.InsurancePolicies.find(p => p.Farmid == event.data.Farm_ID && p.Crop_Code == event.data.Crop_Code && p.Crop_Practice_Code == event.data.Crop_Practice && p.Option == element)
          if (foundoldrecord != undefined) {
            let index = this.loanmodel.InsurancePolicies.indexOf(foundoldrecord);
            this.updatepolicyrecordinloanobject(index, foundoldrecord, event, element);
          }
          else
            this.addpolicyrecordinloanobject(event, element);
        });

        this.deleteanyotherrecord(optionsselected,event.data.Farm_ID,event.data.Crop_Code,event.data.Crop_Practice)
      }
    }
    else {
      let optionsselected = event.data.SecInsurance.split(",");
      if (optionsselected != "") {
        optionsselected.forEach(element => {
          debugger
          this.addpolicyrecordinloanobject(event, element);
        });
      }
    }
    this.loancalculationservice.performcalculationonloanobject(this.loanmodel);
  }



  updatepolicyrecordinloanobject(index, policy: Insurance_Policy, event: any, optiontype: string) {
    debugger

    policy.Agentid = event.data.Agentid;
    policy.CountyId = event.data.Countyid;
    policy.StateId = event.data.Stateid;
    policy.Crop_Code = event.data.Crop_Code;
    policy.Crop_Practice_Code = event.data.Crop_Practice;
    policy.Croprecordid = event.data.CropRecord_ID;
    policy.Farmid = event.data.Farm_ID;
    policy.Level = event.data.Level;
    policy.MPCI_Subplan = event.data.PlanSubtype;
    policy.Option = optiontype;
    debugger
    policy.Option_subtype = event.data[optiontype + "_st"];
    policy.OV_Deduct = event.data["Deduct_" + optiontype];
    policy.OV_FCMC = event.data["FCMC" + optiontype];
    policy.OV_Liability = event.data["Liability_" + optiontype];
    policy.OV_Lower = event.data["Lower_" + optiontype];
    policy.OV_Upper = event.data["Upper_" + optiontype];
    policy.OV_Yield = event.data["Yield_" + optiontype];
    this.loanmodel.InsurancePolicies[index] = policy;

  }
  addpolicyrecordinloanobject(event: any, optiontype: string) {
    debugger
    let policy = new Insurance_Policy();
    policy.Agentid = event.data.Agentid;
    policy.CountyId = event.data.Countyid;
    policy.StateId = event.data.Stateid;
    policy.Crop_Code = event.data.Crop_Code;
    policy.Crop_Practice_Code = event.data.Crop_Practice;
    policy.Croprecordid = event.data.CropRecord_ID;
    policy.Farmid = event.data.Farm_ID;
    policy.Level = event.data.Level;
    policy.MPCI_Subplan = event.data.PlanSubtype;
    policy.Option = optiontype;
    debugger
    policy.Option_subtype = event.data[optiontype + "_st"];
    policy.OV_Deduct = event.data["Deduct_" + optiontype];
    policy.OV_FCMC = event.data["FCMC" + optiontype];
    policy.OV_Liability = event.data["Liability_" + optiontype];
    policy.OV_Lower = event.data["Lower_" + optiontype];
    policy.OV_Upper = event.data["Upper_" + optiontype];
    policy.OV_Yield = event.data["Yield_" + optiontype];
    this.loanmodel.InsurancePolicies.push(policy);

  }
  //
  syncenabled() {
    return false;
  }

  synctoDb() {

  }


  cellEditingStarted(event) {
    //  if(event.colDef.headerName.includes("Subtype"))
    //  {
    //   debugger
    // }
  }
  rowvaluechanged($event) {
    // Options
    if ($event.data.SecInsurance != "" && $event.colDef.field == "SecInsurance") {
      debugger
      var items = $event.data.SecInsurance.toString().split(",");
      items.forEach(element => {

        if (this.columnDefs.find(p => p.headerName.split('_')[0] == element) == undefined) {
          this.ShowHideColumnsonselection(element)
          this.columnDefs.push({
            headerName: element + '_Subtype', field: element + "_st", editable: true, cellEditorParams: this.getsubtypeforinsurance(element),
            cellEditorSelector: function (params) {
              debugger
              let column = params.colDef.headerName.split('_')[0];
              if (params.data.SecInsurance.includes(column)) {
                return {
                  component: 'agSelectCellEditor'
                };
              }
              else {
                return {
                  component: 'emptyeditor'
                };
              }
            },
            cellClass: function (params) {
              let column = params.colDef.headerName.split('_')[0];
              if (!params.data.SecInsurance.includes(column)) {
                return 'grayedcell';
              }
            }
          })
        }
      });
      //Delete unwanted Column here
      debugger
      this.deleteunwantedcolumn();
      this.gridApi.setColumnDefs(this.columnDefs);
      debugger
      this.gridApi.ensureColumnVisible(this.columnDefs[this.columnDefs.length - 1].field)

    }
    //get the local loan object synced
    this.synclocalloanobject($event);
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;

    params.api.sizeColumnsToFit();//autoresizing
  }
  //Grid Functions End

}
