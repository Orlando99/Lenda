import { Injectable } from '@angular/core';
import { Loan_Crop_Practice } from '../../models/loanmodel';
import { LocalStorageService } from 'ngx-webstorage';
import { environment } from '../../../environments/environment.prod';

@Injectable()
export class BudgetHelperService {

  refData: any;
  constructor(private localStorageService : LocalStorageService) {
    this.refData= localStorageService.retrieve(environment.referencedatakey);
   }

  prepareCropPractice(lstCropPractice : Array<Loan_Crop_Practice>){
    let cropList : Array<any>= this.refData.CropList;

    lstCropPractice.map(cp=> {
      let crop = cropList.find(cl=>cl.Crop_And_Practice_ID === cp.Crop_Practice_ID);
      cp.FC_CropName = crop.Crop_Name;
      cp.FC_PracticeType = crop.Practice_type_code;
      return cp;
    })
    return lstCropPractice;
  }
}
