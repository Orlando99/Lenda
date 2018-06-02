import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ResponseModel } from '../../models/resmodels/reponse.model';
import { ApiService } from '..';

@Injectable()
export class CropapiService {

  constructor(private apiservice: ApiService) { }

  getcropprices() : Observable<ResponseModel>{
    const route='/api/Crop/GetAllCropPriceDetails';
    return this.apiservice.get(route).map(res=>res);
   }

   saveupdateLoanCropUnit(Object:any) : Observable<ResponseModel>{
    const route='/api/CropUnit/EditCropUnit';
    return this.apiservice.post(route,Object).map(res=>res);
   }

}
