import { Component, OnInit, Input } from '@angular/core';
import { loan_model, Loan_Budget, Loan_Crop_Practice } from '../../../models/loanmodel';
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
import { textValueSetter, getTextCellEditor } from '../../../Workers/utility/aggrid/textboxes';
import { BudgetHelperService } from '../budget-helper.service';
import { PriceFormatter } from '../../../Workers/utility/aggrid/formatters';
/// <reference path="../../../Workers/utility/aggrid/numericboxes.ts" />
@Component({
  selector: 'app-loanbudget',
  templateUrl: './loanbudget.component.html',
  styleUrls: ['./loanbudget.component.scss']
})
export class LoanbudgetComponent implements OnInit {


  @Input() cropPractice: Loan_Crop_Practice;
  columnDefs: Array<any>;
  rowData: Array<any>;
  private gridApi;
  private columnApi;
  public getRowStyle;
  public pinnedBottomRowData;
  private components;
  private localLoanObject: loan_model;


  constructor(private localStorageService: LocalStorageService,
    private budgetService: BudgetHelperService,
    private loanserviceworker: LoancalculationWorker) {

    this.components = { numericCellEditor: getNumericCellEditor(), textCellEditor: getTextCellEditor() };
  }


  ngOnInit() {
    const totalRowHeader= 'Total'; // is used to check if the current row should be editable or not
    
    this.columnDefs = [

      { headerName: 'Expense', field: 'FC_Expense_Name', editable: false },
      {
        headerName: "Per Acre Budget",
        children: [
          { headerName: 'ARM', field: 'ARM_Budget_Acre', width: 120,  cellEditor: "numericCellEditor", cellClass: ['editable-color-not-important','text-right'], valueSetter: numberValueSetter,
          valueFormatter: function (params) {
            return PriceFormatter(params.value);
          },
          editable : (params)=>{
           return params.data.FC_Expense_Name !== totalRowHeader+':';
          } },
          { headerName: 'Distributer', field: 'Distributor_Budget_Acre', width: 120, cellEditor: "numericCellEditor", valueSetter: numberValueSetter, cellClass: ['editable-color-not-important','text-right'],
          valueFormatter: function (params) {
            return PriceFormatter(params.value);
          },
          editable : (params)=>{
           return params.data.FC_Expense_Name !== totalRowHeader+':';
          } },
          { headerName: '3rd Party', field: 'Third_Party_Budget_Acre', width: 120,  cellEditor: "numericCellEditor", valueSetter: numberValueSetter, cellClass: ['editable-color-not-important','text-right'], 
          valueFormatter: function (params) {
            return PriceFormatter(params.value);
          },
          editable : (params)=>{
           return params.data.FC_Expense_Name !== totalRowHeader+':';
          } },
          { headerName: totalRowHeader, field: 'Total_Budget_Acre', width: 120, editable: false, cellClass: ['text-right'],
          valueFormatter: function (params) {
            return PriceFormatter(params.value);
          } },
        ]
      },
      {
        headerName: "Crop Budget",
        children: [
          { headerName: 'ARM', field: 'ARM_Budget_Crop', cellClass: ['text-right'], editable: false, 
          valueFormatter: function (params) {
            return PriceFormatter(params.value);
          } },
          { headerName: 'Distributer', field: 'Distributor_Budget_Crop', editable: false, cellClass: ['text-right'],
          valueFormatter: function (params) {
            return PriceFormatter(params.value);
          } },
          { headerName: '3rd Party', field: 'Third_Party_Budget_Crop', editable: false,cellClass: ['text-right'], 
          valueFormatter: function (params) {
            return PriceFormatter(params.value);
          } },
          { headerName: 'Total', field: 'Total_Budget_Crop_ET', editable: false, cellClass: ['text-right'], 
          valueFormatter: function (params) {
            return PriceFormatter(params.value);
          } },
        ]
      }
    ];



    this.getRowStyle = function (params) {
      if (params.node.rowPinned) {
        return { "font-weight": "bold", "background-color": "#F5F7F7" };
      }
    };

    //TODO-SANKET can we have obsever one level up instead of for each cropPractice ?
    this.localStorageService.observe(environment.loankey).subscribe(res => {
      this.localLoanObject = res;
      
      this.bindData(this.localLoanObject);
    })

    this.localLoanObject = this.localStorageService.retrieve(environment.loankey);

    this.bindData(this.localLoanObject);



  }

