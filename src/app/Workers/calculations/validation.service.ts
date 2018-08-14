import { Injectable } from '@angular/core';
import { Insurance_Policy } from '../../models/insurancemodel';
import { LocalStorageService } from 'ngx-webstorage';
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
  validateInsuranceTable(itemchanged: Insurance_Policy, itemseffected: Array<Insurance_Policy>, currenterrors: Array<errormodel>) {
    //get current errors 

    // //remove all errors first
    // _.remove(currenterrors, function (param) {
    //   return itemseffected.map(p => p.Policy_id).includes(parseInt(param.cellid.split('_')[1]));
    // })
    // //remove errors from reference item also
    // _.remove(currenterrors, function (param) {
    //   return itemchanged.Policy_id == parseInt(param.cellid.split('_')[1]);
    // })
    // this variable has all the items in current effected county
    let allinsuranceitems = _.merge(itemseffected, itemchanged);
    //initialise the temporary variables
    let itemstoremove = new Array<errormodel>();
    let itemstoadd = new Array<errormodel>();
    // now lets loop throught the effected elements and compare with reference item
    //first loop will check for all crops according to county so only Unit will be checked
    itemseffected.forEach(element => {

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

      itemseffected.forEach(element => {
        let mainpolicyid = element.Policy_id;
        //Insurance Types Check
        if (!arraysEqual(element.Subpolicies.filter(p => p.ActionStatus != 3).map(p => p.Ins_Type), itemchanged.Subpolicies.filter(p => p.ActionStatus != 3).map(p => p.Ins_Type))) {
          itemstoadd.push({ cellid: "Ins_" + mainpolicyid + "_SecInsurance", errorsection: "Insurance", details: ["dirty"] });
        }
        else {
          //validate subpolicies here
          itemchanged.Subpolicies.filter(p => p.ActionStatus != 3).forEach(subpol => {
            Object.keys(subpol).forEach(key => {
              if (key != "FK_Policy_Id" && key != "ActionStatus" && key != "Ins_SubType" && key != "Ins_Type" && key != "SubPolicy_Id") {
                let compareto = element.Subpolicies.filter(p => p.ActionStatus != 3).find(p => p.Ins_Type == subpol.Ins_Type);
                if (subpol[key] != compareto[key]) {
                  itemstoadd.push({ cellid: "Ins_" + mainpolicyid + "_" + key + "_" + subpol.Ins_Type, errorsection: "Insurance", details: ["dirty"] });
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
    //get all policies in county
    let currenterrors = this.localstorage.retrieve(environment.errorbase) as Array<errormodel>;
    let policyids = inspolicies.filter(p => p.County_Id == params.data.Countyid).map(p => p.Policy_id);
    _.remove(currenterrors, function (param) {
      return policyids.includes(parseInt(param.cellid.split('_')[1]));
    })
    let insuranceunit = params.data;
    let attachedPolicy = inspolicies.find(p => p.Policy_id == insuranceunit.mainpolicyId);
    //These are the policies in same county ..
    //Check for EU by default
    if (inspolicies.filter(p => p.County_Id == insuranceunit.Countyid).find(p => p.Unit == "EU") != undefined) {
      //Means the set has EU Selected in same county so we need to prioritize the EU for the County
      if (insuranceunit.Unit == "EU") //if the same is EU the lets take this as reference
      {
        //let not working
        var effectedpolicies = inspolicies.filter(p => p.County_Id == insuranceunit.Countyid && p.Policy_id != insuranceunit.mainpolicyId);
        let invokerpolicy = inspolicies.find(p => p.Policy_id == insuranceunit.mainpolicyId);
        this.validateInsuranceTable(invokerpolicy, effectedpolicies, currenterrors);
      }
      else {

        let invokerpolicy = inspolicies.find(p => p.County_Id == insuranceunit.Countyid && p.Unit == "EU");
        let effectedpolicies: any[] = inspolicies.filter(p => p.County_Id == insuranceunit.Countyid && p.Policy_id != invokerpolicy.Policy_id);
        this.validateInsuranceTable(invokerpolicy, effectedpolicies, currenterrors);
      }
    }

    //No EU Found .. lets check the EP Then

    else if (inspolicies.filter(p => p.County_Id == insuranceunit.Countyid).find(p => p.Unit == "EP") != undefined) {
      let subpolicyverificationrequired = false;
      let EpErrors = [];
      //lets first attach croppractice to insuranceitems
      inspolicies.forEach(element => {
        element.Practice_Type = this.getcroppracticefrompraticeid(element.Crop_Practice_Id);
      });
      insuranceunit.Practice_Type = this.getcroppracticefrompraticeid(attachedPolicy.Crop_Practice_Id);
      //we know that if one practice has EP the all items with same practice should have EP 
      //so lets validate that first
      debugger
      let inspoliciesincountywithpratice = inspolicies.filter(p => p.County_Id == insuranceunit.Countyid && p.Practice_Type == insuranceunit.Practice_Type);
      let retrictreiprocaltoEP = false;
      //now we need to check the edited policy have EP/OU
      if (inspoliciesincountywithpratice.find(p => p.Unit == "EP") != undefined) {
        //this means that one of the item has EP.. so we need to Stress for EP
        //first let check if all of them have EP or only some
        subpolicyverificationrequired = inspoliciesincountywithpratice.find(p => p.Unit != "EP") == undefined;
        if (!subpolicyverificationrequired) {
          let invokerpolicy = inspoliciesincountywithpratice.find(p => p.Unit == "EP");
          let itemseffeceted = inspoliciesincountywithpratice.filter(p => p.Policy_id != invokerpolicy.Policy_id);
          EpErrors.push(...this.validateitemsforunit(invokerpolicy, itemseffeceted, []));
        }
        else {
          //All are EP .. so npw lets check the subpolicies

        }
        retrictreiprocaltoEP = false
      }
      else {
        //should only be OU/EP
        subpolicyverificationrequired = inspoliciesincountywithpratice.find(p => p.Unit != "OU") == undefined;
        if (!subpolicyverificationrequired) {
          let invokerpolicy = inspoliciesincountywithpratice.find(p => p.Unit == "OU");
          let itemseffeceted = inspoliciesincountywithpratice.filter(p => p.Policy_id != invokerpolicy.Policy_id);
          EpErrors.push(...this.validateitemsforunit(invokerpolicy, itemseffeceted, []));
        }
        else {
          //All are OU .. so npw lets check the subpolicies

        }
        retrictreiprocaltoEP = true;
      }


      //Now lets check if reciprocal practice has EU/OU
      //from the variable retrictreiprocaltoEP we will know what value to restrict for
      let reciprocalpractice = "";
      if (insuranceunit.Practice_Type == "IRR") {
        reciprocalpractice = "NIR";
      }
      else {
        reciprocalpractice = "IRR";
      }
      //get items from other practice
      let itemswithreciprocalpratice = inspolicies.filter(p => p.County_Id == insuranceunit.Countyid && p.Practice_Type == reciprocalpractice);
      if (retrictreiprocaltoEP) {
        //restrict items to EU as other has dont has EP
        let invokerpolicy = itemswithreciprocalpratice[0];
        let itemseffeceted = itemswithreciprocalpratice.filter(p => p.Policy_id != invokerpolicy.Policy_id);
        EpErrors.push(...this.validateitemsforunit(invokerpolicy, itemseffeceted, ["EP"]));
      }
      else {
        //restrict items to EU/OU as other has EP
        let invokerpolicy = itemswithreciprocalpratice[0]
        let itemseffeceted = itemswithreciprocalpratice.filter(p => p.Policy_id != invokerpolicy.Policy_id);
        EpErrors.push(...this.validateitemsforunit(invokerpolicy, itemseffeceted, ["OU", "EP"]));
      }
      subpolicyverificationrequired = itemswithreciprocalpratice.map(p => p.Unit).every((val, i, arr) => val === arr[0]);
      // if(subpolicyverificationrequired){
      //   // 
      //   let uniquesets=_.uniqBy(inspolicies,["County_Id","",""])
      // }
      //here push the errors
      currenterrors.push(...EpErrors);
      this.localstorage.store(environment.errorbase, _.uniq(currenterrors));
    }
    //  this.retrieveerrors();
    //  seterrors(this.errorlist);
  }

  validateitemsforunit(itemchanged: Insurance_Policy, itemseffected: Array<Insurance_Policy>, restrictpolicies: Array<string>): Array<errormodel> {
    let errorsadded = new Array<errormodel>();
    if (restrictpolicies.length > 0) {
      if (!restrictpolicies.includes(itemchanged.Unit)) {
        //add error to main policy and also add error to itemseffected
        errorsadded.push({ cellid: "Ins_" + itemchanged.Policy_id + "_Unit", errorsection: "Insurance", details: ["dirty"] });
      }
      itemseffected.forEach(element => {
        //add error
        if (!restrictpolicies.includes(element.Unit)) {
          errorsadded.push({ cellid: "Ins_" + element.Policy_id + "_Unit", errorsection: "Insurance", details: ["dirty"] });
        }
      });
    }
    else {
      itemseffected.forEach(element => {
        if (element.Unit !== itemchanged.Unit) {
          //add error
          errorsadded.push({ cellid: "Ins_" + element.Policy_id + "_Unit", errorsection: "Insurance", details: ["dirty"] });
        }
      });
    }
    return errorsadded;
  }

  getcroppracticefrompraticeid(id: number) {
    return this.refdata.CropList.find(p => p.Crop_And_Practice_ID == id).Practice_type_code;
  }


  //Page load validations
  validateinsurancePoliciesatload(rowdata: Array<any>, insurancepolicies: Array<Insurance_Policy>) {
    //Lets first get the counties 
    debugger
    let counties = _.uniq(rowdata.map(p => p.Countyid));
    counties.forEach(element => {
      //just pick the first row
      var params ={data: rowdata.find(p => p.Countyid == element)};
      this.validateInsurancePolicies(params, insurancepolicies.filter(p => p.County_Id == element));
    });
  }
}


function arraysEqual(_arr1, _arr2) {

  if (!Array.isArray(_arr1) || !Array.isArray(_arr2) || _arr1.length !== _arr2.length)
    return false;

  var arr1 = _arr1.concat().sort();
  var arr2 = _arr2.concat().sort();

  for (var i = 0; i < arr1.length; i++) {

    if (arr1[i] !== arr2[i])
      return false;

  }

  return true;

}


