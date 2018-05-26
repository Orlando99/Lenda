import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ResponseModel } from '../../models/resmodels/reponse.model';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../services/api.service';
const API_URL = environment.apiUrl;
@Injectable()
export class LoanApiService {

  constructor(private apiservice: ApiService) { }

  getLoanList(pagesize:number,previndex:number) : Observable<ResponseModel>{
    const route='/api/Loan/GetLoanList?pagesize='+pagesize+'&previndex='+previndex;
    return this.apiservice.get(route).map(res=>res);
   }

   getLoanById(loanid:number) : Observable<ResponseModel>{
    const route='/api/Loan/GetLoanbyId?loanid='+loanid;
   return this.apiservice.get(route).map(res=>res);
   }

}