  style = {
    marginTop: '10px',
    width: '96%',
    height: '240px',
    boxSizing: 'border-box'
  };

  bindData(localLoanObject: loan_model) {
    let lstLoanBudget = localLoanObject.LoanBudget;
    debugger;
    if (localLoanObject.srccomponentedit === "LoanBudgetComponent"+this.cropPractice.Crop_Practice_ID) {
      //if the same table invoked the change .. change only the edited row
     // let budget = lstLoanBudget.filter(budget=> budget.Crop_Practice_ID === this.cropPractice.Crop_Practice_ID)[localLoanObject.lasteditrowindex];
      // this.budgetService.getLoanBudgetForCropPractice(loanBudget, this.cropPractice.Crop_Practice_ID, this.cropPractice.LCP_Acres)[localLoanObject.lasteditrowindex];
     // budget = this.budgetService.multiplyPropsWithAcres(budget, this.cropPractice.LCP_Acres);
      this.rowData[localLoanObject.lasteditrowindex]  = lstLoanBudget.filter(budget=> budget.Crop_Practice_ID === this.cropPractice.Crop_Practice_ID)[localLoanObject.lasteditrowindex];
      
    }
    else {
      this.rowData = [];
      this.rowData = localLoanObject.LoanCropUnits !== null ? this.budgetService.getLoanBudgetForCropPractice(lstLoanBudget, this.cropPractice.Crop_Practice_ID, this.cropPractice.LCP_Acres):[];
    }
    //this.rowData =this.budgetService.getLoanBudgetForCropPractice(loanBudget, this.cropPractice.Crop_Practice_ID, this.cropPractice.LCP_Acres);
    this.pinnedBottomRowData = this.budgetService.getTotals(this.rowData);
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;

    params.api.sizeColumnsToFit();
    this.getgridheight();
  }

  rowvaluechanged(value: any) {
    let budget = this.localLoanObject.LoanBudget.find(budget => budget.Loan_Budget_ID === value.data.Loan_Budget_ID);
    budget.Total_Budget_Acre = parseFloat(budget.ARM_Budget_Acre.toString()) + parseFloat(budget.Distributor_Budget_Acre.toString()) + parseFloat(budget.Third_Party_Budget_Acre.toString());

    for(let i = 0; i<this.localLoanObject.LoanBudget.length;i++){
      let currentBudget =   this.localLoanObject.LoanBudget[i];
      let cropPractice = this.localLoanObject.LoanCropPractices.find(cp=>cp.Crop_Practice_ID === currentBudget.Crop_Practice_ID);
      currentBudget = this.budgetService.multiplyPropsWithAcres(currentBudget, cropPractice.LCP_Acres);
    }
    //budget = this.budgetService.multiplyPropsWithAcres(budget, this.cropPractice.LCP_Acres);
    //this.localLoanObject = this.budgetService.caculateTotalsBeforeStore(this.localLoanObject);
     budget.ActionStatus = 2;

    let cropPractice = this.localLoanObject.LoanCropPractices.find(cp => cp.Crop_Practice_ID === this.cropPractice.Crop_Practice_ID);
    cropPractice = this.budgetService.populateTotalsInCropPractice(cropPractice, this.localLoanObject.LoanBudget);

    //this shall have the last edit
    this.localLoanObject.srccomponentedit = "LoanBudgetComponent"+this.cropPractice.Crop_Practice_ID;
    this.localLoanObject.lasteditrowindex = value.rowIndex;
    this.loanserviceworker.performcalculationonloanobject(this.localLoanObject);
  }

