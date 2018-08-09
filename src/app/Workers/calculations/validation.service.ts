import { Injectable } from '@angular/core';
import { Insurance_Policy } from '../../models/insurancemodel';
import { LocalStorageService } from '../../../../node_modules/ngx-webstorage';
import { environment } from '../../../environments/environment.prod';
import * as _ from 'lodash'
import { errormodel } from '../../models/commonmodels';


@Injectable()
export class ValidationService {
  private refdata;
  constructor(private localstorage: LocalStorageService) {
    this.refdata = this.localstorage.retrieve(environment.referencedatakey);
  }
  //this will validate the Unit Options in Insurance table
  validateInsuranceTable(itemchanged: Insurance_Policy, itemseffected: Array<Insurance_Policy>) {
    //get current errors 
    let currenterrors = this.localstorage.retrieve(environment.errorbase) as Array<errormodel>;
    //remove all errors first
    _.remove(currenterrors, function (param) {
      return itemseffected.map(p => p.Policy_id).includes(parseInt(param.cellid.split('_')[1]));
    })
    //remove errors from reference item also
    _.remove(currenterrors, function (param) {
      return itemchanged.Policy_id == parseInt(param.cellid.split('_')[1]);
    })
    // this variable has all the items in current effected county
    let allinsuranceitems = _.merge(itemseffected, itemchanged);
    //initialise the temporary variables
    let itemstoremove = new Array<errormodel>();
    let itemstoadd = new Array<errormodel>();
    // now lets loop throught the effected elements and compare with reference item
    //first loop will check for all crops according to county so only Unit will be checked
    itemseffected.forEach(element => {
      debugger
      let mainpolicyid = element.Policy_id;
      //unit check 
      if (element.Unit == itemchanged.Unit) {
        itemstoremove.push({ cellid: "Ins_" + mainpolicyid + "_Unit", errorsection: "Insurance", details: ["dirty"] });
      }
      else {
        itemstoadd.push({ cellid: "Ins_" + mainpolicyid + "_Unit", errorsection: "Insurance", details: ["dirty"] });
      }
    });

    //SECOND LOOP 
    //this loop will check sets with same crop bundles in county filtered items
    //EU required the set of county and crop to have the same values

    //So lets select unique crops first 
    //This thing currently only runs if you have all EUs in County
    if (allinsuranceitems.find(p => p.Unit != "EU") == undefined) { // check if all items have EU
      debugger
      itemseffected.forEach(element => {
        let mainpolicyid = element.Policy_id;
        //Insurance Types Check
        if (!arraysEqual(element.Subpolicies.filter(p => p.ActionStatus != 3).map(p => p.Ins_Type), itemchanged.Subpolicies.filter(p => p.ActionStatus != 3).map(p => p.Ins_Type)))
         {
          itemstoadd.push({ cellid: "Ins_" + mainpolicyid + "_SecInsurance", errorsection: "Insurance", details: ["dirty"] });
        }
        else {
          //validate subpolicies here
          itemchanged.Subpolicies.filter(p => p.ActionStatus != 3).forEach(subpol => {
            Object.keys(subpol).forEach(key=>{
              if(key!="FK_Policy_Id" && key!="ActionStatus" && key!="Ins_SubType" && key!="Ins_Type" && key!="SubPolicy_Id")
              {
                let compareto=element.Subpolicies.filter(p => p.ActionStatus != 3).find(p=>p.Ins_Type==subpol.Ins_Type);
                if(subpol[key]!=compareto[key]){
                  itemstoadd.push({ cellid: "Ins_" + mainpolicyid + "_"+key+"_"+subpol.Ins_Type, errorsection: "Insurance", details: ["dirty"] });
                }
              }
            })
          });
        }

        //premium check
        if (element.Premium == itemchanged.Premium) {
          itemstoremove.push({ cellid: "Ins_" + mainpolicyid + "_Premium", errorsection: "Insurance", details: ["dirty"] });

        }
        else {
          itemstoadd.push({ cellid: "Ins_" + mainpolicyid + "_Premium", errorsection: "Insurance", details: ["dirty"] });
        }

        //price check
        if (element.Price == itemchanged.Price) {
          itemstoremove.push({ cellid: "Ins_" + mainpolicyid + "_Price", errorsection: "Insurance", details: ["dirty"] });
        }
        else {
          itemstoadd.push({ cellid: "Ins_" + mainpolicyid + "_Price", errorsection: "Insurance", details: ["dirty"] });
        }

        //level check
        if (element.Level == itemchanged.Level) {
          itemstoremove.push({ cellid: "Ins_" + mainpolicyid + "_Level", errorsection: "Insurance", details: ["dirty"] });
        }
        else {
          itemstoadd.push({ cellid: "Ins_" + mainpolicyid + "_Level", errorsection: "Insurance", details: ["dirty"] });
        }
        ///
        
       

      });
    }





    //////////////////////////////

    currenterrors.push(...itemstoadd);
    _.remove(currenterrors, function (item) {
      return itemstoremove.map(p => p.cellid).includes(item.cellid);
    })
    this.localstorage.store(environment.errorbase, _.uniq(currenterrors));
  }

  validateInsurancePolicies(params: any, inspolicies: Array<Insurance_Policy>) {
    debugger
    let insuranceunit = params.data;
    //These are the policies in same county ..
    //Check for EU by default
    if (inspolicies.filter(p => p.County_Id == insuranceunit.Countyid).find(p => p.Unit == "EU") != null) {
      //Means the set has EU Selected in same county so we need to prioritize the EU for the County
      if (insuranceunit.Unit == "EU") //if the same is EU the lets take this as reference
      {
        //let not working
        var effectedpolicies = inspolicies.filter(p => p.County_Id == insuranceunit.Countyid && p.Policy_id != insuranceunit.mainpolicyId);
        let invokerpolicy = inspolicies.find(p => p.Policy_id == insuranceunit.mainpolicyId);
        this.validateInsuranceTable(invokerpolicy, effectedpolicies);
      }
      else {
        debugger
        let invokerpolicy= inspolicies.find(p => p.County_Id == insuranceunit.Countyid && p.Unit=="EU");
        let effectedpolicies:any[] = inspolicies.filter(p => p.County_Id == insuranceunit.Countyid && p.Policy_id != invokerpolicy.Policy_id);
        this.validateInsuranceTable(invokerpolicy, effectedpolicies);
      }
    }
    //  this.retrieveerrors();
    //  seterrors(this.errorlist);
  }
}
function arraysEqual(_arr1, _arr2) {

  if (!Array.isArray(_arr1) || ! Array.isArray(_arr2) || _arr1.length !== _arr2.length)
    return false;

  var arr1 = _arr1.concat().sort();
  var arr2 = _arr2.concat().sort();

  for (var i = 0; i < arr1.length; i++) {

      if (arr1[i] !== arr2[i])
          return false;

  }

  return true;

}