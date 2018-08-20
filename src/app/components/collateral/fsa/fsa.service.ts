import { Injectable } from '@angular/core';
import { Loan_Collateral, loan_model } from '../../../models/loanmodel';
import { currencyFormatter, percentageFormatter, insuredFormatter } from '../../../aggridformatters/valueformatters';
import { LoancalculationWorker } from '../../../Workers/calculations/loancalculationworker';

/**
 * Shared service for FSA
 */
@Injectable()
export class FsaService {
  constructor(public loanserviceworker:LoancalculationWorker) {
  }

  getColumnDefs(loanobj:loan_model) {
    return [
      {
        headerName: 'Category', field: 'Collateral_Category_Code', editable: function (params) {
          if (params.data.Collateral_ID == 0) {
            return true;
          }
          else
            return false;
        },
        valueGetter: function (params) {
          try {
            return params.context.componentParent.fsaService.CollateralItems.find(p => p.key == params.data.Collateral_Category_Code).value;
          }
          catch{
            return "";
          }
        },
        cellEditorSelector: function (params) {
          if (params.data.Collateral_ID == 0) {
            return {
              component: "selectEditor"
            };
          }
        },
        cellEditorParams: this.getavailableCollateralitems()
      },
      {
        headerName: 'Crop/Detail', field: 'Crop_Detail', editable: function (params) {
          if (params.data.Collateral_Category_Code == "SCP")  {
            return true;
          }
          else
            return false;
        }, cellEditorSelector: function (params) {
          debugger
          if (params.data.Collateral_Category_Code == "SCP") {
            return {
              component: "alphaNumeric"
            };
          }
          else {
            return null;
          }
        },
        cellClass: function (params) {
          if (!(params.data.Collateral_Category_Code == "SCP")) {
            return 'grayedcell';
          }
          else
            return 'editable-color';
        }
      },
      { headerName: 'Crop Type', field: 'Crop_Type', editable: function (params) {
        if (params.data.Collateral_Category_Code == "SCP") {
          return true;
        }
        else
          return false;
      }, cellEditorSelector: function (params) {
        debugger
        if (params.data.Collateral_Category_Code == "SCP") {
          return {
            component: "alphaNumeric"
          };
        }
        else {
          return null;
        }
      },
      cellClass: function (params) {
        if (!(params.data.Collateral_Category_Code == "SCP")) {
          return 'grayedcell';
        }
        else
          return 'editable-color';
      } },
      { headerName: 'Description', field: 'Collateral_Description', editable: true, cellEditor: "alphaNumeric", cellClass: ['editable-color'] },
      { headerName: 'Measure Code', field: 'Measure_Code', editable: true, cellClass: ['editable-color'] ,cellEditor:"selectEditor", cellEditorParams: this.getmeasureItems() },
      {
        headerName: 'Discount %', field: 'Disc_Pct', editable: true, cellEditor: "numericCellEditor", valueFormatter: percentageFormatter, cellClass: ['editable-color', 'text-right'],
        valueGetter:function(params){
          try{
             if(params.data.Disc_Pct==-1){
                return params.context.componentParent.fsaService.Discountitems.find(p=>p.key==params.data.Collateral_Category_Code).value;
             }
             else
               return params.data.Disc_Pct;
              }
              catch{
                return 0;
              }
        },
        pinnedRowCellRenderer: function () { return '-'; }
      },
      {
        headerName: 'Quantity', field: 'Qty', editable: function (params) {
          if (params.data.Collateral_Category_Code == "SCP") {
            return true;
          }
          else
            return false;
        }, cellRendererSelector: function (params) {
          if (params.data.Collateral_Category_Code != "SCP") {
            return { component: "blankcell" }
          }

        }, cellEditorSelector: function (params) {
          if (params.data.Collateral_Category_Code == "SCP") {
            return {
              component: "numericCellEditor"
            };
          }
          else {
            return null;
          }
        },
        cellClass: function (params) {
          if (!(params.data.Collateral_Category_Code == "SCP")) {
            return 'grayedcell';
          }
          else
            return 'editable-color';
        }

      },
      {
        headerName: 'Price', field: 'Price',editable: function (params) {
          if (params.data.Collateral_Category_Code == "SCP") {
            return true;
          }
          else
            return false;
        }, valueFormatter: currencyFormatter, cellRendererSelector: function (params) {
          if (params.data.Collateral_Category_Code != "SCP") {
            return { component: "blankcell" }
          }

        }, cellEditorSelector: function (params) {
          if (params.data.Collateral_Category_Code == "SCP") {
            return {
              component: "alphaNumeric"
            };
          }
          else {
            return null;
          }
        },
        cellClass: function (params) {
          if (!(params.data.Collateral_Category_Code == "SCP")) {
            return 'grayedcell';
          }
          else
            return 'editable-color';
        }

      },
      { 
        headerName: 'Mkt Value', field: 'Market_Value', cellEditor: "numericCellEditor", valueFormatter: currencyFormatter,  cellClass: function (params) {
          if (params.data.Collateral_Category_Code == "SCP")  {
            return 'grayedcell';
          }
          else
            return 'editable-color';
        },
        editable: function (params) {
          if (params.data.Collateral_Category_Code != "SCP") {
            return true;
          }
          else
            return false;
        }, valueGetter: function (params) {
          debugger
          if (params.data.Collateral_Category_Code != "SCP") {
            return params.data.Market_Value;
          }
          else
            return params.data.Price * params.data.Qty;
        }

      },
      { headerName: 'Prior Lien', field: 'Prior_Lien_Amount', editable: true, cellEditor: "numericCellEditor", valueFormatter: currencyFormatter, cellStyle: { textAlign: "right" }, cellClass: ['editable-color', 'text-right'] },
      { headerName: 'Lienholder', field: 'Lien_Holder', editable: true, cellClass: 'editable-color', cellEditor: "selectEditor",cellEditorParams:this.getLienholders(loanobj) },
      {
        headerName: 'NetMkt Value', field: 'Net_Market_Value', editable: false, cellEditor: "numericCellEditor", valueFormatter: currencyFormatter, cellClass: ['text-right']
        // valueGetter: function (params) {
        //   return setNetMktValue(params);}
      },
      {
        headerName: 'Disc Value', field: 'Disc_Mkt_Value', editable: false, cellEditor: "numericCellEditor", cellClass: ['text-right'],
        // valueGetter: function (params) {
        //   return setDiscValue(params);
        // },
        valueFormatter: currencyFormatter
      },
      {
        headerName: 'Insured', field: 'Insured_Flag', editable: true, cellEditor: "selectEditor", cellClass: ['editable-color'],
        cellEditorParams: {
          values: [{ 'key': 0, 'value': 'No' }, { 'key': 1, 'value': 'Yes' }]
        }, pinnedRowCellRenderer: function () { return ' '; },
        valueFormatter: insuredFormatter
      },
      {
        headerName: 'Ins Value', field: 'Ins_Value', editable: false, valueFormatter: currencyFormatter, cellClass: ['text-right'],valueGetter:function(params){
          debugger
          if(params.data.Insured_Flag==1){
            params.data.Ins_Value=params.data.Net_Market_Value;
              return params.data.Net_Market_Value;
          }
          else
          return "-";
        }

      },
      {
        headerName: 'Disc Ins Value', field: 'Disc_Ins_Value', editable: false, valueFormatter: currencyFormatter, cellClass: ['text-right'],valueGetter:function(params){
          debugger
          if(params.data.Insured_Flag==1){
            params.data.Disc_Ins_Value=params.data.Disc_Mkt_Value;
              return params.data.Disc_Mkt_Value;
          }
          else
          return "-";
        }

      },
      { headerName: '', width: 100, field: 'value', cellRenderer: "deletecolumn", pinnedRowCellRenderer: function () { return ' '; } }
    ];
  }

