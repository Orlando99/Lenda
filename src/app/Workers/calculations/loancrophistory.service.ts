import { Injectable } from '@angular/core';
import { loan_model } from '../../models/loanmodel';
import { Loan_Crop_History_FC } from '../../models/cropmodel';
import { count } from 'rxjs/operators';

@Injectable()
export class LoancrophistoryService {
  public input:loan_model;
 
  public returnables=new Array<Loan_Crop_History_FC>();
  public years=[];
  constructor() {
    for(let i=1;i<7;i++){
      this.years.push(new Date().getFullYear()-i);
   }
   }
  prepare_Crop_Yield(){
    debugger
    for(let i =0;i<this.input.CropYield.length;i++)
    {
     debugger
      let cropyielditems=[];
      this.years.forEach(year => {
       if(this.input.CropYield[i][year]!=null){
        cropyielditems.push(this.input.CropYield[i][year])
       }
      });
      if(cropyielditems.length<=2){
        this.input.CropYield[i].CropYield==this.input.CropYield[i].APH;
      }
      else{
        let sum=cropyielditems.reduce((p,n)=>{
          return p+n;
          });
          debugger
          let max=Math.max.apply(null,cropyielditems);
          let min=Math.min.apply(null,cropyielditems);
          let coutie=(cropyielditems.length-2);
          this.input.CropYield[i].CropYield=((sum) - max -min)/coutie;
      }
    }
  } 

  prepareLoancrophistorymodel(input:loan_model):loan_model{
    debugger
    this.input=input;
    this.prepare_Crop_Yield();
    return this.input;
  }
}