  //   synctoDb() {

  //   this.loanapi.syncloanobject(this.localloanobject).subscribe(res=>{
  //     if(res.ResCode==1){
  //      this.loanapi.getLoanById(this.localloanobject.Loan_Full_ID).subscribe(res => {

  //        this.logging.checkandcreatelog(3,'Overview',"APi LOAN GET with Response "+res.ResCode);
  //        if (res.ResCode == 1) {
  //          this.toaster.success("Records Synced");
  //          let jsonConvert: JsonConvert = new JsonConvert();
  //          this.loanserviceworker.performcalculationonloanobject(jsonConvert.deserialize(res.Data, loan_model));
  //        }
  //        else{
  //          this.toaster.error("Could not fetch Loan Object from API")
  //        }
  //      });
  //     }
  //     else{
  //       this.toaster.error("Error in Sync");
  //     }
  //   })







  //   public refdata: any = {};
  //   indexsedit = [];
  //   public columnDefs = [];
  //   private localloanobject: loan_model = new loan_model();
  //   public syncenabled = true;
  //   // Aggrid
  //   public rowData = new Array<Loan_Budget>();
  //   public components;
  //   public context;
  //   public frameworkcomponents;
  //   public editType;
  //   public pinnedBottomRowData :any;

  //   public getRowStyle;
  //   public cellStyle;

  //   public cellPrevValue;

  //   //region Ag grid Configuration


  //   returncountylist() {
  //     return this.refdata.CountyList;
  //   }




  //   //End here
  //   // Aggrid ends
  //   constructor(public localstorageservice: LocalStorageService,
  //     public loanserviceworker: LoancalculationWorker,
  //     public insuranceservice: InsuranceapiService,
  //     private toaster: ToastsManager,
  //     public logging: LoggingService,
  //     public alertify: AlertifyService,
  //     public loanapi:LoanApiService
  //   ) {
  //     this.frameworkcomponents = { selectEditor: SelectEditor, deletecolumn: DeleteButtonRenderer };
  //     this.components = { numericCellEditor: getNumericCellEditor(),textCellEditor:getTextCellEditor() };

  //     this.refdata = this.localstorageservice.retrieve(environment.referencedatakey);
  //     this.localloanobject = this.localstorageservice.retrieve(environment.loankey);
  //     //Coldef here

  //     this.columnDefs = [

  //       { headerName: 'Expense', field: 'FC_Expense_Name',  editable: false },   
  //       { headerName: "Per Acre Budget",
  //         children: [   
  //       { headerName: 'ARM', field: 'ARM_Budget_Acre', width:120,  editable: true , cellEditor: "textCellEditor",cellClass: changeCellStyle  },
  //       { headerName: 'Distributer', field: 'Distributor_Budget_Acre', width:120,  editable: true,cellEditor: "numericCellEditor", valueSetter: numberValueSetter,cellClass: ['lenda-editable-field'] },
  //       { headerName: '3rd Party', field: 'Third_Party_Budget_Acre',width:120,  editable: true,cellEditor: "numericCellEditor", valueSetter: numberValueSetter,cellClass: ['lenda-editable-field'] },
  //       { headerName: 'Total', field: 'Total_Budget_Acre',width:120, editable: false},
  //         ]},
  //       { headerName: "Crop Budget",
  //         children: [   
  //       { headerName: 'ARM', field: 'ARM_Budget_Crop',  editable: false },
  //       { headerName: 'Distributer', field: 'Distributor_Budget_Crop',   editable: false },
  //       { headerName: '3rd Party', field: 'Third_Party_Budget_Crop',  editable: false },
  //       { headerName: 'Total', field: 'Total_Budget_Crop_ET', editable: false},
  //        ]}
  //     ];
  //     ///
  //     this.context = { componentParent: this };
  //     this.getRowStyle = function(params) {
  //         if (params.node.rowPinned) {
  //           return { "font-weight": "bold","background-color":"#F5F7F7" };
  //         }
  //       };
  //     this.pinnedBottomRowData = FooterData(1, "Bottom");
  //     this.cellStyle = function(params) {
  //       if (params.node.rowPinned) {
  //         return { "font-weight": "bold","background-color":"#F5F7F7" };
  //       }
  //     };
  //   }
  //   ngOnInit() {  

