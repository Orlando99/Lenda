import { Injectable } from '@angular/core';
import { loan_model, Loan_Collateral } from '../../../models/loanmodel';
import { currencyFormatter, percentageFormatter, insuredFormatter } from '../../../aggridformatters/valueformatters';

/**
 * Shared service for FSA
 */
@Injectable()
export class FsaService {
  constructor() {
  }

  getColumnDefs() {
    return [
      { headerName: 'Category', field: 'Collateral_Category_Code', editable: false, width: 100 },
      { headerName: 'Description', field: 'Collateral_Description', editable: true, width: 120, cellEditor: "alphaNumeric", cellClass: ['editable-color'] },
      { headerName: 'Mkt Value', field: 'Market_Value', editable: true, cellEditor: "numericCellEditor", valueFormatter: currencyFormatter, cellClass: ['editable-color', 'text-right'] },
      { headerName: 'Prior Lien', field: 'Prior_Lien_Amount', editable: true, cellEditor: "numericCellEditor", valueFormatter: currencyFormatter, cellStyle: { textAlign: "right" }, cellClass: ['editable-color', 'text-right'] },
      { headerName: 'Lienholder', field: 'Lien_Holder', editable: true, width: 130, cellClass: 'editable-color', cellEditor: "alphaNumeric" },
      {
        headerName: 'Net Mkt Value', field: 'Net_Market_Value', editable: false, cellEditor: "numericCellEditor", valueFormatter: currencyFormatter, cellClass: ['text-right']
        // valueGetter: function (params) {
        //   return setNetMktValue(params);}
      },
      {
        headerName: 'Discount %', field: 'Disc_Value', editable: true, cellEditor: "numericCellEditor", valueFormatter: percentageFormatter, cellClass: ['editable-color', 'text-right'], width: 130,
        pinnedRowCellRenderer: function () { return '-'; }
      },
      {
        headerName: 'Disc Value', field: 'Disc_CEI_Value', editable: false, cellEditor: "numericCellEditor", cellClass: ['editable-color', 'text-right'],
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

  computeTotal(loanobject) {
    var total = []
    try {
      var footer = new Loan_Collateral();
      footer.Collateral_Category_Code = 'Total';
      footer.Market_Value = loanobject.LoanMaster[0].FC_Market_Value_FSA
      footer.Prior_Lien_Amount = loanobject.LoanMaster[0].FC_FSA_Prior_Lien_Amount
      footer.Lien_Holder = '';
      footer.Net_Market_Value = loanobject.LoanMaster[0].Net_Market_Value_FSA
      footer.Disc_Value = 0;
      footer.Disc_CEI_Value = loanobject.LoanMaster[0].Disc_value_FSA
      total.push(footer);
      return total;
    }
    catch
    {  // Means that Calculations have not Ended
      return total;
    }
  }
}
