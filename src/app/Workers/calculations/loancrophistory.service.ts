import { Injectable } from '@angular/core';
import { loan_model } from '../../models/loanmodel';
import { Loan_Crop_History_FC } from '../../models/cropmodel';
import { count } from 'rxjs/operators';
import { LoggingService } from '../../services/Logs/logging.service';

@Injectable()
export class LoancrophistoryService {
  public input: loan_model;

  public returnables = new Array<Loan_Crop_History_FC>();
  public years = [];
  constructor(private logging: LoggingService) {
    // for (let i = 1; i < 8; i++) {
    //   this.years.push(new Date().getFullYear() - i);
    // }
  }
  prepare_Crop_Yield() {
    // 
    for (let i = 0; i < this.input.CropYield.length; i++) {
  
      let cropyielditems = [];
      this.years = [];
      for (let year = 1 ; year < 8; year++) {
        this.years.push(this.input.CropYield[i].CropYear - year);
      }
      this.years.forEach(year => {
        if (this.input.CropYield[i][year] != null && this.input.CropYield[i][year] != 0) {
          cropyielditems.push(this.input.CropYield[i][year])
        }
      });
      if (cropyielditems.length <= 2) {
        this.input.CropYield[i].CropYield == this.input.CropYield[i].APH;
      }
      else{
        let sum=cropyielditems.reduce((p,n)=>{
          return p+n;
          });
          let max=Math.max.apply(null,cropyielditems);
          let min=Math.min.apply(null,cropyielditems);
          let coutie=(cropyielditems.length-2);
          this.input.CropYield[i].CropYield=Math.round(((sum) - max -min)/coutie);
      }
    }
  }

  prepareLoancrophistorymodel(input: loan_model): loan_model {
  
    try {
      this.input = input;
      let starttime = new Date().getMilliseconds();
      this.prepare_Crop_Yield();
      let endtime = new Date().getMilliseconds();
      this.logging.checkandcreatelog(3, 'Calc_CropYield', "LoanCalculation timetaken :" + (starttime - endtime).toString() + " ms");
      return this.input;
    }
    catch(e){
      this.logging.checkandcreatelog(3, 'Calc_CropYield', e);
      return input;
    }
  }
}