  //     this.localstorageservice.observe(environment.loankey).subscribe(res => {
  //       this.logging.checkandcreatelog(1, 'LoanAgents', "LocalStorage updated");
  //       this.localloanobject = res;


  //       //if (this.localloanobject != null && this.localloanobject != undefined && this.localloanobject.LoanBudget!=null && this.localloanobject.LoanBudget!=undefined) {
  //       // this.rowData = this.localloanobject.LoanBudget.filter(p => p.ActionStatus != -1 && p.Crop_Code==this.budgetobject.CropType && p.Crop_Practice_Type_Code==this.budgetobject.Practice );
  //       // this.GetTotals();
  //       }
  //     });


  //     // this.getdataforgrid();
  //     // this.editType = "fullRow";
  //   }
  //   getdataforgrid() {
  //     this.logging.checkandcreatelog(1, 'LoanAgents', "LocalStorage retrieved");
  //     if (this.localloanobject != null && this.localloanobject != undefined && this.localloanobject.LoanBudget!=null && this.localloanobject.LoanBudget!=undefined) {
  //       if (this.localloanobject != null && this.localloanobject != undefined && this.localloanobject.LoanBudget!=null && this.localloanobject.LoanBudget!=undefined) {
  //       this.rowData = this.localloanobject.LoanBudget.filter(p => p.ActionStatus != -1 && p.Crop_Code==this.cropPractices.CropType && p.Crop_Practice_Type_Code==this.cropPractices.Practice );
  //       this.GetTotals();
  //       }
  //     }
  //   }
  //   cellvaluechanged(value: any) {

  //   }

  //   rowvaluechanged(value: any) {

  //     var obj = value.data;
  //     if (obj.ActionStatus == undefined) {
  //       obj.ActionStatus = 1;
  //       obj.Assoc_ID=0;  
  //       var rowIndex=this.localloanobject.LoanBudget.length;
  //       this.localloanobject.LoanBudget[rowIndex]=value.data;
  //     }
  //     else {
  //       var rowindex=this.localloanobject.LoanBudget.filter(p => p.ActionStatus != -1 ).findIndex(p=>p.Assoc_ID==obj.Assoc_ID);
  //       obj.ActionStatus = 2;
  //       this.localloanobject.LoanBudget.filter(p => p.ActionStatus != -1 )[rowindex]=obj;
  //     }

  //     this.loanserviceworker.performcalculationonloanobject(this.localloanobject);
  //   }

  //   synctoDb() {

  //   this.loanapi.syncloanobject(this.localloanobject).subscribe(res=>{
  //     if(res.ResCode==1){
  //      this.loanapi.getLoanById(this.localloanobject.Loan_Full_ID).subscribe(res => {

  //        this.logging.checkandcreatelog(3,'Overview',"APi LOAN GET with Response "+res.ResCode);
  //        if (res.ResCode == 1) {
  //          this.toaster.success("Records Synced");
  //          let jsonConvert: JsonConvert = new JsonConvert();
  //          this.loanserviceworker.performcalculationonloanobject(jsonConvert.deserialize(res.Data, loan_model));
  //        }
  //        else{
  //          this.toaster.error("Could not fetch Loan Object from API")
  //        }
  //      });
  //     }
  //     else{
  //       this.toaster.error("Error in Sync");
  //     }
  //   })


  //   }

  //   //Grid Events
  //   addrow() {

  //     var newItem = new Loan_Budget();
  //     newItem.Loan_Full_ID=this.localloanobject.Loan_Full_ID;  
  //     var res = this.rowData.push(newItem);
  //     this.gridApi.updateRowData({ add: [newItem] });
  //     this.gridApi.startEditingCell({
  //       rowIndex: this.rowData.length-1,
  //       colKey: "Assoc_Name"
  //     });
  //     this.localloanobject.LoanBudget.push(newItem);
  //   }

