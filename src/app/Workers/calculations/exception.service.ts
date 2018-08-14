import { Injectable } from '@angular/core';
import { LoanQResponse, Operation, RefQuestions } from '../../models/loan-response.model';
import { LocalStorageService } from 'ngx-webstorage';
import { environment } from '../../../environments/environment.prod';
import { ExceptionModel } from '../../models/commonmodels';
import { loan_model } from '../../models/loanmodel';

@Injectable()
export class ExceptionService {

  localExceptionLogs : Array<ExceptionModel>;
  refData : any;

  constructor(private localStorageService : LocalStorageService) { 
    this.localExceptionLogs = this.localStorageService.retrieve(environment.exceptionStorageKey);
    this.refData = this.localStorageService.retrieve(environment.referencedatakey);
  }
  logExceptionIfApplicable(response : LoanQResponse){

    if(response.FC_Exception_Msg){
      let exceptionLevel = this.getExceptionLevel(response);  
      let existingExceptionIndex = this.localExceptionLogs.findIndex(e=>e.questionId == response.Question_ID);

      if(exceptionLevel){
        let exception = new ExceptionModel();
        exception.level = exceptionLevel;
        exception.message = response.FC_Exception_Msg.replace('#',response.Response_Detail);
        exception.section = response.Chevron_ID;
        exception.questionId = response.Question_ID;

        
        if(existingExceptionIndex >-1){
          this.localExceptionLogs[existingExceptionIndex] = exception;
        }else{
          this.localExceptionLogs.push(exception);
        }
        
      }else{
        this.localExceptionLogs.splice(existingExceptionIndex,1);
      }
      this.localStorageService.store(environment.exceptionStorageKey, this.localExceptionLogs);

    }
    
  }
  getExceptionLevel(response : LoanQResponse){
    switch (response.FC_Operation) {
      case Operation.Greater:
        if( this.isNotNullAndUndefined(response.FC_Level2_Val) && (response.Response_Detail > response.FC_Level2_Val))
        {
          return 2;
        }else if(this.isNotNullAndUndefined(response.FC_Level1_Val) && (response.Response_Detail > response.FC_Level1_Val)){
          return 1;
        }else{
          return 0;
        }
       // break;
        
      case Operation.GreterEqual:
        if(this.isNotNullAndUndefined(response.FC_Level2_Val) && (response.Response_Detail >= response.FC_Level2_Val))
        {
          return 2;
        }else if(this.isNotNullAndUndefined(response.FC_Level1_Val) && (response.Response_Detail >= response.FC_Level1_Val)){
          return 1;
        }else{
          return 0;
        }
       // break;
        
      case Operation.Equal:
        if(this.isNotNullAndUndefined(response.FC_Level2_Val) && (response.Response_Detail == response.FC_Level2_Val))
        {
          return 2;
        }else if(this.isNotNullAndUndefined(response.FC_Level1_Val) && (response.Response_Detail == response.FC_Level1_Val)){
          return 1;
        }else{
          return 0;
        }
       // break;
        

    
      default:
        break;
    }
  }

  isNotNullAndUndefined(value){
    return (value !=null && value !=undefined)
  }

  logExceptionForAllResponses(){
    let localLoanObject  : loan_model= this.localStorageService.retrieve(environment.loankey);
    this.localStorageService.store(environment.exceptionStorageKey, []);
    if(localLoanObject.LoanQResponse){

      localLoanObject.LoanQResponse.forEach(response => {
        let question : RefQuestions = this.refData.RefQuestions.find(q=>q.Question_ID == response.Question_ID);
        response.FC_Exception_Msg = question.Exception_Msg;
        response.FC_Operation = question.Operation;
        response.FC_Level1_Val = question.Level1_Val;
        response.FC_Level2_Val = question.Level2_Val;
        this.logExceptionIfApplicable(response);
        
      });
    }
    
  }
}
