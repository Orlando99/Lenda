import { Injectable } from '@angular/core';
import { ApiService } from '..';
import { Observable } from 'rxjs/Observable';
import { ResponseModel } from '../../models/resmodels/reponse.model';

@Injectable()
export class BorrowerapiService {

  constructor(private apiservice: ApiService) { }

  saveupdateborrower(Object:any) : Observable<ResponseModel>{
    const route='api/Borrower/EditBorrower';
    return this.apiservice.post(route,Object).map(res=>res);
   }

}
