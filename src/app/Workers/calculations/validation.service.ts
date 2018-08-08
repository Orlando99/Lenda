import { Injectable } from '@angular/core';
import { Insurance_Policy } from '../../models/insurancemodel';
import { LocalStorageService } from '../../../../node_modules/ngx-webstorage';
import { environment } from '../../../environments/environment.prod';
import * as _ from 'lodash'
import { errormodel } from '../../models/commonmodels';


@Injectable()
export class ValidationService {
  private refdata; 
  constructor(private localstorage:LocalStorageService) {
    this.refdata=this.localstorage.retrieve(environment.referencedatakey);
   }
 //this will validate the Unit Options in Insurance table
  validateInsuranceTable(itemchanged:Insurance_Policy,itemseffected:Array<Insurance_Policy>)
  {
    //get current errors 
    let currenterrors=this.localstorage.retrieve(environment.errorbase) as Array<errormodel>;
    //remove all errors first
    _.remove(currenterrors,function(param){
      return itemseffected.map(p=>p.Policy_id).includes(parseInt(param.cellid.split('_')[1]));
    })
    //remove errors from reference item also
    _.remove(currenterrors,function(param){
      return itemchanged.Policy_id==parseInt(param.cellid.split('_')[1]);
    })
    // this variable has all the items in current effected county
    let allinsuranceitems=_.merge(itemseffected,itemchanged);
    //initialise the temporary variables
    let itemstoremove=new Array<errormodel>();
    let itemstoadd=new Array<errormodel>();
    // now lets loop throught the effected elements and compare with reference item
    //first loop will check for all crops according to county so only Unit will be checked
    itemseffected.forEach(element => {
      let mainpolicyid=element.Policy_id;
      //unit check 
      if(element.Unit==itemchanged.Unit){
        itemstoremove.push({cellid:"Ins_"+mainpolicyid+"_Unit",errorsection:"Insurance",details:["dirty"]});
      }
      else{
        itemstoadd.push({cellid:"Ins_"+mainpolicyid+"_Unit",errorsection:"Insurance",details:["dirty"]});
      }  
    });

    //SECOND LOOP 
    //this loop will check sets with same crop bundles in county filtered items
    //EU required the set of county and crop to have the same values
    
    //So lets select unique crops first 
    let cropsets=_.uniq(allinsuranceitems.map(p=>{
        return this.refdata.CropList.find(x=>x.Crop_And_Practice_ID==p.Crop_Practice_Id).Crop_Code;
    }));
    
    //now loop throught each crop and taking first as reference item ..lets sets errors on crop based sets

    cropsets.forEach(element => {
       //get croptypefirst
       let availablecroppracticesets=this.refdata.CropList.filter(p=>p.Crop_Code==element);
       let cropset=allinsuranceitems.filter(p=>availablecroppracticesets.includes(p.Crop_Practice_Id));
       //lets take the first element as reference 
       

    });
    
    itemseffected.forEach(element => {
      let mainpolicyid=element.Policy_id;
      //unit check 
      if(element.Unit==itemchanged.Unit){
        itemstoremove.push({cellid:"Ins_"+mainpolicyid+"_Unit",errorsection:"Insurance",details:["dirty"]});
      }
      else{
        itemstoadd.push({cellid:"Ins_"+mainpolicyid+"_Unit",errorsection:"Insurance",details:["dirty"]});
      }  
    });


    //////////////////////////////

    currenterrors.push(...itemstoadd);
    _.remove(currenterrors,function(item){
      return  itemstoremove.map(p=>p.cellid).includes(item.cellid);
    })
    this.localstorage.store(environment.errorbase,_.uniq(currenterrors));
  }

  validateInsurancePolicies(params:any,inspolicies:Array<Insurance_Policy>){
    let insuranceunit=params.data;
    //These are the policies in same county ..
    //Check for EU by default
    if(inspolicies.filter(p=>p.County_Id==insuranceunit.Countyid).find(p=>p.Unit=="EU") !=null)
    {
     //Means the set has EU Selected in same county so we need to prioritize the EU for the County
      if(insuranceunit.Unit=="EU") //if the same is EU the lets take this as reference
      {
        let effectedpolicies=inspolicies.filter(p=>p.County_Id==insuranceunit.Countyid && p.Policy_id!=insuranceunit.mainpolicyId);
        let invokerpolicy=inspolicies.find(p=>p.Policy_id==insuranceunit.mainpolicyId);
        this.validateInsuranceTable(invokerpolicy,effectedpolicies);
      }
      else{
        let invokerpolicy=inspolicies.find(p=>p.County_Id==insuranceunit.Countyid);
        let effectedpolicies=inspolicies.filter(p=>p.County_Id==insuranceunit.Countyid && p.Policy_id!=invokerpolicy.Policy_id);
        this.validateInsuranceTable(invokerpolicy,effectedpolicies);
      }
    }
    //  this.retrieveerrors();
    //  seterrors(this.errorlist);
   }
}
