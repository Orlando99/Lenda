import { Injectable } from '@angular/core';
import { AlertifyService } from '../../alertify/alertify.service';
import { loan_model, Loan_Collateral } from '../../models/loanmodel';
import { LoancalculationWorker } from '../../Workers/calculations/loancalculationworker';
import { LocalStorageService } from 'ngx-webstorage';
import { environment } from '../../../environments/environment.prod';
import { LoggingService } from '../../services/Logs/logging.service';

/**
 * Shared service for collateral
 */
@Injectable()
export class CollateralService {
  // private localloanobject: loan_model = new loan_model();
  public rowData = [];
  // public gridApi;
  public deleteAction = false;
  public pinnedBottomRowData;

  constructor(
    public localstorageservice: LocalStorageService,
    public logging: LoggingService,
    public loanserviceworker: LoancalculationWorker,
    public alertify: AlertifyService,
  ) {
  }

  style = {
    marginTop: '10px',
    width: '97%',
    height: '110px',
    boxSizing: 'border-box'
  };

  onInit(localloanobject: loan_model, gridApi, res, component, categoryCode) {
    this.logging.checkandcreatelog(1, 'LoanCollateral - ' +  categoryCode, "LocalStorage updated");
    if (res.srccomponentedit == component) {
      //if the same table invoked the change .. change only the edited row
      localloanobject = res;
      this.rowData[res.lasteditrowindex] = localloanobject.LoanCollateral.filter(lc => { return lc.Collateral_Category_Code === categoryCode && lc.ActionStatus !== 3 })[res.lasteditrowindex];
    } else {
      localloanobject = res
      this.rowData = [];
      this.rowData = this.rowData = localloanobject.LoanCollateral !== null ? localloanobject.LoanCollateral.filter(lc => { return lc.Collateral_Category_Code === "LSK" && lc.ActionStatus !== 3 }) : [];

      this.pinnedBottomRowData = this.computeTotal(res);
    }
    this.getgridheight();
    gridApi.refreshCells();
  }

  addRow(localloanobject: loan_model, gridApi, rowData, newItemCategoryCode) {
    if (localloanobject.LoanCollateral == null) {
      localloanobject.LoanCollateral = [];
    }

    var newItem = new Loan_Collateral();
    newItem.Collateral_Category_Code = newItemCategoryCode;
    newItem.Loan_Full_ID = localloanobject.Loan_Full_ID
    newItem.Disc_Value = 50;
    newItem.ActionStatus = 1;

    var res = rowData.push(newItem);
    localloanobject.LoanCollateral.push(newItem);
    gridApi.setRowData(rowData);
    gridApi.startEditingCell({
      rowIndex: rowData.length - 1,
      colKey: "Collateral_Description"
    });
    this.getgridheight();
  }

  rowValueChanged(value: any, localloanobject: loan_model, component) {
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

  deleteClicked(rowIndex: any, localloanobject: loan_model) {
    this.alertify.confirm("Confirm", "Do you Really Want to Delete this Record?").subscribe(res => {
      if (res == true) {
        var obj = this.rowData[rowIndex];
        if (obj.Collateral_ID == 0) {
          this.rowData.splice(rowIndex, 1);
          localloanobject.LoanCollateral.splice(localloanobject.LoanCollateral.indexOf(obj), 1);
        } else {
          this.deleteAction = true;
          obj.ActionStatus = 3;
        }
        this.loanserviceworker.performcalculationonloanobject(localloanobject);
      }
    })
  }

  /**
   * Helper methods
   */
  getgridheight() {
    this.style.height = (30 * (this.rowData.length + 2) - 2).toString() + "px";
  }

  getdataforgrid(localloanobject: loan_model) {
    let obj: any = this.localstorageservice.retrieve(environment.loankey);
    this.logging.checkandcreatelog(1, 'LoanCollateral - LSK', "LocalStorage retrieved");
    if (obj != null && obj != undefined) {
      localloanobject = obj;
      this.rowData = [];
      this.rowData = this.rowData = localloanobject.LoanCollateral !== null ? localloanobject.LoanCollateral.filter(lc => { return lc.Collateral_Category_Code === "LSK" && lc.ActionStatus !== 3 }) : [];
      this.pinnedBottomRowData = this.computeTotal(obj);
    }
  }

  computeTotal(input) {
    var total = []
    var footer = new Loan_Collateral();
    footer.Collateral_Category_Code = 'Total';
    footer.Market_Value = input.LoanMaster[0].FC_Market_Value_lst
    footer.Prior_Lien_Amount = input.LoanMaster[0].FC_Lst_Prior_Lien_Amount
    footer.Lien_Holder = '';
    footer.Net_Market_Value = input.LoanMaster[0].Net_Market_Value_Livestock
    footer.Disc_Value = 0;
    footer.Disc_CEI_Value = input.LoanMaster[0].Disc_value_Livestock
    footer.Qty = input.LoanMaster[0].FC_total_Qty_lst
    footer.Price = input.LoanMaster[0].FC_total_Price_lst
    total.push(footer);
    return total;
  }
}
