import { Component, OnInit, Input } from '@angular/core';
import { loan_model, Loan_Budget } from '../../../models/loanmodel';
import { LocalStorageService } from 'ngx-webstorage';
import { LoancalculationWorker } from '../../../Workers/calculations/loancalculationworker';
import { ToastsManager } from 'ng2-toastr';
import { LoggingService } from '../../../services/Logs/logging.service';
import { environment } from '../../../../environments/environment.prod';
import { modelparserfordb } from '../../../Workers/utility/modelparserfordb';
import { Loan_Farm } from '../../../models/farmmodel.';
import { InsuranceapiService } from '../../../services/insurance/insuranceapi.service';
import { numberValueSetter, getNumericCellEditor } from '../../../Workers/utility/aggrid/numericboxes';
import { extractStateValues, lookupStateValue, Statevaluesetter, extractCountyValues, lookupCountyValue, Countyvaluesetter, getfilteredcounties } from '../../../Workers/utility/aggrid/stateandcountyboxes';
import { SelectEditor } from '../../../aggridfilters/selectbox';
import { DeleteButtonRenderer } from '../../../aggridcolumns/deletebuttoncolumn';
import { AlertifyService } from '../../../alertify/alertify.service';
import { LoanApiService } from '../../../services/loan/loanapi.service';
import { JsonConvert } from 'json2typescript';
/// <reference path="../../../Workers/utility/aggrid/numericboxes.ts" />
@Component({
  selector: 'app-loanbudget-group',
  templateUrl: './loanbudgetgroup.component.html',
  styleUrls: ['./loanbudgetgroup.component.scss']
})
export class LoanbudgetGroupComponent implements OnInit {

   
    @Input() budgetobject : any;

  public refdata: any = {};
  indexsedit = [];
  public columnDefs = [];
  private localloanobject: loan_model = new loan_model();
  public syncenabled = true;
  // Aggrid
  public rowDataGroup = new Array<Loan_Budget>();
  public components;
  public context;
  public frameworkcomponents;
  public editType;
  public pinnedBottomRowData: any;
  private gridApi;
  private columnApi;
  public getRowStyle;
  private pinnedTopRowData;  
  style = {
    marginTop: '10px',
    width: '96%',
    height: '240px',
    boxSizing: 'border-box'
  };
  //region Ag grid Configuration


  returncountylist() {
    return this.refdata.CountyList;
  }


  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    params.api.sizeColumnsToFit();
    this.getgridheight();
  }
  //End here
  // Aggrid ends
  constructor(public localstorageservice: LocalStorageService,
    public loanserviceworker: LoancalculationWorker,
    public insuranceservice: InsuranceapiService,
    private toaster: ToastsManager,
    public logging: LoggingService,
    public alertify: AlertifyService,
    public loanapi:LoanApiService
  ) {
    this.frameworkcomponents = { selectEditor: SelectEditor, deletecolumn: DeleteButtonRenderer };
    this.components = { numericCellEditor: getNumericCellEditor() };
    
    this.refdata = this.localstorageservice.retrieve(environment.referencedatakey);
    this.localloanobject = this.localstorageservice.retrieve(environment.loankey);
    //Coldef here
    
    this.columnDefs = [        
      { headerName: 'Expense', field: 'Budget_Expense_Name',  editable: false },            
      { headerName: 'ARM', field: 'ARM_Budget_Crop', editable: false },
      { headerName: '3rd Party', field: 'Third_Party_Budget_Crop',  editable: false },
      { headerName: 'Total', field: 'BudgetTotal_Crop', editable: false},
    ];
    ///
    this.context = { componentParent: this };
    this.getRowStyle = function(params) {
      if (params.node.rowPinned) {
        return { "font-weight": "bold","background-color":"#F5F7F7" };
      }
    };
    
    this.pinnedBottomRowData = FooterData(1, "Bottom");
  }
  ngOnInit() {  

    this.localstorageservice.observe(environment.loankey).subscribe(res => {
      //this.logging.checkandcreatelog(1, 'LoanAgents', "LocalStorage updated");
      this.localloanobject = this.localstorageservice.retrieve(environment.loankey);      
      //this.rowDataGroup = obj.Association.filter(p => p.ActionStatus != -1);
      this.rowDataGroup = this.localloanobject.LoanBudget;

    });
  

    this.getdataforgrid();
    this.editType = "fullRow";
  }
  getdataforgrid() {
   // let obj: loan_model = this.localstorageservice.retrieve(environment.loankey);
    //this.logging.checkandcreatelog(1, 'LoanAgents', "LocalStorage retrieved");
    //if (obj != null && obj != undefined) {
    if (this.localloanobject != null && this.localloanobject != undefined) {
      //this.localloanobject = obj;
      this.rowDataGroup = this.localloanobject.LoanBudget;
      this.GetTotals();
    }
  }
   GetTotals()
  {
    this.pinnedBottomRowData[0].ARM_Budget_Crop=this.localloanobject.LoanBudget.map(c => parseFloat(c.ARM_Budget_Crop.toString()||'0')).reduce((sum, current) => sum + current);
    this.pinnedBottomRowData[0].Third_Party_Budget_Crop=this.localloanobject.LoanBudget.map(c => parseFloat(c.Third_Party_Budget_Crop.toString()||'0')).reduce((sum, current) => sum + current);
    //this.pinnedBottomRowData[0].BudgetTotal_Crop=this.localloanobject.LoanBudget.map(c =>parseFloat( c.BudgetTotal_Crop.toString()||'0')).reduce((sum, current) => sum + current);

  }
  getgridheight(){
    this.style.height=(29*(this.rowDataGroup.length+2)).toString()+"px";
   }
  //
}


function FooterData(count, prefix) {
  var result = [];
  for (var i = 0; i < count; i++) {
    result.push({
      Budget_Expense_Name:'Total:',
      ARM_Budget_Crop: 0,
      Third_Party_Budget_Crop:  0,
      BudgetTotal_Crop:  0    
    });
  }
  return result;
}

