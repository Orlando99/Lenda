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
import { RealEstateService } from './realestate/realestate.service';
import { OthersService } from './others/others.service';
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
    public storedcropService: StoredCropService,
    public realEstateService: RealEstateService,
    public othersService: OthersService
  ) {
  }

  style = {
    marginTop: '10px',
    width: '97%',
    height: '110px',
    boxSizing: 'border-box'
  };

  subscribeToChanges(res, localloanobject, categoryCode, rowData, pinnedBottomRowData) {
    switch (res.srccomponentedit) {
      case CollateralSettings.fsa.component: {
        rowData[res.lasteditrowindex] = this.getLastEditedRow(localloanobject, CollateralSettings.fsa.key, res.lasteditrowindex);
        break;
      }
      case CollateralSettings.livestock.component: {
        rowData[res.lasteditrowindex] = this.getLastEditedRow(localloanobject, CollateralSettings.livestock.key, res.lasteditrowindex);
        break;
      }
      case CollateralSettings.equipment.component: {
        rowData[res.lasteditrowindex] = this.getLastEditedRow(localloanobject, CollateralSettings.equipment.key, res.lasteditrowindex);
        break;
      }
      case CollateralSettings.storedCrop.component: {
        rowData[res.lasteditrowindex] = this.getLastEditedRow(localloanobject, CollateralSettings.storedCrop.key, res.lasteditrowindex);
        break;
      }
      case CollateralSettings.realestate.component: {
        rowData[res.lasteditrowindex] = this.getLastEditedRow(localloanobject, CollateralSettings.realestate.key, res.lasteditrowindex);
        break;
      }
      case CollateralSettings.other.component: {
        rowData[res.lasteditrowindex] = this.getLastEditedRow(localloanobject, CollateralSettings.other.key, res.lasteditrowindex);
        break;
      }
      default: {
        localloanobject = res;
        rowData = this.getRowData(localloanobject, categoryCode);
        pinnedBottomRowData = this.computeTotal(localloanobject, categoryCode);
      }
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

  public adjustgrid(gridApi) {
    try {
      gridApi.sizeColumnsToFit();
    }
    catch (ex) {
    }
  }

  computeTotal(input, categoryCode) {
    switch(categoryCode) {
      case CollateralSettings.livestock.key: {
        return this.liveStockService.computeTotal(input);
      }
      case CollateralSettings.fsa.key: {
        return this.fsaService.computeTotal(input);
      }
      case CollateralSettings.equipment.key: {
        return this.equipmentService.computeTotal(input);
      }
      case CollateralSettings.storedCrop.key: {
        return this.storedcropService.computeTotal(input);
      }
      case CollateralSettings.realestate.key: {
        return this.realEstateService.computeTotal(input);
      }
      case CollateralSettings.other.key: {
        return this.othersService.computeTotal(input);
      }
    }
  }
}
