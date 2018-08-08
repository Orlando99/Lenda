import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ResponseModel } from '../../models/resmodels/reponse.model';
import { ApiService } from '../api.service';
import { Logpriority, Logs } from '../../models/loanmodel';
import { LocalStorageService } from 'ngx-webstorage';
import { environment } from '../../../environments/environment.prod';

@Injectable()
export class LoggingService {

  constructor(private apiservice: ApiService, public localst: LocalStorageService) { }

  createlog(Object: any): Observable<ResponseModel> {
    const route = '/api/Logs/AddLog';
    return this.apiservice.post(route, Object).map(res => res);
  }
  checkandcreatelog(level: Logpriority, section: string, message: string) {
    let res=this.localst.retrieve(environment.logpriority);
    let userid = this.localst.retrieve(environment.uid);
    let localLoanObject = this.localst.retrieve(environment.loankey);
      
      // if (level <= res) {
        
        let obj = new Logs();
        obj.Log_Id = 0;
        obj.Loan_Full_ID = localLoanObject ? localLoanObject.Loan_Full_ID : '';
        obj.Log_Message = message;
        obj.Log_Section = section;
        obj.userID = userid;
        this.createlog(obj).subscribe(res=>{
          
        })
      
      //ignore else
   

  }

}
