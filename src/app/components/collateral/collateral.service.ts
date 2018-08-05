import { Injectable } from '@angular/core';
import { AlertifyService } from '../../alertify/alertify.service';
import { loan_model, Loan_Collateral } from '../../models/loanmodel';
import { LoancalculationWorker } from '../../Workers/calculations/loancalculationworker';
import { LocalStorageService } from 'ngx-webstorage';
import { environment } from '../../../environments/environment.prod';
import { LoggingService } from '../../services/Logs/logging.service';
import { LoanApiService } from '../../services/loan/loanapi.service';
import { JsonConvert } from 'json2typescript';
import { ToasterService } from '../../services/toaster.service';
import { FsaService } from './fsa/fsa.service';
import { EquipmentService } from './equipment/equipment.service';
import { LiveStockService } from './livestock/livestock.service';
import { StoredCropService } from './storedcrop/storedcrop.service';
import CollateralSettings from './collateral-types.model';

/**
 * Shared service for collateral
 */
@Injectable()
export class CollateralService {
  // private localloanobject: loan_model = new loan_model();
  // public rowData = [];
  // public gridApi;
  public deleteAction = false;
  // public pinnedBottomRowData;

  constructor(
    public localstorageservice: LocalStorageService,
    public logging: LoggingService,
    public loanserviceworker: LoancalculationWorker,
    public alertify: AlertifyService,
    public loanapi: LoanApiService,
    public toasterService: ToasterService,
    public fsaService: FsaService,
    public liveStockService: LiveStockService,
    public equipmentService: EquipmentService,
    public storedcropService: StoredCropService
  ) {
  }

  style = {
    marginTop: '10px',
    width: '97%',
    height: '110px',
    boxSizing: 'border-box'
  };

  subscribeToChanges(res, localloanobject, categoryCode, rowData, pinnedBottomRowData) {
    if (res.srccomponentedit == CollateralSettings.fsa.component) {
      rowData[res.lasteditrowindex] = this.getLastEditedRow(localloanobject, CollateralSettings.fsa.key, res.lasteditrowindex);
    } else if (res.srccomponentedit == CollateralSettings.livestock.component) {
      rowData[res.lasteditrowindex] = this.getLastEditedRow(localloanobject, CollateralSettings.livestock.key, res.lasteditrowindex);
    } else if (res.srccomponentedit == CollateralSettings.equipment.component) {
      rowData[res.lasteditrowindex] = this.getLastEditedRow(localloanobject, CollateralSettings.equipment.key, res.lasteditrowindex);
    } else if (res.srccomponentedit == CollateralSettings.storedCrop.component) {
      rowData[res.lasteditrowindex] = this.getLastEditedRow(localloanobject, CollateralSettings.storedCrop.key, res.lasteditrowindex);
    } else {
      localloanobject = res;
      rowData = this.getRowData(localloanobject, categoryCode);
      pinnedBottomRowData = this.computeTotal(localloanobject, categoryCode);
    }
    return {
      rowData: rowData,
      pinnedBottomRowData: pinnedBottomRowData
    };
  }

  getLastEditedRow(localloanobject, categoryCode, lastEditRowIndex) {
    return localloanobject.LoanCollateral.filter(lc => {
      return lc.Collateral_Category_Code === categoryCode && lc.ActionStatus !== 3
    })[lastEditRowIndex];
  }

  getRowData(localloanobject, categoryCode) {
    return localloanobject.LoanCollateral !== null ?
      localloanobject.LoanCollateral.filter(lc => {
        return lc.Collateral_Category_Code === categoryCode && lc.ActionStatus !== 3
      }) : [];
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
    this.getgridheight(rowData);
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

  deleteClicked(rowIndex: any, localloanobject: loan_model, rowData) {
    this.alertify.confirm("Confirm", "Do you Really Want to Delete this Record?").subscribe(res => {
      if (res == true) {
        var obj = rowData[rowIndex];
        if (obj.Collateral_ID == 0) {
          rowData.splice(rowIndex, 1);
          localloanobject.LoanCollateral.splice(localloanobject.LoanCollateral.indexOf(obj), 1);
        } else {
          this.deleteAction = true;
          obj.ActionStatus = 3;
        }
        this.loanserviceworker.performcalculationonloanobject(localloanobject);
      }
    })
  }

  syncToDb(localloanobject: loan_model) {
    this.loanapi.syncloanobject(localloanobject).subscribe(res => {
      if (res.ResCode == 1) {
        this.deleteAction = false;
        this.loanapi.getLoanById(localloanobject.Loan_Full_ID).subscribe(res => {
          this.logging.checkandcreatelog(3, 'Overview', "APi LOAN GET with Response " + res.ResCode);
          if (res.ResCode == 1) {
            this.toasterService.success("Records Synced");
            let jsonConvert: JsonConvert = new JsonConvert();
            this.loanserviceworker.performcalculationonloanobject(jsonConvert.deserialize(res.Data, loan_model));
          }
          else {
            this.toasterService.error("Could not fetch Loan Object from API")
          }
        });
      }
      else {
        this.toasterService.error("Error in Sync");
      }
    });
  }

  /**
   * Helper methods
   */
  getgridheight(rowData) {
    this.style.height = (30 * (rowData.length + 2) - 2).toString() + "px";
  }

  getdataforgrid(localloanobject: loan_model, gridApi, rowData) {
    // let obj: any = this.localstorageservice.retrieve(environment.loankey);
    // this.logging.checkandcreatelog(1, 'LoanCollateral - FSA', "LocalStorage retrieved");
    // if (obj != null && obj != undefined) {
    //   localloanobject = obj;
    //   rowData = [];
    //   rowData = localloanobject.LoanCollateral !== null ? localloanobject.LoanCollateral.filter(lc => { return lc.Collateral_Category_Code === "FSA" && lc.ActionStatus !== 3 }) : [];
    //   this.pinnedBottomRowData = this.fsaService.computeTotal(obj);
    // }
    // this.getgridheight(rowData);
    // this.adjustgrid(gridApi);
    // return rowData;
  }

  public adjustgrid(gridApi) {
    try {
      gridApi.sizeColumnsToFit();
    }
    catch (ex) {
    }
  }

  computeTotal(input, categoryCode) {
    if (categoryCode === CollateralSettings.livestock.key) {
      return this.liveStockService.computeTotal(input);
    } else if (categoryCode === CollateralSettings.fsa.key) {
      return this.fsaService.computeTotal(input);
    } else if (categoryCode === CollateralSettings.equipment.key) {
      return this.equipmentService.computeTotal(input);
    } else if (categoryCode === CollateralSettings.storedCrop.key) {
      return this.storedcropService.computeTotal(input);
    }
  }
}
