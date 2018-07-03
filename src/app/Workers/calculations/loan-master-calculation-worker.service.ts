import { Injectable } from '@angular/core';
import { loan_model } from '../../models/loanmodel';
import { LocalStorageService } from 'ngx-webstorage';
import { environment } from '../../../environments/environment.prod';

@Injectable()
export class LoanMasterCalculationWorkerService {

  localloanobj: loan_model;
  loanMaster: any;
  incomeConstant: Array<number> = [100, 90, 90, 90, 90];
  insuranceConstant: Array<number> = [115, 100, 100, 100, 100];
  discNetWorthConstant: Array<number> = [100, 100, 100, 100, 100];

  constructor(private localstorageservice: LocalStorageService) {

    this.localloanobj = this.localstorageservice.retrieve(environment.loankey);
    if (this.localloanobj && this.localloanobj.LoanMaster && this.localloanobj.LoanMaster[0] && this.localloanobj.Borrower) {

      this.loanMaster = { ...this.localloanobj.LoanMaster[0] };
    }
  }

  getRevanueThresholdValue() {
    let temp =   this.loanMaster.Net_Market_Value_Crops || 0 + this.loanMaster.Net_Market_Value_Stored_Crops ||0 + this.loanMaster.Net_Market_Value_FSA ||0 + this.loanMaster.Net_Market_Value_Livestock || 0+ 
    this.loanMaster.Net_Market_Value__Other || 0;
    return temp;
    
  }

  getRevanueThresholdStaticValues(){
    let revanueThresholdValue = this.getRevanueThresholdValue();
    return this.incomeConstant.map((val, index)=> Math.round(revanueThresholdValue * val / 100));
  }


  getMaxCropLoanValue() {
    return  this.loanMaster.Net_Market_Value_Insurance || 0 + this.loanMaster.Net_Market_Value_Stored_Crops  ||0 + this.loanMaster.Net_Market_Value_FSA  ||0 + this.loanMaster.Net_Market_Value_Livestock || 0+ 
    this.loanMaster.Net_Market_Value__Other || 0;
    
  }

  getMaxCropLoanStaticValues(){
    let maxCropLoanValue = this.getMaxCropLoanValue();
    return this.insuranceConstant.map((val, index)=> Math.round(maxCropLoanValue * val / 100));
  }

  getDiscNetWorthValue(){
    return this.loanMaster.Net_Worth_Disc_Amount;
  }

  getDiscWorthStaticValue(){
    let discWorthValue = this.getDiscNetWorthValue();
    return this.discNetWorthConstant.map((val, index)=> Math.round(discWorthValue * val / 100));
  }

  getAgProMaxAdditionStaticValue(){
    let maxCropStaticValues = this.getMaxCropLoanStaticValues();
    let discNetWorthStaticValue = this.getDiscWorthStaticValue();
    return [Math.min(maxCropStaticValues[0],discNetWorthStaticValue[0]),Math.min(maxCropStaticValues[1],discNetWorthStaticValue[1]),'-','-','-']
  }

}
