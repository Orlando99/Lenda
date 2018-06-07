import { Injectable } from '@angular/core';
import { loan_model } from '../../models/loanmodel';

@Injectable()
export class FarmcalculationworkerService {
  constructor() { }


  prepareLoanfarmmodel(input:loan_model):loan_model{
    debugger
    for(let i =0;i<input.Farms.length;i++){
      input.Farms[i].FC_Total_Acres=input.Farms[i].Irr_Acres+input.Farms[i].NI_Acres;
    }
    return input;
  }
}
