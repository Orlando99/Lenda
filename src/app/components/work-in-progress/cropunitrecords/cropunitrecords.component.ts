import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { environment } from '../../../../environments/environment.prod';

@Component({
  selector: 'app-cropunitrecords',
  templateUrl: './cropunitrecords.component.html',
  styleUrls: ['./cropunitrecords.component.scss']
})
export class CropunitrecordsComponent implements OnInit {
  public records: any;
  public refdata: any;
  constructor(
    private localstorageservice: LocalStorageService
  ) { }

  ngOnInit() {
    this.records = this.localstorageservice.retrieve(environment.loankey);
    this.refdata = this.localstorageservice.retrieve(environment.referencedatakey);
  }

  changeColor(params) {
    if (params.ActionStatus === 3) {
      return { 'background-color': 'red' };
    } else if (params.ActionStatus === 2) {
      return { 'background-color': 'yellow' };
    } else if (params.ActionStatus === 1) {
      return { 'background-color': 'green' };
    }
  }
  returndecimalcapedvalue(value: any) {
    if (value == null || value == undefined) {
      value = 0
    }
    return value.toFixed(2);
  }

  getCountynamefromid(id: any) {
    return this.refdata.CountyList.find(p => p.County_ID == id).County_Name;
  }
  getprodpercfromfarmid(farmid: number) {
    return this.records.Farms.find(p => p.Farm_ID == farmid).Percent_Prod;
  }
  getinsurancerecordparameter(County_Id: number, Crop_Practice_Id: number,param:string): any {
    
    let rec = this.records.InsurancePolicies.find(p => p.County_Id == County_Id && p.Crop_Practice_Id == Crop_Practice_Id);
    if (rec == undefined) {
      return "N/A"
    }
    return rec[param];
  }
  getsubpolicyparams(County_Id: number, Crop_Practice_Id: number, Type: String,param:string) {
    try {
      let rec = this.records.InsurancePolicies.find(p => p.County_Id == County_Id && p.Crop_Practice_Id == Crop_Practice_Id);
      return rec.Subpolicies.find(p => p.Ins_Type == Type && p.ActionStatus != 3)[param];
    }
    catch{
      return "N/A"
    }

  }
}
