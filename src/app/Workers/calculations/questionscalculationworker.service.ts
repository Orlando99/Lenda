import { Injectable } from '@angular/core';
import { LoggingService } from '../../services/Logs/logging.service';
import { loan_model } from '../../models/loanmodel';
import { LoanQResponse, RefQuestions } from '../../models/loan-response.model';

@Injectable()
export class QuestionscalculationworkerService {

  constructor(public logging:LoggingService){

  }

  performcalculationforquestionsupdated(input:loan_model):loan_model{
    let obj:any[]=input.LoanQResponse;
    obj.forEach(element => {
     // we are going to update according to question id .. thats the only way as if now.. suggestions welcomed
      switch (element.Question_ID) {
        case 2: // judgement question

        input.LoanMaster[0].Judgement=(parseInt(element.Response_Ind)==1)?0:1;
          break;
        case 3: // bankruptcy question
        input.LoanMaster[0].Bankruptcy_Status=(parseInt(element.Response_Ind)==1)?0:1
          break;
        case 21: // 3 year tax return question
        //input.LoanMaster.Bankruptcy_Status=parseInt(element.Response_Ind)
            break;
        default:
          break;
      }
   });
   return input;
  }


}
