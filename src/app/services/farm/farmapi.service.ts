import { Injectable } from '@angular/core';
import { ApiService } from '..';
import { ResponseModel } from '../../models/resmodels/reponse.model';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FarmapiService {

  constructor(private apiservice: ApiService) { }

  saveupdateFarm(Object:any) : Observable<ResponseModel>{
    const route='/api/Farm/EditLoanCropFarm';
    return this.apiservice.post(route,Object).map(res=>res);
   }


}
