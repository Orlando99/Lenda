import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ResponseModel } from '../../models/resmodels/reponse.model';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../services/api.service';
import { loan_model } from '../../models/loanmodel';
const API_URL = environment.apiUrl;
@Injectable()
export class LoanApiService {

  constructor(private apiservice: ApiService) { }

  getLoanList(): Observable<ResponseModel> {
    const route = "/api/Loans/GetAllLoans";
    return this.apiservice.get(route).map(res => res);
  }

  getLoanById(loanid: number): Observable<ResponseModel> {
    const route = '/api/Loans/GetLoanbyId?loanid=' + loanid;
    return this.apiservice.get(route).map(res => res);
  }

  syncloanobject(loanobj: loan_model): Observable<ResponseModel> {
    const route = '/api/Loan/SyncLoanObject';
    return this.apiservice.post(route, loanobj).map(res => res);
  }


}