  computeTotal(loanobject) {
    var total = []
    try {
      var footer = new Loan_Collateral();
      footer.Collateral_Category_Code = 'Total';
      footer.Market_Value = loanobject.LoanMaster[0].FC_Market_Value_FSA
      footer.Prior_Lien_Amount = loanobject.LoanMaster[0].FC_FSA_Prior_Lien_Amount
      footer.Lien_Holder = '';
      footer.Net_Market_Value = loanobject.LoanMaster[0].Net_Market_Value_FSA
      footer.Disc_Pct = 0;
      footer.Disc_Mkt_Value = loanobject.LoanMaster[0].Disc_value_FSA
      total.push(footer);
      return total;
    }
    catch
    {  // Means that Calculations have not Ended
      return total;
    }
  }

  //add new row

  //this.collateralService.addRow(this.localloanobject, this.gridApi, this.rowData, CollateralSettings.fsa.key, CollateralSettings.fsa.source, CollateralSettings.fsa.sourceKey);

  addRow(localloanobject: loan_model, gridApi, rowData, source, sourceKey) {

    let newItem;

    if (localloanobject[source] == null) {
      localloanobject[source] = [];
    }


    newItem = new Loan_Collateral();
    {
      newItem.Disc_Pct = -1;
      newItem.ActionStatus = 1
    }
    newItem.Loan_Full_ID = localloanobject.Loan_Full_ID;

    var res = rowData.push(newItem);
    gridApi.setRowData(rowData);
    gridApi.startEditingCell({
      rowIndex: rowData.length - 1,
      colKey: sourceKey
    })


  }

