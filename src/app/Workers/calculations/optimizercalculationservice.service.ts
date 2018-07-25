import { Injectable } from '@angular/core';
import { loan_model } from '../../models/loanmodel';
import * as _ from 'lodash'
import { LoggingService } from '../../services/Logs/logging.service';
@Injectable()
export class OptimizercalculationService {

  constructor(public logging: LoggingService) { }

  performcalculations(input: loan_model) {
    let starttime = new Date().getTime();
    try{
      let distinctcrops = _.uniqBy(input.LoanCropUnits, 'Crop_Practice_ID');
      distinctcrops.forEach(element => {
        input.LoanCropPractices.find(p => p.Crop_Practice_ID == element.Crop_Practice_ID).LCP_Acres =
          _.sumBy(input.LoanCropUnits.filter(p => p.Crop_Practice_ID == element.Crop_Practice_ID), function (o) { return o.CU_Acres; });
          input.LoanCropPractices.find(p => p.Crop_Practice_ID == element.Crop_Practice_ID).ActionStatus=2;
      });
     }
     catch{
       console.log("Error in Optimizer Calculations")
     }

     let endtime = new Date().getTime();
     this.logging.checkandcreatelog(3, 'Calc_Optimizer_1', "LoanCalculation timetaken :" + (endtime - starttime).toString() + " ms");
    return input;
  }

}
