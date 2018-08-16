import { Injectable } from '@angular/core';
import { loan_model, Loan_Collateral } from '../../../models/loanmodel';
import { numberFormatter, currencyFormatter, percentageFormatter, insuredFormatter } from '../../../aggridformatters/valueformatters';

/**
 * Shared service for Real estate
 */
@Injectable()
export class RealEstateService {
  constructor() {
  }

  getColumnDefs() {
    return [
      { headerName: 'Category', field: 'Collateral_Category_Code', editable: false, width: 100 },
      { headerName: 'Description', field: 'Collateral_Description', cellEditor: "alphaNumeric", editable: true, width: 120, cellClass: 'editable-color' },
      { headerName: 'Qty', field: 'Qty', editable: true, cellEditor: "numericCellEditor", valueFormatter: numberFormatter, cellClass: ['editable-color', 'text-right'], width: 90 },
      { headerName: 'Price', field: 'Price', editable: true, cellEditor: "numericCellEditor", valueFormatter: currencyFormatter, cellClass: ['editable-color', 'text-right'], width: 110 },

      { headerName: 'Mkt Value', field: 'Market_Value', editable: false, cellEditor: "numericCellEditor", valueFormatter: currencyFormatter, cellClass: ['text-right'], width: 130 },
      { headerName: 'Prior Lien', field: 'Prior_Lien_Amount', editable: true, cellEditor: "numericCellEditor", valueFormatter: currencyFormatter, cellClass: ['editable-color', 'text-right'], width: 130 },
      { headerName: 'Lienholder', field: 'Lien_Holder', editable: true, width: 120, cellEditor: "alphaNumeric", cellClass: ['editable-color'] },
      {
        headerName: 'Net Mkt Value', field: 'Net_Market_Value', editable: false, cellEditor: "numericCellEditor", valueFormatter: currencyFormatter, cellClass: ['text-right'],
        // valueGetter: function (params) {
        //   return setNetMktValue(params);}
      },
      {
        headerName: 'Discount %', field: 'Disc_Value', editable: true, cellEditor: "numericCellEditor", valueFormatter: percentageFormatter, cellStyle: { textAlign: "right" }, width: 110, cellClass: ['editable-color', 'text-right'],
        pinnedRowCellRenderer: function () { return ' '; }
      },
      {
        headerName: 'Disc Value', field: 'Disc_CEI_Value', editable: false, cellEditor: "numericCellEditor", cellClass: ['text-right'],
        // valueGetter: function (params) {
        //   return setDiscValue(params);
        // },
        valueFormatter: currencyFormatter
      },
      {
        headerName: 'Insured', field: 'Insured_Flag', editable: true, cellEditor: "selectEditor", width: 100, cellClass: ['editable-color'],
        cellEditorParams: {
          values: [{ 'key': 0, 'value': 'No' }, { 'key': 1, 'value': 'Yes' }]
        }, pinnedRowCellRenderer: function () { return ' '; },
        valueFormatter: insuredFormatter
      },
      { headerName: '', field: 'value', cellRenderer: "deletecolumn", width: 80, pinnedRowCellRenderer: function () { return ' '; } }
    ];
  }

  computeTotal(input) {
    var total = []
    var footer = new Loan_Collateral();
    footer.Collateral_Category_Code = 'Total';
    footer.Market_Value = input.LoanMaster[0].FC_Market_Value_realstate;
    footer.Prior_Lien_Amount = input.LoanMaster[0].FC_realstate_Prior_Lien_Amount;
    footer.Lien_Holder = '';
    footer.Net_Market_Value = input.LoanMaster[0].Net_Market_Value_Real_Estate;
    footer.Disc_Value = 0;
    footer.Disc_CEI_Value = input.LoanMaster[0].Disc_value_Real_Estate;
    footer.Qty = input.LoanMaster[0].FC_total_Qty_Real_Estate;
    total.push(footer);
    return total;
  }
}
