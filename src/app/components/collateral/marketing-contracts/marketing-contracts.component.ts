import { Component, OnInit } from '@angular/core';
import { loan_model, Loan_Collateral, Loan_Marketing_Contract } from '../../../models/loanmodel';
import { LocalStorageService } from 'ngx-webstorage';
import { ToastsManager } from 'ng2-toastr';
import { LoancalculationWorker } from '../../../Workers/calculations/loancalculationworker';
import { CropapiService } from '../../../services/crop/cropapi.service';
import { LoggingService } from '../../../services/Logs/logging.service';
import { AlertifyService } from '../../../alertify/alertify.service';
import { LoanApiService } from '../../../services/loan/loanapi.service';
import { getNumericCellEditor, numberValueSetter } from '../../../Workers/utility/aggrid/numericboxes';
import { environment } from '../../../../environments/environment.prod';
import { SelectEditor } from '../../../aggridfilters/selectbox';
import { DeleteButtonRenderer } from '../../../aggridcolumns/deletebuttoncolumn';
import { currencyFormatter, discFormatter, insuredFormatter } from '../../../Workers/utility/aggrid/collateralboxes';
import { JsonConvert } from 'json2typescript';
import { lookupStateValue } from '../../../Workers/utility/aggrid/stateandcountyboxes';
import * as _ from 'lodash';
import { PriceFormatter, PercentageFormatter } from '../../../Workers/utility/aggrid/formatters';
import { MarketingcontractcalculationService } from '../../../Workers/calculations/marketingcontractcalculation.service';

@Component({
  selector: 'app-marketing-contracts',
  templateUrl: './marketing-contracts.component.html',
  styleUrls: ['./marketing-contracts.component.scss']
})
export class MarketingContractsComponent implements OnInit {
  public refdata: any = {};
  public columnDefs = [];
  private localloanobject: loan_model = new loan_model();

  public rowData = [];
  public components;
  public context;
  public frameworkcomponents;
  public editType;
  public gridApi;
  public columnApi;
  public pinnedBottomRowData;

  style = {
    marginTop: '10px',
    width: '97%',
    height: '110px',
    boxSizing: 'border-box'
  };

  constructor(public localstorageservice: LocalStorageService,
    private toaster: ToastsManager,
    public loanserviceworker: LoancalculationWorker,
    public cropunitservice: CropapiService,
    public logging: LoggingService,
    public alertify:AlertifyService,
    public loanapi:LoanApiService,
    private marketingContractService : MarketingcontractcalculationService){

      this.components = { numericCellEditor: getNumericCellEditor()};
      this.refdata = this.localstorageservice.retrieve(environment.referencedatakey);
      this.frameworkcomponents = {selectEditor: SelectEditor, deletecolumn: DeleteButtonRenderer };

      this.columnDefs = [
        { headerName: 'Category', field: 'Category',  cellClass: 'editable-color', editable: true, cellEditor: "selectEditor",
        cellEditorParams: {
          values: [{key:1, value : 'Crop'},{key:2, value : 'Stored Crop'}]
        },
        valueFormatter: function (params) {

          if(params.value){
            var selectedValue = params.colDef.cellEditorParams.values.find(data=>data.key == params.value);
            if(selectedValue){
              return selectedValue.value;
            }else{
              return undefined;
            }
          }else{
            return '';
          }
          
        },
        width : 100
      },
      { headerName: 'Crop', field: 'Crop_Code',  cellClass: 'editable-color', editable: true, cellEditor: "selectEditor",
        cellEditorParams: this.getCropValues.bind(this),
        valueFormatter:  (params) => {

          let cropValues : any[] = this.getCropValues(params).values;

          if(params.value){
            var selectedValue = cropValues.find(data=>data.key == params.value);
            if(selectedValue){
              return selectedValue.value;
            }else{
              return undefined;
            }
          }else{
            return '';
          }
          
        },
        width : 100
      },
      { headerName: 'Crop Type', field: 'Crop_Type_Code',  editable: true, width:70},
      { headerName: 'Buyer', field: 'Assoc_ID',   cellClass: 'editable-color', editable: true, cellEditor: "selectEditor",
      cellEditorParams: this.getBuyersValue.bind(this),
        valueFormatter:  (params) => {

          let cropValues : any[] = this.getBuyersValue(params).values;

          if(params.value){
            var selectedValue = cropValues.find(data=>data.key == params.value);
            if(selectedValue){
              return selectedValue.value;
            }else{
              return undefined;
            }
          }else{
            return '';
          }
          
        },
        width : 100
    
    },
      { headerName: 'Contract', field: 'Contract',  editable: true, width:100},
      { headerName: 'Description', field: 'Description_Text',  editable: true, width:100},
      { headerName: 'Quantity', field: 'Quantity',editable: true,  cellEditor: "numericCellEditor", cellClass: ['editable-color','text-right'],
      valueSetter: numberValueSetter,
      valueFormatter: function (params) {
        if(params.value){
          return params.value.toFixed(0).replace(/\d(?=(\d{3})+\.)/g, '$&,')
        }else{
          return 0;
        }
      },
      width:100},
      { headerName: 'Price', field: 'Price',  editable: true, width:150,  cellEditor: "numericCellEditor", cellClass: ['editable-color','text-right'],
      valueSetter: numberValueSetter,
      valueFormatter: function (params) {
        return PriceFormatter(params.value);
      }},
      { headerName: 'Mkt Value', field: 'Market_Value',  width:180,   cellClass: ['text-right'],
      valueFormatter: function (params) {
        return PriceFormatter(params.value);
      }},
      { headerName: 'Contract %', field: 'Contract_Per',  width:80,   cellClass: ['text-right'],
      valueFormatter: function (params) {
        return PercentageFormatter(params.value);
      }},
      { headerName: '', field: 'value', cellRenderer: "deletecolumn" },
        
      ];

      this.context = { componentParent: this };
  }

