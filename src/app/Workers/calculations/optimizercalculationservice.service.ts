import { Injectable } from '@angular/core';
import { loan_model } from '../../models/loanmodel';
import * as _ from 'lodash'
@Injectable()
export class OptimizercalculationService {

  constructor() { }

  performcalculations(input: loan_model) {
    try{
     
    let distinctcrops = _.uniqBy(input.LoanCropUnits, 'Crop_Practice_ID');
    distinctcrops.forEach(element => {
      input.LoanCropPractices.find(p => p.Crop_Practice_ID == element.Crop_Practice_ID).LCP_Acres =
        _.sumBy(input.LoanCropUnits.filter(p => p.Crop_Practice_ID == element.Crop_Practice_ID), function (o) { return o.CU_Acres; });
        input.LoanCropPractices.find(p => p.Crop_Practice_ID == element.Crop_Practice_ID).ActionStatus=2;
    });
     
     }
     catch{
       
     }
    return input;
  }

}
