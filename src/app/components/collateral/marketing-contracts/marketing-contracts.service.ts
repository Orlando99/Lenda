import { Injectable } from '@angular/core';
import { loan_model, Loan_Collateral, Loan_Marketing_Contract } from '../../../models/loanmodel';
import * as _ from 'lodash';
import { environment } from '../../../../environments/environment';
import { LocalStorageService } from 'ngx-webstorage';
import { PriceFormatter, PercentageFormatter } from '../../../Workers/utility/aggrid/formatters';
import { getNumericCellEditor, numberValueSetter } from '../../../Workers/utility/aggrid/numericboxes';
import { MarketingcontractcalculationService } from '../../../Workers/calculations/marketingcontractcalculation.service';
import CollateralSettings from './../collateral-types.model';
import { LoancalculationWorker } from '../../../Workers/calculations/loancalculationworker';

/**
 * Shared service for Marketing Contracts
 */
@Injectable()
export class MarketingContractsService {
  private localloanobject;
  private refdata;
  constructor(
    public localStorageService: LocalStorageService,
    public marketingCalculationService: MarketingcontractcalculationService,
    public loanserviceworker: LoancalculationWorker) {
    this.localloanobject = this.localStorageService.retrieve(environment.loankey);
    this.refdata = this.localStorageService.retrieve(environment.referencedatakey);
  }

  getColumnDefs() {
    return [
      {
        headerName: 'Category', field: 'Category', cellClass: 'editable-color', editable: true, cellEditor: "selectEditor",
        cellEditorParams: {
          values: [{ key: 1, value: 'Crop' }, { key: 2, value: 'Stored Crop' }]
        },
        valueFormatter: function (params) {

          if (params.value) {
            var selectedValue = params.colDef.cellEditorParams.values.find(data => data.key == params.value);
            if (selectedValue) {
              return selectedValue.value;
            } else {
              return undefined;
            }
          } else {
            return '';
          }

        },
        width: 100
      },
      {
        headerName: 'Crop', field: 'Crop_Code', cellClass: 'editable-color', editable: true, cellEditor: "selectEditor",
        cellEditorParams: this.getCropValues.bind(this),
        valueFormatter: (params) => {

          let cropValues: any[] = this.getCropValues(params).values;

          if (params.value) {
            var selectedValue = cropValues.find(data => data.key == params.value);
            if (selectedValue) {
              return selectedValue.value;
            } else {
              return undefined;
            }
          } else {
            return '';
          }

        },
        width: 100
      },
      {
        headerName: 'Crop Type', field: 'Crop_Type_Code', editable: true, width: 100, cellEditor: "alphaNumeric", cellClass: 'editable-color',
        cellEditorParams: (params) => {
          return { value: params.data.Crop_Type_Code || '' }
        },
      },
      {
        headerName: 'Buyer', field: 'Assoc_ID', cellClass: 'editable-color', editable: true, cellEditor: "selectEditor",
        cellEditorParams: this.getBuyersValue.bind(this),
        valueFormatter: (params) => {

          let cropValues: any[] = this.getBuyersValue(params).values;

          if (params.value) {
            var selectedValue = cropValues.find(data => data.key == params.value);
            if (selectedValue) {
              return selectedValue.value;
            } else {
              return undefined;
            }
          } else {
            return '';
          }

        },
        width: 100

      },
      { headerName: 'Contract', field: 'Contract', editable: true, width: 100 },
      { headerName: 'Description', field: 'Description_Text', editable: true, width: 100, cellClass: ['editable-color'] },
      {
        headerName: 'Quantity', field: 'Quantity', editable: true, cellEditor: "numericCellEditor", cellClass: ['editable-color', 'text-right'],
        valueSetter: numberValueSetter,
        valueFormatter: function (params) {
          if (params.value) {
            return params.value.toFixed(0).replace(/\d(?=(\d{3})+\.)/g, '$&,')
          } else {
            return 0;
          }
        },
        width: 100
      },
      {
        headerName: 'Price', field: 'Price', editable: true, width: 150, cellEditor: "numericCellEditor", cellClass: ['editable-color', 'text-right'],
        valueSetter: numberValueSetter,
        valueFormatter: function (params) {
          return PriceFormatter(params.value);
        }
      },
      {
        headerName: 'Mkt Value', field: 'Market_Value', width: 180, cellClass: ['text-right'],
        valueFormatter: function (params) {
          return PriceFormatter(params.value);
        }
      },
      {
        headerName: 'Contract %', field: 'Contract_Per', width: 100, cellClass: ['text-right'],
        valueFormatter: function (params) {
          return PercentageFormatter(params.value);
        }
      },
      { headerName: '', field: 'value', cellRenderer: "deletecolumn" },

    ];
  }

