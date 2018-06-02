import { Injectable } from '@angular/core';
import { loan_model } from '../../models/loanmodel';
import { Loan_Crop_History_FC } from '../../models/cropmodel';
import { count } from 'rxjs/operators';

@Injectable()
export class LoancrophistoryService {
  public input:loan_model;
  public uniquecrops=[];
  public valuestouse=[];
  public returnables=new Array<Loan_Crop_History_FC>();
  public years=[];
  constructor() {
    for(let i=1;i<7;i++){
      this.years.push(new Date().getFullYear()-i);
   }
   }


  filteritems(){
    this.valuestouse=this.input.CropYield.filter(p=>this.years.indexOf(p.Crop_Year)!=-1);
    this.uniquecrops=this.input.CropYield.map(p=>p.Crop_Type_Code).filter((value, index, self) => self.indexOf(value) === index)
    this.uniquecrops.forEach(element => {
      let insert=new Loan_Crop_History_FC();
      insert.FC_Crop_Type_Code=element;
      this.returnables.push(insert);
    });
    //   let obj=new View_cropyield()
    //   obj.Crop_Type_Code=element;
    //   obj.Crop_Type=this.croppricesdetails.find(p=>p.Crop_Type_Code==element).Crop_Code;
    //   this.years.forEach(element1 => {
    //     let foundobj=this.localloanobject.CropYield.find(p=>p.Crop_Year==element1);
    //     if(foundobj!=null){
    //       obj[element1+"_yield"]=foundobj.Crop_Yield;
    //     }
    //     else{
    //       obj[element1+"_yield"]=0;
    //     }
    //     obj.Loan_ID=valuestouse[0].Loan_ID;
    //     obj.Practice_Type_Code=valuestouse.find(p=>p.Crop_Type_Code==element).Practice_Type_Code;
    //   });
    //   this.arrayrow.push(obj);
    //  });
  }
  


  prepare_Crop_Yield(){
    debugger
    for(let i =0;i<this.returnables.length;i++)
    {
      let element=this.returnables[i];
      let cropyielditems=[];
      this.years.forEach(year => {
        let foundobj=this.input.CropYield.find(p=>p.Crop_Year==year && p.Crop_Type_Code==element.FC_Crop_Type_Code);
        if(foundobj!=null){
          cropyielditems.push(foundobj.Crop_Yield);
        }
        else{
          
        }
      });
      if(cropyielditems.length<=2){
        element.FC_Crop_Yield==element.FC_Crop_APH;
      }
      else{
        let sum=cropyielditems.reduce((p,n)=>{
          return p+n;
          });
          debugger
          let max=Math.max.apply(null,cropyielditems);
          let min=Math.min.apply(null,cropyielditems);
          let coutie=(cropyielditems.length-2);
        element.FC_Crop_Yield=((sum) - max -min)/coutie;
      }
    }
  } 

  prepareLoancrophistorymodel(input:loan_model):Array<Loan_Crop_History_FC>{
    debugger
    this.input=input;
    this.filteritems();
    this.prepare_Crop_Yield();
    return this.returnables;
  }
}
