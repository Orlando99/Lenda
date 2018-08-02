import { Component, OnInit, ViewEncapsulation } from '@angular/core';
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
import { numberValueSetter, getNumericCellEditor } from '../../../Workers/utility/aggrid/numericboxes';
import { NumericEditor } from '../../../aggridfilters/numericaggrid';
import { DebugContext } from '@angular/core/src/view';
import { EmptyEditor } from '../../../aggridfilters/emptybox';
import { Insurance_Policy, Insurance_Subpolicy } from '../../../models/insurancemodel';
import { status } from '../../../models/syncstatusmodel';
import { JsonConvert } from '../../../../../node_modules/json2typescript';
import { ToastsManager } from '../../../../../node_modules/ng2-toastr';
import { LoggingService } from '../../../services/Logs/logging.service';
import { AlertifyService } from '../../../alertify/alertify.service';
import { LoanApiService } from '../../../services/loan/loanapi.service';
import { AgGridTooltipComponent } from '../../../aggridcolumns/tooltip/tooltip.component';

@Component({
  selector: 'app-policies',
  templateUrl: './policies.component.html',
  styleUrls: ['./policies.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PoliciesComponent implements OnInit {
  public syncInsuranceStatus: status;
 

  deleteunwantedcolumn(): any {
    // debugger
    var currentvisiblecolumns = this.columnDefs.filter(p => p.headerName.includes("Subtype")).map(p => p.headerName.split("_")[0]);
    currentvisiblecolumns.forEach(element => {
      let included = false;
      this.rowData.forEach(row => {
        if (row.SecInsurance.includes(element)) {
          included = true;
        }
      });
      if (!included) {
        _.remove(this.columnDefs, p => p.pickfield.includes(element))
        this.loanmodel.InsurancePolicies.forEach(function(newel){
          
         _.remove(newel.Subpolicies,p=>p.Ins_Type==element && p.SubPolicy_Id==0);
         debugger
         newel.Subpolicies.filter(p=>p.Ins_Type==element && p.SubPolicy_Id!=0).forEach(element => {
           element.ActionStatus=3;
         });
        })
      }
    });


  }
  PlanTypes(): any {
    return { values: ['MPCI', 'HMAX', 'STAX'] };
  }
  //validations
  checkcropandinsurancecombination(crop: string, maintype: string, subtype: string) {

  }

  declarecoldefs() {
    this.defaultColDef = {
      cellClassRules: {
        "edited-color": function(params){
           return params.data.ActionStatus==2;
             
        }
      }
    };
    this.columnDefs = [];
    this.columnDefs = [
      {
        headerName: 'Agent', 
        field: 'Agent_Id',pickfield:'Agent_Id', 
        cellClass: 'editable-color', 
        //cellRenderer: 'columnTooltip',
        headerTooltip: 'Agent',
        editable: true, 
        cellEditor: "selectEditor",
        cellEditorParams: this.getAgents(),
        valueFormatter: function (params) {
          try {
            return (params.context.componentParent.loanmodel as loan_model).Association.find(p => p.Assoc_ID == params.value).Assoc_Name;
          }
          catch{
            return "Select";
          }
        }
      },
      {
        headerName: 'Proposed AIP', 
        field: 'ProposedAIP',pickfield:'ProposedAIP',
        headerTooltip: 'ProposedAIP',
        cellRenderer: 'columnTooltip',
        cellClass: 'editable-color', 
        editable: true, 
        cellEditor: "agSelectCellEditor",
        cellEditorParams: this.getAIPs()
      },
      {
        headerName: 'County | State', 
        headerTooltip: 'County | State',
        cellRenderer: 'columnTooltip',
        field: 'StateandCountry'
        ,pickfield:'StateandCountry'
      },
      {
        headerName: 'Crop', 
        headerTooltip: 'Crop',
        cellRenderer: 'columnTooltip',
        field: 'CropName',pickfield:'CropName'
      },
      {
        headerName: 'Practice', 
        headerTooltip: 'Practice',
        cellRenderer: 'columnTooltip',
        field: 'Practice',pickfield:'Practice'
      },
      {
        headerName: 'SubPlanType', 
        headerTooltip: 'SubPlanType',
        field: 'MPCI_Subplan', 
        cellRenderer: 'columnTooltip',
        pickfield:'MPCI_Subplan',
        cellClass: ['editable-color'], 
        editable: true, 
        cellEditor: "agSelectCellEditor",
        cellEditorParams: this.GetMPCIPlanSubType('MPCI')
      },
      {
        headerName: 'Options', 
        headerTooltip: 'Options',
        field: 'SecInsurance', 
        cellRenderer: 'columnTooltip',
        cellClass: ['editable-color'], 
        autoHeight: true,
        pickfield:'SecInsurance',
        editable: true, 
        cellEditor: "chipeditor",
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
        headerName: 'Unit', 
        headerTooltip: 'Unit',
        field: 'Unit', 
        cellRenderer: 'columnTooltip',
        cellClass: ['editable-color'], 
        editable: true, pickfield:'Unit',
        cellEditor: "selectEditor",
        cellEditorParams: { 
          values: [
            { key: 1, value: 'EU' }, 
            { key: 2, value: 'BU' }, 
            { key: 2, value: 'EP' }, 
            { key: 2, value: 'OU' }
          ] 
        },
        valueFormatter: function (params) {
          let selected = [{ key: 1, value: '$ per acre' }, { key: 2, value: '$ Total' }].find(v => v.key == params.value);
          return selected ? selected.value : undefined;
        }
      },
      {
        headerName: 'Level', 
        headerTooltip: 'Level',
        field: 'Level', 
        cellRenderer: 'columnTooltip',
        cellClass: ['editable-color'], 
        editable: true, pickfield:'Level',
        cellEditor: "numericCellEditor",
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
        headerName: 'Price', 
        headerTooltip: 'Price',
        field: 'Price', pickfield:'Price',
        cellRenderer: 'columnTooltip',
        cellClass: ['editable-color'], 
        editable: true, 
        cellEditor: "numericCellEditor", 
        valueSetter: numberValueSetter,
        valueFormatter: function (params) {
          return PriceFormatter(params.value);
        }
      },
      {
        headerName: 'Premium', 
        headerTooltip: 'Premium',
        field: 'Premium', pickfield:'Premium',
        cellRenderer: 'columnTooltip',
        cellClass: ['editable-color'], 
        editable: true, 
        cellEditor: "numericCellEditor", 
        valueSetter: numberValueSetter,
        valueFormatter: function (params) {
          return PriceFormatter(params.value);
        }
      }

    ];
    this.getgriddata();
  }
  getunits(){
    return { values: ['EU', 'BU', 'EP','OU'] };
  }
  addNumericColumn(element: string) {
    
    let header=element;
    this.columnDefs.push({
      headerName: header,pickfield:element,field: element, editable: true,
      cellEditorSelector: function (params) {
        let pos = params.colDef.pickfield.lastIndexOf("_") + 1;
        let policyname = params.colDef.pickfield.substr(pos, params.colDef.pickfield.length - pos)
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
        
        let pos = params.colDef.pickfield.lastIndexOf("_") + 1;
        let policyname = params.colDef.pickfield.substr(pos, params.colDef.pickfield.length - pos)
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
      rendervalues = ['Upper_Limit_HMAX', 'Lower_Limit_HMAX', 'Deduct_HMAX','Premium_HMAX','Price_Pct_HMAX']
      //HMAX
    }
    if (value == "SCO") { //these values are Suffixed rather than prefixed
      //HMAX
      rendervalues = ['Upper_Limit_SCO','Yield_SCO','Premium_SCO']
      //HMAX
    }
    if (value == "STAX") {
      rendervalues = ['Upper_Limit_STAX', 'Yield_STAX','Prot_Factor_STAX','Yield_Pct_STAX','Premium_STAX']
    }
    if (value == "RAMP") {
      rendervalues = ['Upper_Limit_RAMP', 'Lower_Limit_RAMP', 'Price_Pct_RAMP', 'Liability_RAMP','Premium_RAMP']
    }
    if (value == "ICE") {
      rendervalues = ['Upper_Level_ICE','Lower_Level_ICE','Premium_ICE','Deduct_ICE']
    }
    if (value == "ABC") {
      rendervalues = ['Upper_Limit_ABC', 'Lower_Limit_ABC','Premium_ABC']
    }
    if (value == "PCI") {
      rendervalues = ['FCMC_PCI','Premium_PCI']
    }
    if (value == "CROPHAIL") {
      rendervalues = ['Upper_Limit_CROPHAIL','Price_Pct_CROPHAIL', 'Liability_CROPHAIL', 'Deduct_CROPHAIL','Premium_CROPHAIL']
    }

    rendervalues.forEach(element => {
      if (this.columnDefs.find(p => p.pickfield == element) == undefined)
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
    if (type == "CROPHAIL") {
      return { values: ['Basic', 'Prod Plan', 'Comp Plan'] };
    }
  }

  
  GetMPCIPlanSubType(type: string): any {
    if (type == "MPCI") {
      return { values: ['CAT', 'YP', 'RP-HPE', 'RP', 'ARH'] };
    }
  }
  getAIPs(): any {
    return { values: ['ADM', 'AFBIS', 'ARMTECH'] };
  }
  getAgents(): any {
    
    let ret = this.loanobj.Association.filter(p=>p.ActionStatus!=3 && p.Assoc_Type_Code=="AGT");
    let obj: any[] = [];
    ret.forEach((element: any) => {
      obj.push({ key: element.Assoc_ID, value: element.Assoc_Name.toString() });
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
  public components;
  public loanobj: loan_model;
  public rowClassRules;
  public paginationPageSize;
  public paginationNumberFormatter;

  public defaultColDef ={};
  style = {
    marginTop: '10px',
    width: '93%',
    height: '366px',

  };
  public loanmodel: loan_model=null;

  public gridOptions=[];
  columnDefs: any[];
  constructor(
    private localstorage: LocalStorageService,
    private loancalculationservice: LoancalculationWorker,
    private toaster: ToastsManager,
              public logging: LoggingService,
              public alertify: AlertifyService,
              public loanapi:LoanApiService
  ) {
    this.frameworkcomponents = { 
      chipeditor: ChipsListEditor, 
      selectEditor: SelectEditor, 
      numericCellEditor: NumericEditor, 
      emptyeditor: EmptyEditor,
      columnTooltip: AgGridTooltipComponent };
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
      if(res!=null){
        
      this.loanmodel = res;
      this.declarecoldefs();
     
      
      }
    })
  }

  ngOnInit() {
    this.loanmodel = this.localstorage.retrieve(environment.loankey);
    if(this.loanmodel!=null && this.loanmodel!=undefined) //if the data is still in calculation mode and components loads before it
    {
      
    this.declarecoldefs();
   }
   
  }

  //Crops Functions
  getcropnamebyVcropid(id: number) {
    let cropname = this.refdata.CropList.find(p => p.Crop_And_Practice_ID == id).Crop_Name;
    return cropname;
  }

  getcroppracticebyVcropid(id: number) {
    let croppractice = this.refdata.CropList.find(p => p.Crop_And_Practice_ID == id).Practice_type_code;
    return croppractice;
  }
  //
  //
  //Grid Functions completed
  getgriddata() {
    //Get localstorage first
    this.rowData = [];

    if (this.loanmodel != null) {
      let insurancepolicies = this.loanmodel.InsurancePolicies;
      insurancepolicies.forEach(item => {

        let row: any = {};
        row.mainpolicyId = item.Policy_id;
        row.Agent_Id = item.Agent_Id;
        row.ProposedAIP = item.ProposedAIP;
        row.ActionStatus=item.ActionStatus;
        row.StateandCountry = lookupStateValueinRefobj(item.State_Id) + "|" + lookupCountyValue(item.County_Id);
        row.CropName = this.getcropnamebyVcropid(item.Crop_Practice_Id);
        row.Practice = this.getcroppracticebyVcropid(item.Crop_Practice_Id);
        row.MPCI_Subplan = item.MPCI_Subplan;
        row.SecInsurance = _.uniqBy(item.Subpolicies.filter(p=>p.ActionStatus!=3),"Ins_Type").map(p => p.Ins_Type).join(',');
        row.Unit = item.Unit;
        row.Level = item.Level;
        row.Price = item.Price;
        row.Premium = item.Premium;
        item.Subpolicies.filter(p=>p.ActionStatus!=3).forEach(policy => {
          //debugger
          var newsubcol = policy.Ins_Type.toString() + "_Subtype";
          row[policy.Ins_Type.toString() + "_st"] = policy.Ins_SubType;
          if (this.columnDefs.find(p => p.pickfield == newsubcol) == undefined) {
             
            this.columnDefs.push({
              headerName: newsubcol,pickfield:newsubcol, field: policy.Ins_Type + "_st", editable: true, cellEditorParams: this.getsubtypeforinsurance(policy.Ins_Type),
              cellEditorSelector: function (params) {

                let column = params.colDef.pickfield.split('_')[0];
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
                let column = params.colDef.pickfield.split('_')[0];
                if (!params.data.SecInsurance.includes(column)) {
                  return 'grayedcell';
                }
              }
            })
          }
          let renderedvalues = this.ShowHideColumnsonselection(policy.Ins_Type);
          
          renderedvalues.forEach(element => {
            let tobindcol = element.toString().replace("_" + policy.Ins_Type, "");
            row[element] = policy[tobindcol];
            row.ActionStatus=policy.ActionStatus;
          });
        });

        this.rowData.push(row);
      })

    }
  }

  //DB Operations

  updatelocalloanobject(event: any): any {
    
    if (event.colDef.pickfield.includes("_")) {
      let pos = event.colDef.pickfield.lastIndexOf("_") + 1;
      let policyname = event.colDef.pickfield.substr(pos, event.colDef.pickfield.length - pos)
      if(event.colDef.pickfield.includes("Subtype"))
      {
        policyname = event.colDef.pickfield.substr(0, pos-1)
      }
      let replacer=event.colDef.pickfield.replace("_" + policyname, "");
      if(event.colDef.pickfield.includes("Subtype"))
      {
        replacer = "Ins_SubType";
      }
      let policy = this.loanmodel.InsurancePolicies[event.rowIndex].Subpolicies.find(p => p.Ins_Type == policyname && p.ActionStatus!=3);
      if(isNaN(event.value))
      policy[replacer] = event.value;
      else
      policy[replacer] = parseFloat(event.value);
      if( policy.ActionStatus!=1 && policy.ActionStatus!=1){ 
        policy.ActionStatus=2;
      }
    }
    else {
      this.loanmodel.InsurancePolicies[event.rowIndex][event.colDef.field] = event.value;
      this.loanmodel.InsurancePolicies[event.rowIndex].ActionStatus=2;
    }
    
    this.loancalculationservice.performcalculationonloanobject(this.loanmodel);
  }



  syncenabled() {
    return false;
  }

 

  rowvaluechanged($event) {
    debugger
    var items = $event.data.SecInsurance.toString().split(",");
    // Options
    if ($event.data.SecInsurance != "" && $event.colDef.field == "SecInsurance") {
       
      
      items.forEach(element => {
        if (this.columnDefs.find(p => p.pickfield.split('_')[0] == element) == undefined) {
          this.ShowHideColumnsonselection(element)
          this.columnDefs.push({
            headerName: element + '_Subtype', pickfield:element + '_Subtype', field: element + "_st", editable: true, cellEditorParams: this.getsubtypeforinsurance(element),
            cellEditorSelector: function (params) {
              
              let column = params.colDef.pickfield.split('_')[0];
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
              let column = params.colDef.pickfield.split('_')[0];
              if (!params.data.SecInsurance.includes(column)) {
                return 'grayedcell';
              }
            }
          })
        }
        let mainobj=this.loanmodel.InsurancePolicies.find(p=>p.Policy_id==$event.data.mainpolicyId);
        if(mainobj.Subpolicies.find(p=>p.Ins_Type==element && p.ActionStatus!=3)==undefined){
          let sp:Insurance_Subpolicy=new Insurance_Subpolicy();
          sp.FK_Policy_Id=$event.data.mainpolicyId;
          sp.ActionStatus=1;
          sp.SubPolicy_Id=0;
          sp.Ins_Type=element;
          mainobj.Subpolicies.push(sp);
        }
      
      });
       
     
      
      //Delete unwanted Column here
     
      
      //this.gridApi.ensureColumnVisible(this.columnDefs[this.columnDefs.length - 1].field)
    }
    let mainobj=this.loanmodel.InsurancePolicies.find(p=>p.Policy_id==$event.data.mainpolicyId);
    mainobj.Subpolicies.forEach(eelement => {
      if(items.find(p=>p==eelement.Ins_Type)==undefined){
         eelement.ActionStatus=3;
      }
    });
    //get the local loan object synced
    this.deleteunwantedcolumn();
    this.gridApi.setColumnDefs(this.columnDefs);
    this.updatelocalloanobject($event);
    this.updateSyncStatus();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;

    //params.api.sizeColumnsToFit();//autoresizing
    this.getgriddata();
  }
  //Grid Functions End
  synctoDb() {
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
    })


  }

  //update Loan Status
  updateSyncStatus() {
      
     
    if (this.checkforstatus([1,3]) ) {
      this.syncInsuranceStatus = status.ADDORDELETE;
    } else if (this.checkforstatus([2])) {
      this.syncInsuranceStatus = status.EDITED;
    } else {
      this.syncInsuranceStatus = status.NOCHANGE;
    }
    this.loanmodel.SyncStatus.Status_Insurance_Policies = this.syncInsuranceStatus;
  }

  checkforstatus(statuscode:Array<number>){
    
    
    var status=false;
    statuscode.forEach(element => {
      if(!status)
      {
      status = this.loanmodel.InsurancePolicies.filter(p => p.ActionStatus == element).length>0;
      this.loanmodel.InsurancePolicies.forEach(element1 => {
        if(!status)
         status = element1.Subpolicies.filter(p => p.ActionStatus == element).length>0
      });
    }
     });
     return status;
  }

  onGridSizeChanged(params) {
    //params.api.sizeColumnsToFit();
    params.api.resetRowHeights();
  }

  onGridScroll(params) {
    //params.api.stopEditing();
  }
}