  rowvaluechanged(value: any) {
    var obj: Loan_Marketing_Contract = value.data;
    if (obj.Contract_ID == undefined) {
      obj.Contract_ID = 0
      obj.Price = 0;
      obj.Quantity = 0;
      obj.ActionStatus = 1;
      this.localloanobject.LoanMarketingContracts[this.localloanobject.LoanMarketingContracts.length] = value.data;
    }
    else {
      var rowindex = this.localloanobject.LoanMarketingContracts.findIndex(mc => mc.Contract_ID == obj.Contract_ID);
      if (obj.ActionStatus != 1)
        obj.ActionStatus = 2;
      this.localloanobject.LoanMarketingContracts[rowindex] = obj;
    }
    this.marketingCalculationService.updateMktValueAndContractPer(this.localloanobject, obj);

    //this shall have the last edit
    this.localloanobject.srccomponentedit = CollateralSettings.marketingContracts.component;
    this.localloanobject.lasteditrowindex = value.rowIndex;
    this.loanserviceworker.performcalculationonloanobject(this.localloanobject);
  }

  getBuyersValue(params) {
    let buyersValue = [];
    if (this.localloanobject.Association && this.localloanobject.Association.length > 0) {
      this.localloanobject.Association.filter(as => as.Assoc_Type_Code === "BUY").map(buyer => {
        buyersValue.push({ key: buyer.Assoc_ID, value: buyer.Assoc_Name });
      });
      buyersValue = _.uniqBy(buyersValue, 'key');
      return { values: buyersValue };
    } else {
      return { values: [] };
    }
  }

  getCropValues(params) {
    let cropValues = [];
    if (params.data.Category == 1) {
      if (this.localloanobject.LoanCropPractices && this.localloanobject.LoanCropPractices.length > 0) {
        let cropPracticeIds = [];
        this.localloanobject.LoanCropPractices.map(cp => {
          cropPracticeIds.push(cp.Crop_Practice_ID);
        });
        cropPracticeIds = _.uniq(cropPracticeIds);

        if (this.refdata && this.refdata.CropList) {
          cropPracticeIds.map(cpi => {
            this.refdata.CropList.map(cl => {
              if (cl.Crop_And_Practice_ID == cpi) {
                cropValues.push({ key: cl.Crop_Code, value: cl.Crop_Name })
              }
            })
          })
        }
      }
      cropValues = _.uniqBy(cropValues, 'key');
      return { values: cropValues };
    } else if (params.data.Category == 2) {
      if (this.localloanobject.LoanCollateral && this.localloanobject.LoanCollateral.length > 0) {
        let cropPracticeIds = [];
        this.localloanobject.LoanCollateral.filter(lc => lc.Collateral_Category_Code === "SCP").map(lc => {
          cropValues.push({ key: lc.Collateral_Description.split(' ').join('_'), value: lc.Collateral_Description });
        });

        cropValues = _.uniqBy(cropValues, 'key');
        return { values: cropValues };
      }
    } else {
      return { values: [] };
    }
  }
}