  ngOnInit(){
    this.localstorageservice.observe(environment.loankey).subscribe(res => {
          this.logging.checkandcreatelog(1, 'LoanMarketingContracts ', "LocalStorage updated");
          this.localloanobject = res
          
          if (res.srccomponentedit == "MarketingContractComponent") {
            //if the same table invoked the change .. change only the edited row
            this.localloanobject = res;
            this.rowData[res.lasteditrowindex] =  this.localloanobject.LoanMarketingContracts.filter(mc => { return mc.ActionStatus !== 3 })[res.lasteditrowindex];
          }else{
            this.localloanobject = res
            this.rowData = [];
            this.rowData = this.rowData = this.localloanobject.LoanMarketingContracts !== null? this.localloanobject.LoanMarketingContracts.filter(mc => { return  mc.ActionStatus !== 3 }):[];
            
          }
          this.getgridheight();
          this.gridApi.refreshCells();
          // this.adjustgrid();
        });

        this.localloanobject = this.localstorageservice.retrieve(environment.loankey);
        
        if(this.localloanobject && this.localloanobject.LoanMarketingContracts.length>0){
          this.rowData = this.localloanobject.LoanMarketingContracts !== null? this.localloanobject.LoanMarketingContracts.filter(mc => { return  mc.ActionStatus !== 3 }):[];
        }else{
          this.rowData = [];
        }
  }

