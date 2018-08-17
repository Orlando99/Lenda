import { Injectable } from '@angular/core';
import { AlertifyService } from '../../alertify/alertify.service';
import { loan_model, Loan_Collateral, Loan_Marketing_Contract } from '../../models/loanmodel';
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
    boxSizing: 'border-box'
  };

  subscribeToChanges(res, localloanobject, categoryCode, rowData, pinnedBottomRowData) {
    switch (res.srccomponentedit) {
      case CollateralSettings.fsa.component: {
        rowData[res.lasteditrowindex] = this.getLastEditedRow(localloanobject, CollateralSettings.fsa.key, res.lasteditrowindex, CollateralSettings.fsa.source, CollateralSettings.fsa.sourceKey);
        break;
      }
      case CollateralSettings.livestock.component: {
        rowData[res.lasteditrowindex] = this.getLastEditedRow(localloanobject, CollateralSettings.livestock.key, res.lasteditrowindex, CollateralSettings.livestock.source, CollateralSettings.livestock.sourceKey);
        break;
      }
      case CollateralSettings.equipment.component: {
        rowData[res.lasteditrowindex] = this.getLastEditedRow(localloanobject, CollateralSettings.equipment.key, res.lasteditrowindex, CollateralSettings.equipment.source, CollateralSettings.equipment.sourceKey);
        break;
      }
      case CollateralSettings.storedCrop.component: {
        rowData[res.lasteditrowindex] = this.getLastEditedRow(localloanobject, CollateralSettings.storedCrop.key, res.lasteditrowindex, CollateralSettings.storedCrop.source, CollateralSettings.storedCrop.sourceKey);
        break;
      }
      case CollateralSettings.realestate.component: {
        rowData[res.lasteditrowindex] = this.getLastEditedRow(localloanobject, CollateralSettings.realestate.key, res.lasteditrowindex, CollateralSettings.realestate.source, CollateralSettings.realestate.sourceKey);
        break;
      }
      case CollateralSettings.other.component: {
        rowData[res.lasteditrowindex] = this.getLastEditedRow(localloanobject, CollateralSettings.other.key, res.lasteditrowindex, CollateralSettings.other.source, CollateralSettings.other.sourceKey);
        break;
      }
      case CollateralSettings.marketingContracts.component: {
        rowData[res.lasteditrowindex] = this.getLastEditedRow(localloanobject, CollateralSettings.marketingContracts.key, res.lasteditrowindex, CollateralSettings.marketingContracts.source, CollateralSettings.marketingContracts.sourceKey);
        break;
      }
      default: {
        localloanobject = res;
        // If marketing contracts
        if (categoryCode === CollateralSettings.marketingContracts.key) {
          rowData = this.getRowData(localloanobject, categoryCode, CollateralSettings.marketingContracts.source, CollateralSettings.marketingContracts.sourceKey);
        } else {
          rowData = this.getRowData(localloanobject, categoryCode, CollateralSettings.fsa.source, CollateralSettings.fsa.sourceKey);
          pinnedBottomRowData = this.computeTotal(localloanobject, categoryCode);
        }
      }
    }
    return {
      rowData: rowData,
      pinnedBottomRowData: pinnedBottomRowData
    };
  }

  getLastEditedRow(localloanobject, categoryCode, lastEditRowIndex, source, sourceKey) {
    if (sourceKey === '') {
      // Marketing Contracts
      return localloanobject[source].filter(lc => {
        return lc.ActionStatus !== 3
      })[lastEditRowIndex];
    }
    return localloanobject[source].filter(lc => {
      return lc[sourceKey] === categoryCode && lc.ActionStatus !== 3
    })[lastEditRowIndex];
  }

  getRowData(localloanobject, categoryCode, source, sourceKey) {
    if (sourceKey === '') {
      // Marketing Contracts
      return localloanobject[source] !== null ?
        localloanobject[source].filter(lc => {
          return lc.ActionStatus !== 3
        }) : [];
    }
    return localloanobject[source] !== null ?
      localloanobject[source].filter(lc => {
        return lc[sourceKey] === categoryCode && lc.ActionStatus !== 3
      }) : [];
  }

  addRow(localloanobject: loan_model, gridApi, rowData, newItemCategoryCode, source, sourceKey) {
    let newItem;

    if (localloanobject[source] == null) {
      localloanobject[source] = [];
    }

    if (newItemCategoryCode === CollateralSettings.marketingContracts.key) {
      newItem = new Loan_Marketing_Contract();
    } else {
      newItem = new Loan_Collateral();
      if (sourceKey && sourceKey !== '') {
        newItem[sourceKey] = newItemCategoryCode;
        newItem.Disc_Value = 50;
        newItem.ActionStatus = 1
      }
    }
    newItem.Loan_Full_ID = localloanobject.Loan_Full_ID;

    var res = rowData.push(newItem);
    if (newItemCategoryCode !== CollateralSettings.marketingContracts.key) {
      localloanobject[source].push(newItem);
    }
    gridApi.setRowData(rowData);
    if (newItemCategoryCode === CollateralSettings.marketingContracts.key) {
      gridApi.startEditingCell({
        rowIndex: rowData.length - 1,
        colKey: CollateralSettings.marketingContracts.colKey
      });
    } else {
      gridApi.startEditingCell({
        rowIndex: rowData.length - 1,
        colKey: CollateralSettings.fsa.colKey
      });
    }

    
  }

  rowValueChanged(value: any, localloanobject: loan_model, component, source, uniqueKey) {
    
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

  deleteClicked(rowIndex: any, localloanobject: loan_model, rowData, source, uniqueKey) {
    this.alertify.confirm("Confirm", "Do you Really Want to Delete this Record?").subscribe(res => {
      if (res == true) {
        debugger
        var obj = rowData[rowIndex];
        if (obj[uniqueKey] == 0) {
          rowData.splice(rowIndex, 1);
          localloanobject[source].splice(localloanobject[source].indexOf(obj), 1);
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
  

  public adjustgrid(gridApi) {
    try {
      gridApi.sizeColumnsToFit();
    }
    catch (ex) {
    }
  }

  computeTotal(input, categoryCode) {
    switch (categoryCode) {
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
