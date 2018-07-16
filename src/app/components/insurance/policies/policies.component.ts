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
import { debug } from 'util';

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

  declarecoldefs(){
    this.columnDefs=[];
    this.columnDefs = [
      {
        headerName: 'Agent', field: 'Agent_Id', cellClass: 'editable-color', editable: true, cellEditor: "selectEditor",
        cellEditorParams: this.getAgents(),
        valueFormatter: function (params) {
          try{
         return (params.context.componentParent.loanmodel as loan_model).Association.find(p=>p.Assoc_ID==params.value).Assoc_Name;
        }
        catch{
          return "Select";
        }
        }

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
      {
        headerName: 'SubPlanType', field: 'MPCI_Subplan', cellClass: 'editable-color', editable: true, cellEditor: "agSelectCellEditor",
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
        headerName: 'Unit', field: 'Unit', cellClass: 'editable-color', editable: true, cellEditor: "selectEditor",
        cellEditorParams: { values: [{ key: 1, value: 'EU' }, { key: 2, value: 'BU' }, { key: 2, value: 'EP' }, { key: 2, value: 'OU' }] },
        valueFormatter: function (params) {
          let selected = [{ key: 1, value: '$ per acre' }, { key: 2, value: '$ Total' }].find(v => v.key == params.value);
          return selected ? selected.value : undefined;
        }
      },
      {
        headerName: 'Level', field: 'Level', cellClass: 'editable-color', editable: true, cellEditor: "numericCellEditor",
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
        headerName: 'Price', field: 'Price', cellClass: 'editable-color', editable: true, cellEditor: "numericCellEditor", valueSetter: numberValueSetter,
        valueFormatter: function (params) {
          return PriceFormatter(params.value);
        }
      },
      {
        headerName: 'Premium', field: 'Premium', cellClass: 'editable-color', editable: true, cellEditor: "numericCellEditor", valueSetter: numberValueSetter,
        valueFormatter: function (params) {
          return PriceFormatter(params.value);
        }
      }

    ];
  }
  addNumericColumn(element: string) {
  
    this.columnDefs.push({
      headerName: element, field: element, editable: true,
      cellEditorSelector: function (params) {
        let pos = params.colDef.headerName.lastIndexOf("_") + 1;
       let policyname= params.colDef.headerName.substr(pos, params.colDef.headerName.length - pos)
        if (policyname.length > 0) {
          if (params.data.SecInsurance.includes(policyname)) {
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
        debugger
        let pos = params.colDef.headerName.lastIndexOf("_") + 1;
       let policyname= params.colDef.headerName.substr(pos, params.colDef.headerName.length - pos)
        if (policyname.length > 0) {
          if (!params.data.SecInsurance.includes(policyname)) {
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
      rendervalues = ['Upper_Limit_HMAX', 'Lower_Limit_HMAX', 'Price_HMAX']
      //HMAX
    }
    if (value == "STAX") {
      rendervalues = ['Upper_Limit_STAX', 'Yield_STAX']
    }
    if (value == "RAMP") {
      rendervalues = ['Upper_Limit_RAMP', 'Lower_Limit_RAMP', 'Price_RAMP', 'Liability_RAMP']
    }
    if (value == "ICE") {
      rendervalues = ['Yield_ICE', 'Price_ICE']
    }
    if (value == "ABC") {
      rendervalues = ['Upper_Limit_ABC', 'Lower_Limit_ABC']
    }
    if (value == "PCI") {
      rendervalues = ['FCMC_PCI']
    }
    if (value == "CROPHAIL") {
      rendervalues = ['Upper_Limit_CROPHAIL', 'Deduct_CROPHAIL', 'Price_CROPHAIL', 'Liability_CROPHAIL']
    }

    rendervalues.forEach(element => {
      if(this.columnDefs.find(p=>p.headerName==element)==undefined)
      this.addNumericColumn(element);
    });

    return rendervalues;
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
    
    let ret = this.loanobj.Association;
    let obj: any[] = [];
    ret.forEach((element:any) => {
      obj.push({key:element.Assoc_ID,value:element.Assoc_Name.toString()});
    });
    return { values:obj};
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
   
    // Ends Here
    // storage observer
    this.localstorage.observe(environment.loankey).subscribe(res => {
      this.loanmodel = res;
      this.declarecoldefs();
      this.getgriddata();
    })
  }

  ngOnInit() {
    this.loanmodel = this.localstorage.retrieve(environment.loankey);
    this.declarecoldefs();
    this.getgriddata();
  }

  //Crops Functions
  getcropnamebyVcropid(id:number){
     let cropname=this.refdata.CropList.find(p=>p.Crop_And_Practice_ID==id).Crop_Name;
     return cropname;
  }

  getcroppracticebyVcropid(id:number){
    let croppractice=this.refdata.CropList.find(p=>p.Crop_And_Practice_ID==id).Practice_type_code;
    return croppractice;
 }
  //
  //
  //Grid Functions completed
  getgriddata() {
    //Get localstorage first
    this.rowData = [];
    
    if (this.loanmodel != null) {
     let insurancepolicies=this.loanmodel.InsurancePolicies;
     insurancepolicies.forEach(item => {
        
          let row: any = {};
          row.mainpolicyId = item.Policy_id;
          row.Agent_Id = item.Agent_Id;
          row.ProposedAIP = item.ProposedAIP;
          row.StateandCountry = lookupStateValueinRefobj(item.State_Id) + "|" + lookupCountyValue(item.County_Id);
          row.CropName = this.getcropnamebyVcropid(item.Crop_Practice_Id);
          row.Practice = this.getcroppracticebyVcropid(item.Crop_Practice_Id);
          row.MPCI_Subplan = item.MPCI_Subplan;
          row.SecInsurance = item.Subpolicies.map(p=>p.Ins_Type).join(',');
          row.Unit = item.Unit;
          row.Level = item.Level;
          row.Price = item.Price;
          row.Premium = item.Premium;
          item.Subpolicies.forEach(policy => {
            
            var newsubcol=policy.Ins_Type.toString() + "_Subtype";
            row[policy.Ins_Type.toString() + "_st"]=policy.Ins_SubType;
            if(this.columnDefs.find(p=>p.headerName==newsubcol)==undefined)
            {
            this.columnDefs.push({
              headerName: newsubcol, field: policy.Ins_Type + "_st", editable: true, cellEditorParams: this.getsubtypeforinsurance(policy.Ins_Type),
              cellEditorSelector: function (params) {
                
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
           let renderedvalues =this.ShowHideColumnsonselection(policy.Ins_Type);
           debugger
           renderedvalues.forEach(element => {
             let tobindcol=element.toString().replace("_"+policy.Ins_Type,"");
              row[element]=policy[tobindcol];
           });
          });
          
          this.rowData.push(row);
    })
    
  }
  }

  //DB Operations

  updatelocalloanobject(event: any): any {
    debugger
  if(event.colDef.headerName.includes("_")){
    let pos = event.colDef.headerName.lastIndexOf("_") + 1;
    let policyname= event.colDef.headerName.substr(pos, event.colDef.headerName.length - pos)
     let policy=this.loanmodel.InsurancePolicies[event.rowIndex].Subpolicies.find(p=>p.Ins_Type==policyname);
     policy[event.colDef.headerName.replace("_"+policyname,"")]=event.value;
  }
  else{
    this.loanmodel.InsurancePolicies[event.rowIndex][event.colDef.field]=event.value;
  }
   this.loancalculationservice.performcalculationonloanobject(this.loanmodel);
  }


  
  syncenabled() {
    return false;
  }

  synctoDb() {

  }

  rowvaluechanged($event) {
    debugger
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
    this.updatelocalloanobject($event);
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;

    params.api.sizeColumnsToFit();//autoresizing
  }
  //Grid Functions End

}
