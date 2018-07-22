import { Injectable } from '@angular/core';
import { loan_model, Loan_Collateral } from '../../models/loanmodel';
import { LoancalculationWorker } from '../../Workers/calculations/loancalculationworker';

/**
 * Shared service for collateral
 */
@Injectable()
export class CollateralService {
  private localloanobject: loan_model = new loan_model();
  public rowData = [];
  public gridApi;

  constructor(public loanserviceworker: LoancalculationWorker) {
  }

  style = {
    marginTop: '10px',
    width: '97%',
    height: '110px',
    boxSizing: 'border-box'
  };

  addrow(gridApi, rowData, newItemCategoryCode) {
    if (this.localloanobject.LoanCollateral == null) {
      this.localloanobject.LoanCollateral = [];
    }

    var newItem = new Loan_Collateral();
    newItem.Collateral_Category_Code = newItemCategoryCode;
    newItem.Loan_Full_ID = this.localloanobject.Loan_Full_ID
    newItem.Disc_Value = 50;
    newItem.ActionStatus = 1;

    var res = rowData.push(newItem);
    this.localloanobject.LoanCollateral.push(newItem);
    gridApi.setRowData(rowData);
    gridApi.startEditingCell({
      rowIndex: rowData.length - 1,
      colKey: "Collateral_Description"
    });
    this.getgridheight();
  }

  rowvaluechanged(value: any, localloanobject, component) {
    var obj = value.data;
    if (obj.Collateral_ID == 0) {
      obj.ActionStatus = 1;
      localloanobject.LoanCollateral[localloanobject.LoanCollateral.length - 1] = value.data;
    } else {
      var rowindex = localloanobject.LoanCollateral.findIndex(lc => lc.Collateral_ID == obj.Collateral_ID);
      if (obj.ActionStatus != 1)
        obj.ActionStatus = 2;
      localloanobject.LoanCollateral[rowindex] = obj;
    }
    // this shall have the last edit
    localloanobject.srccomponentedit = component;
    localloanobject.lasteditrowindex = value.rowIndex;
    this.loanserviceworker.performcalculationonloanobject(localloanobject);
  }

  getgridheight() {
    this.style.height = (30 * (this.rowData.length + 2) - 2).toString() + "px";
  }
}