  //   DeleteClicked(rowIndex: any) {

  //     this.alertify.confirm("Confirm", "Do you Really Want to Delete this Record?").subscribe(res => {
  //       if (res == true) {

  //         var obj = this.localloanobject.LoanBudget.filter(p => p.ActionStatus != -1 )[rowIndex];
  //         if (obj.Assoc_ID == 0) {
  //             var data=this.localloanobject.LoanBudget.filter(p => p.ActionStatus != -1 );
  //           this.localloanobject.LoanBudget.filter(p => p.ActionStatus != -1 ).splice(rowIndex, 1);
  //         }
  //         else {
  //           obj.ActionStatus = -1;
  //         }
  //         this.loanserviceworker.performcalculationonloanobject(this.localloanobject);
  //       }
  //     })

  //   }


  //   GetTotals()
  //   {

  //     this.pinnedBottomRowData[0].ARM_Budget_Acre=this.localloanobject.LoanBudget.map(c => parseFloat(c.ARM_Budget_Acre||'0')).reduce((sum, current) => sum +current);
  //     this.pinnedBottomRowData[0].Third_Party_Budget_Acre=this.localloanobject.LoanBudget.map(c => parseFloat( c.Third_Party_Budget_Acre||'0')).reduce((sum, current) => sum + current);
  //     this.pinnedBottomRowData[0].BudgetTotal_Acre=this.localloanobject.LoanBudget.map(c => parseFloat( c.BudgetTotal_Acre||'0')).reduce((sum, current) => sum + current);
  //     this.pinnedBottomRowData[0].ARM_Budget_Crop=this.localloanobject.LoanBudget.map(c => parseFloat( c.ARM_Budget_Crop||'0')).reduce((sum, current) => sum + current);
  //     this.pinnedBottomRowData[0].Third_Party_Budget_Crop=this.localloanobject.LoanBudget.map(c => parseFloat( c.Third_Party_Budget_Crop||'0')).reduce((sum, current) => sum + current);
  //     this.pinnedBottomRowData[0].BudgetTotal_Crop=this.localloanobject.LoanBudget.map(c => parseFloat( c.BudgetTotal_Crop||'0')).reduce((sum, current) => sum + current);

  //     this.pinnedBottomRowData[0].Distributor_Budget_Acre=this.localloanobject.LoanBudget.map(c => parseFloat(c.Distributor_Budget_Acre||'0')).reduce((sum, current) => sum + current);
  //     this.pinnedBottomRowData[0].Distributor_Budget_Crop=this.localloanobject.LoanBudget.map(c => parseFloat(c.Distributor_Budget_Crop||'0')).reduce((sum, current) => sum + current);


  //   }
  //   //
  getgridheight() {
    this.style.height = (29 * (this.rowData.length + 3)).toString() + "px";
  }
  // }


  // function FooterData(count, prefix) {
  //   var result = [];
  //   for (var i = 0; i < count; i++) {
  //     result.push({
  //       Budget_Expense_Name:'Total:',
  //       ARM_Budget_Acre: 0,
  //       Third_Party_Budget_Acre:  0,
  //       BudgetTotal_Acre:  0  ,
  //       ARM_Budget_Crop: 0,
  //       Third_Party_Budget_Crop:  0,
  //       BudgetTotal_Crop:  0  ,
  //     });
  //   }
  //   return result;
  // }


  //  function changeCellStyle(params) {

  //  //alert(params.api.valueCache.cacheVersion);
  // if(params.api.valueCache.cacheVersion>1){
  //   return {
  //       backgroundColor: 'yellow'
  //   }
  // }else{
  //   return {
  //   color:'blue'
  //   }
  // }


  // if(params.newValue==undefined || params.newValue==null||params.newValue=="") { 
  //   return params.value === "" ? "error" : "lenda-editable-field";
  //  }

}



