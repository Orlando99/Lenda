import { Injectable } from '@angular/core';
import { Insurance_Policy } from '../../models/insurancemodel';
import { LocalStorageService } from '../../../../node_modules/ngx-webstorage';
import { environment } from '../../../environments/environment.prod';
import * as _ from 'lodash'
import { errormodel } from '../../models/commonmodels';
import { PARAMETERS } from '../../../../node_modules/@angular/core/src/util/decorators';

@Injectable()
export class ValidationService {
   
  constructor(private localstorage:LocalStorageService) { }
 //this will validate the Unit Options in Insurance table
  validateInsuranceTable(itemchanged:Insurance_Policy,itemseffected:Array<Insurance_Policy>)
  {
    debugger
    let currenterrors=this.localstorage.retrieve(environment.errorbase) as Array<errormodel>;
    _.remove(currenterrors,function(param){
      return itemseffected.map(p=>p.Policy_id).includes(parseInt(param.cellid.split('_')[1]));
    })
    _.remove(currenterrors,function(param){
      return itemchanged.Policy_id==parseInt(param.cellid.split('_')[1]);
    })
    let itemstoremove=new Array<errormodel>();
    let itemstoadd=new Array<errormodel>();
    itemseffected.forEach(element => {
      let mainpolicyid=element.Policy_id;
      //level check
      if(element.Level==itemchanged.Level){
        itemstoremove.push({cellid:"Ins_"+mainpolicyid+"_Level",errorsection:"Insurance",details:null});
      }
      else{
        itemstoadd.push({cellid:"Ins_"+mainpolicyid+"_Level",errorsection:"Insurance",details:null});
      }
      ///

      //price check
      if(element.Price==itemchanged.Price){
        itemstoremove.push({cellid:"Ins_"+mainpolicyid+"_Price",errorsection:"Insurance",details:null});
      }
      else{
        itemstoadd.push({cellid:"Ins_"+mainpolicyid+"_Price",errorsection:"Insurance",details:null});
      }
      ///

      //premium check
      if(element.Premium==itemchanged.Premium){
        itemstoremove.push({cellid:"Ins_"+mainpolicyid+"_Premium",errorsection:"Insurance",details:null});
      
      }
      else{
        itemstoadd.push({cellid:"Ins_"+mainpolicyid+"_Premium",errorsection:"Insurance",details:null});
      }
      //
      if(element.Unit==itemchanged.Unit){
        itemstoremove.push({cellid:"Ins_"+mainpolicyid+"_Unit",errorsection:"Insurance",details:null});
      
      }
      else{
        itemstoadd.push({cellid:"Ins_"+mainpolicyid+"_Unit",errorsection:"Insurance",details:null});
      }
      //unit check 
      
      if(_.difference(element.Subpolicies.filter(p=>p.ActionStatus!=3).map(p=>p.Ins_Type),itemchanged.Subpolicies.filter(p=>p.ActionStatus!=3).map(p=>p.Ins_Type)).length!=0)
      {
        itemstoadd.push({cellid:"Ins_"+mainpolicyid+"_SecInsurance",errorsection:"Insurance",details:null});
      }
      else{
        itemstoremove.push({cellid:"Ins_"+mainpolicyid+"_SecInsurance",errorsection:"Insurance",details:null}); 
      }
        


    });

    currenterrors.push(...itemstoadd);
    _.remove(currenterrors,function(item){
      return  itemstoremove.map(p=>p.cellid).includes(item.cellid);
    })
    this.localstorage.store(environment.errorbase,_.uniq(currenterrors));
  }
}
