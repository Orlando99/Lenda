import { Injectable } from '@angular/core';
import { loan_model, Loan_Collateral } from '../../../models/loanmodel';
import * as _ from 'lodash';
import { environment } from '../../../../environments/environment';
import { LocalStorageService } from 'ngx-webstorage';

/**
 * Shared service for Marketing Contracts
 */
@Injectable()
export class MarketingContractsService {
  private localloanobject;
  private refdata;
  constructor(public localStorageService: LocalStorageService) {
    this.localloanobject = this.localStorageService.retrieve(environment.loankey);
    this.refdata = this.localStorageService.retrieve(environment.referencedatakey);
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