  getBuyersValue(params){
    let buyersValue = [];
    if(this.localloanobject.Association && this.localloanobject.Association.length >0){
      this.localloanobject.Association.filter(as=>as.Assoc_Type_Code === "BUY").map(buyer=>{
        buyersValue.push({key : buyer.Assoc_ID,value:buyer.Assoc_Name});
      });
      buyersValue = _.uniqBy(buyersValue,'key');
      return {values : buyersValue};
    }else{
      return {values : []};
    }
  }
  getCropValues(params){
    let cropValues = [];
    if(params.data.Category == 1){
      if(this.localloanobject.LoanCropPractices && this.localloanobject.LoanCropPractices.length >0){
        let cropPracticeIds = [];
        this.localloanobject.LoanCropPractices.map(cp=>{
          cropPracticeIds.push(cp.Crop_Practice_ID);
        });
        cropPracticeIds = _.uniq(cropPracticeIds);

        if(this.refdata && this.refdata.CropList){
          cropPracticeIds.map(cpi=>{
            this.refdata.CropList.map(cl=>{
              if(cl.Crop_And_Practice_ID == cpi){
                cropValues.push({key : cl.Crop_Code, value : cl.Crop_Name})
              }
            })
          })
        }
      }
      cropValues = _.uniqBy(cropValues,'key');
      return {values : cropValues};
    }else if(params.data.Category == 2){
      if(this.localloanobject.LoanCollateral && this.localloanobject.LoanCollateral.length > 0){
        let cropPracticeIds = [];
        this.localloanobject.LoanCollateral.filter(lc=>lc.Collateral_Category_Code==="SCP").map(lc=>{
          cropValues.push({key : lc.Collateral_Description.split(' ').join('_'), value : lc.Collateral_Description });
        });
       
        cropValues = _.uniqBy(cropValues,'key');
        return {values : cropValues};
      }
    }else{
      return {values : []};
    }
  }


  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.getgridheight();
  }

  syncenabled(){
    if(this.localloanobject && this.localloanobject.LoanMarketingContracts.length>0){
      return this.localloanobject.LoanMarketingContracts.filter(p=>p.ActionStatus).length>0;
    }else{
      return false;
    }
  }

  synctoDb(){
    this.loanapi.syncloanobject(this.localloanobject).subscribe(res=>{
      if(res.ResCode == 1){
        this.loanapi.getLoanById(this.localloanobject.Loan_Full_ID).subscribe(res => {
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
    });
  }

  //Grid Events
  addrow() {
    if(this.localloanobject.LoanMarketingContracts ==null)
      this.localloanobject.LoanMarketingContracts = [];
      
    var newItem = new Loan_Marketing_Contract();
    newItem.Loan_Full_ID = this.localloanobject.Loan_Full_ID;
    this.rowData.push(newItem);
    //this.localloanobject.LoanMarketingContracts.push(newItem);
    this.gridApi.setRowData(this.rowData);
    this.gridApi.startEditingCell({
      rowIndex: this.rowData.length-1,
      colKey: "Category"
    });
    this.getgridheight();
  }

  rowvaluechanged(value: any) {
    var obj : Loan_Marketing_Contract = value.data;

    if (obj.Contract_ID == undefined) {
      obj.Contract_ID = 0
      obj.Price = 0;
      obj.Quantity = 0;
      obj.ActionStatus = 1;
      this.marketingContractService.updateMktValueAndContractPer(this.localloanobject, obj);
      this.localloanobject.LoanMarketingContracts[this.localloanobject.LoanMarketingContracts.length]=value.data;
    }
    else {
      var rowindex=this.localloanobject.LoanMarketingContracts.findIndex(mc=>mc.Contract_ID==obj.Contract_ID);
      if(obj.ActionStatus!=1)
        obj.ActionStatus = 2;
      this.marketingContractService.updateMktValueAndContractPer(this.localloanobject, obj);
      this.localloanobject.LoanMarketingContracts[rowindex]=obj;
    }

    //this shall have the last edit
    this.localloanobject.srccomponentedit = "MarketingContractComponent";
    this.localloanobject.lasteditrowindex = value.rowIndex;
    this.loanserviceworker.performcalculationonloanobject(this.localloanobject);
  }

  DeleteClicked(rowIndex: any) {
      this.alertify.confirm("Confirm", "Do you Really Want to Delete this Record?").subscribe(res => {
        if (res == true) {
          var obj = this.rowData[rowIndex];
          if(obj){
          if (obj.Contract_ID == 0) {
            this.rowData.splice(rowIndex, 1);
            let indexToDelete = this.localloanobject.LoanMarketingContracts.findIndex(mc=>mc.Contract_ID == obj.Contract_ID);
            if(indexToDelete >=0){
              this.localloanobject.LoanMarketingContracts.splice(indexToDelete, 1);
            }
            
          }else {
            obj.ActionStatus = 3;
          }
        }
          this.localloanobject.srccomponentedit = undefined;
          this.localloanobject.lasteditrowindex =undefined;
          this.loanserviceworker.performcalculationonloanobject(this.localloanobject);
        }
      })
    }

  getgridheight(){
    this.style.height=(30*(this.rowData.length+2)).toString()+"px";
  }

  onGridSizeChanged(Event: any) {

    try{
    this.gridApi.sizeColumnsToFit();
  }
  catch{

  }
  }

}