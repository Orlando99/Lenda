import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { Observable } from 'rxjs/Observable';
import { ResponseModel } from '../../models/resmodels/reponse.model';

@Injectable()
export class ReferenceService {

  constructor(private apiservice: ApiService) { }


  getreferencedata() : Observable<ResponseModel>{
    const route='/api/Reference/GetAllReferenceData';
    return this.apiservice.get(route).map(res=>res);
   }
}
