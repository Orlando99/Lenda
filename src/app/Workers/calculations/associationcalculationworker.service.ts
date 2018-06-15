import { Injectable } from '@angular/core';
import { loan_model } from '../../models/loanmodel';

@Injectable()
export class AssociationcalculationworkerService {
  constructor() { }


  prepareLoanassociationmodel(input:loan_model):loan_model{
    // for(let i =0;i<input.Association.length;i++){
    //   input.Farms[i].FC_Total_Acres=input.Association[i].Irr_Acres+input.Association[i].NI_Acres;
    // }
    return input;
  }
}
