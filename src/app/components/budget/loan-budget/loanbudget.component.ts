import { Component, OnInit, Input } from '@angular/core';
import { loan_model, Loan_Budget } from '../../../models/loanmodel';
import { LocalStorageService } from 'ngx-webstorage';
import { LoancalculationWorker } from '../../../Workers/calculations/loancalculationworker';
import { ToastsManager } from 'ng2-toastr';
import { LoggingService } from '../../../services/Logs/logging.service';
import { environment } from '../../../../environments/environment';
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
  selector: 'app-loanbudget',
  templateUrl: './loanbudget.component.html',
  styleUrls: ['./loanbudget.component.scss']
})
export class LoanbudgetComponent implements OnInit {

   
    @Input() budgetobject : any;

  public refdata: any = {};
  indexsedit = [];
  public columnDefs = [];
  private localloanobject: loan_model = new loan_model();
  public syncenabled = true;
  // Aggrid
  public rowData = new Array<Loan_Budget>();
  public components;
  public context;
  public frameworkcomponents;
  public editType;
  public pinnedBottomRowData :any;
  private gridApi;
  private columnApi;
  public getRowStyle;
  //region Ag grid Configuration


  returncountylist() {
    return this.refdata.CountyList;
  }


  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;

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
        
      { headerName: 'Expense', field: 'Budget_Expense_Name', width:220,  editable: false },   
      { headerName: "Per Acre Budget",
        children: [   
      { headerName: 'ARM', field: 'ARM_Budget_Acre', width:120,  editable: true },
      { headerName: '3rd Party', field: 'Third_Party_Budget_Acre',width:120,  editable: true },
      { headerName: 'Total', field: 'BudgetTotal_Acre',width:120, editable: false},
        ]},
      { headerName: "Crop Budget",
        children: [   
      { headerName: 'ARM', field: 'ARM_Budget_Crop',width:120,  editable: false },
      { headerName: '3rd Party', field: 'Third_Party_Budget_Crop',width:120,  editable: false },
      { headerName: 'Total', field: 'BudgetTotal_Crop',width:120, editable: false},
       ]}
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
      this.logging.checkandcreatelog(1, 'LoanAgents', "LocalStorage updated");
      this.localloanobject = this.localstorageservice.retrieve(environment.loankey);
      
      //this.rowData = obj.Association.filter(p => p.ActionStatus != -1);
      this.rowData = this.localloanobject.LoanBudget.filter(p => p.ActionStatus != -1 && p.Crop_Code==this.budgetobject.CropType && p.Crop_Practice_Type_Code==this.budgetobject.Practice );
      this.GetTotals();
    });
  

    this.getdataforgrid();
    this.editType = "fullRow";
  }
  getdataforgrid() {
   // let obj: loan_model = this.localstorageservice.retrieve(environment.loankey);
    this.logging.checkandcreatelog(1, 'LoanAgents', "LocalStorage retrieved");
    //if (obj != null && obj != undefined) {
    if (this.localloanobject != null && this.localloanobject != undefined) {
      //this.localloanobject = obj;
      
      this.rowData = this.localloanobject.LoanBudget.filter(p => p.ActionStatus != -1 && p.Crop_Code==this.budgetobject.CropType && p.Crop_Practice_Type_Code==this.budgetobject.Practice );
      this.GetTotals();
    }
  }


  rowvaluechanged(value: any) {
    debugger
    var obj = value.data;
    if (obj.ActionStatus == undefined) {
      obj.ActionStatus = 1;
      obj.Assoc_ID=0;  
      var rowIndex=this.localloanobject.LoanBudget.length;
      this.localloanobject.LoanBudget[rowIndex]=value.data;
    }
    else {
      var rowindex=this.localloanobject.LoanBudget.filter(p => p.ActionStatus != -1 ).findIndex(p=>p.Assoc_ID==obj.Assoc_ID);
      obj.ActionStatus = 2;
      this.localloanobject.LoanBudget.filter(p => p.ActionStatus != -1 )[rowindex]=obj;
    }
    debugger
    this.loanserviceworker.performcalculationonloanobject(this.localloanobject);
  }

  synctoDb() {
      debugger
  this.loanapi.syncloanobject(this.localloanobject).subscribe(res=>{
    if(res.ResCode==1){
     this.loanapi.getLoanById(this.localloanobject.Loan_PK_ID).subscribe(res => {
       
       this.logging.checkandcreatelog(3,'Overview',"APi LOAN GET with Response "+res.ResCode);
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
  })


  }

  //Grid Events
  addrow() {
    debugger    
    var newItem = new Loan_Budget();
    newItem.Loan_ID=this.localloanobject.Loan_PK_ID;  
    var res = this.rowData.push(newItem);
    this.gridApi.updateRowData({ add: [newItem] });
    this.gridApi.startEditingCell({
      rowIndex: this.rowData.length-1,
      colKey: "Assoc_Name"
    });
    this.localloanobject.LoanBudget.push(newItem);
  }

  DeleteClicked(rowIndex: any) {
    debugger
    this.alertify.confirm("Confirm", "Do you Really Want to Delete this Record?").subscribe(res => {
      if (res == true) {
        debugger
        var obj = this.localloanobject.LoanBudget.filter(p => p.ActionStatus != -1 )[rowIndex];
        if (obj.Assoc_ID == 0) {
            var data=this.localloanobject.LoanBudget.filter(p => p.ActionStatus != -1 );
          this.localloanobject.LoanBudget.filter(p => p.ActionStatus != -1 ).splice(rowIndex, 1);
        }
        else {
          obj.ActionStatus = -1;
        }
        this.loanserviceworker.performcalculationonloanobject(this.localloanobject);
      }
    })

  }


  GetTotals()
  {
    this.pinnedBottomRowData[0].ARM_Budget_Acre=this.localloanobject.LoanBudget.map(c => c.ARM_Budget_Acre).reduce((sum, current) => sum + current);
    this.pinnedBottomRowData[0].Third_Party_Budget_Acre=this.localloanobject.LoanBudget.map(c => c.Third_Party_Budget_Acre).reduce((sum, current) => sum + current);
    this.pinnedBottomRowData[0].BudgetTotal_Acre=this.localloanobject.LoanBudget.map(c => c.BudgetTotal_Acre).reduce((sum, current) => sum + current);
    this.pinnedBottomRowData[0].ARM_Budget_Crop=this.localloanobject.LoanBudget.map(c => c.ARM_Budget_Crop).reduce((sum, current) => sum + current);
    this.pinnedBottomRowData[0].Third_Party_Budget_Crop=this.localloanobject.LoanBudget.map(c => c.Third_Party_Budget_Crop).reduce((sum, current) => sum + current);
    this.pinnedBottomRowData[0].BudgetTotal_Crop=this.localloanobject.LoanBudget.map(c => c.BudgetTotal_Crop).reduce((sum, current) => sum + current);

  }
  //
}


function FooterData(count, prefix) {
  var result = [];
  for (var i = 0; i < count; i++) {
    result.push({
      Budget_Expense_Name:'Total:',
      ARM_Budget_Acre: 0,
      Third_Party_Budget_Acre:  0,
      BudgetTotal_Acre:  0  ,
      ARM_Budget_Crop: 0,
      Third_Party_Budget_Crop:  0,
      BudgetTotal_Crop:  0  ,
    });
  }
  return result;
}


