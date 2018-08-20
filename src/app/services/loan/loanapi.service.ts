import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ResponseModel } from '../../models/resmodels/reponse.model';
import { environment } from '../../../environments/environment.prod';
import { ApiService } from '../api.service';
import { loan_model, loan_farmer, borrower_model } from '../../models/loanmodel';
const API_URL = environment.apiUrl;
@Injectable()
export class LoanApiService {
  headerFilter: string;
  constructor(private apiservice: ApiService) { }

  getLoanList(): Observable<ResponseModel> {
    const route = "/api/Loans/GetAllLoans";
    return this.apiservice.get(route).map(res => res);
  }

  getLoanById(loanid: string): Observable<ResponseModel> {
    const route = '/api/Loans/GetLoanbyId?loanfullid=' + loanid;
    return this.apiservice.get(route).map(res => res);
  }

  syncloanobject(loanobj: loan_model): Observable<ResponseModel> {
    const route = '/api/Loan/SyncLoanObject';
    return this.apiservice.post(route, loanobj).map(res => res);
  }

  // syncloanborrower(loanId : number,  loanborrowerobj: borrower_model): Observable<ResponseModel> {
  //   const route = '/api/Loan/EditLoanBorrower?loanId='+loanId;
  //   return this.apiservice.put(route, loanborrowerobj).map(res => res);
  // }
  // syncloanfarmer(loanId : number,  loanfarmerObject: loan_farmer): Observable<ResponseModel> {
  //   const route = '/api/Loan/EditLoanFarmer?loanId='+loanId;
  //   return this.apiservice.put(route, loanfarmerObject).map(res => res);
  // }

  createLoan(loanObj){
    const route = '/api/Loan/CreateLoan';
    return this.apiservice.post(route, loanObj).map(res => res);
  }

  getFilter(): string {
    return this.headerFilter;
  }

  setFilter(filter): void {
    this.headerFilter = filter;
  }

}