  rowValueChanged(value: any, localloanobject: loan_model, component, source, uniqueKey) {
    debugger
    var obj = value.data;
    if (obj[uniqueKey] == 0) {
      let lastIndex = localloanobject[source].length - 1;
      obj.ActionStatus = 1;
      localloanobject[source][lastIndex] = value.data;
    } else {
      var rowindex = localloanobject[source].findIndex(lc => lc[uniqueKey] == obj[uniqueKey]);
      if (obj.ActionStatus != 1)
        obj.ActionStatus = 2;
      localloanobject[source][rowindex] = obj;
    }
    // this shall have the last edit
    localloanobject.srccomponentedit = component;
    localloanobject.lasteditrowindex = value.rowIndex;
    this.loanserviceworker.performcalculationonloanobject(localloanobject);
   
  }
  public readonly CollateralItems = [
    { value: 'FSA', key: 'FSA' },
    { value: 'Live Stock', key: 'LSK' },
    { value: 'Stored Crop', key: 'SCP' },
    { value: 'Equipment', key: 'EQP' },
    { value: 'Real Estate', key: 'RET' },
    { value: 'Other', key: 'OTR' }
  ];

  public readonly MeasureItems = [
    { value: 'CEH', key: 'CEH' },
    { value: 'CBC', key: 'CBC' },
    { value: 'CRQ', key: 'CRQ' },
    { value: 'CRP', key: 'CRP' },
    { value: 'CRC', key: 'CRC' },
    { value: 'ICA', key: 'ICA' },
    { value: 'ICC', key: 'ICC' },
    { value: 'ISY', key: 'ISY' },
    { value: 'IWF', key: 'IWF' },
    { value: 'FSY', key: 'FSY' },
    { value: 'FSP', key: 'FSP' },
    { value: 'FSA', key: 'FSA' },
    { value: 'FSC', key: 'FSC' },
    { value: 'SMQ', key: 'SMQ' },
    { value: 'SMP', key: 'SMP' },
    { value: 'SDQ', key: 'SDQ' },
    { value: 'SDP', key: 'SDP' },
    { value: 'LCQ', key: 'LCQ' },
    { value: 'LCP', key: 'LCP' },
    { value: 'LDQ', key: 'LDQ' },
    { value: 'EQA', key: 'EQA' },
    { value: 'EQS', key: 'EQS' },
    { value: 'EQR', key: 'EQR' },
    { value: 'ECC', key: 'ECC' },
    { value: 'REA', key: 'REA' },
    { value: 'RES', key: 'RES' },
    { value: 'RER', key: 'RER' },
    { value: 'REC', key: 'REC' },
    { value: 'OCA', key: 'OCA' },
    { value: 'OCS', key: 'OCS' },
    { value: 'OCR', key: 'OCR' },
    { value: 'OCC', key: 'OCC' }
  ];

  public readonly Discountitems=[
    { value: '50', key: 'FSA' },
    { value: '50', key: 'LSK' },
    { value: '10', key: 'SCP' },
    { value: '50', key: 'EQP' },
    { value: '40', key: 'RET' },
    { value: '100', key: 'OTR' }
  ];

  getavailableCollateralitems() {
    return { values: this.CollateralItems };

  }

  getmeasureItems(){
    return { values: this.MeasureItems };
  }

  getLienholders(loanobj:loan_model){
    debugger
    let values=[];
    loanobj.Association.filter(p=>p.Assoc_Type_Code=="LEI").forEach(element => {
      values.push({value:element.Assoc_Name,key:element.Assoc_Name});
    });
    return {values:values}
  }



}
