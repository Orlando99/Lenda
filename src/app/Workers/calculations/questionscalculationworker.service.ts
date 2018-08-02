import { Injectable } from '@angular/core';
import { LoggingService } from '../../services/Logs/logging.service';
import { loan_model } from '../../models/loanmodel';
import { LoanQResponse, RefQuestions } from '../../models/loan-response.model';
import { LocalStorageService } from 'ngx-webstorage';
import { environment } from '../../../environments/environment.prod';

@Injectable()
export class QuestionscalculationworkerService {

  constructor(public logging:LoggingService, private localstorageservice : LocalStorageService){

  }

  performcalculationforquestionsupdated(input:loan_model):loan_model{
    let starttime = new Date().getTime();
    let obj:any[]=input.LoanQResponse;
    obj.forEach(element => {
     // we are going to update according to question id .. thats the only way as if now.. suggestions welcomed
      switch (element.Question_ID) {
        case 2: // judgement question

        input.LoanMaster[0].Judgement=(parseInt(element.Response_Ind)==1)?0:1;
          break;
        case 3: // bankruptcy question
        input.LoanMaster[0].Bankruptcy_Status=(parseInt(element.Response_Ind)==1)?0:1;
          break;
        case 4: // bankruptcy question
        input.LoanMaster[0].Bankruptcy_Status=(parseInt(element.Response_Ind)==1)?0:1;
          break;
        case 21: // 3 year tax return question
        input.Borrower.Borrower_3yr_Tax_Returns=parseInt(element.Response_Ind)
          break;
        default:
          break;
      }
   });
   let endtime = new Date().getTime();
    this.logging.checkandcreatelog(3, 'Calc_Question_1', "LoanCalculation timetaken :" + (endtime - starttime).toString() + " ms");
   return input;
  }


  prepareResponses(chevronID : string, queResponse : Array<LoanQResponse>,loanMaster){
    let refdata = this.localstorageservice.retrieve(environment.referencedatakey);
    if(!queResponse){
      queResponse = [];
    }
    if(refdata.RefQuestions && refdata.RefQuestions.length >0){

      let cheveronQuestions  : Array<RefQuestions>= refdata.RefQuestions.filter(que=>que.Chevron_ID == chevronID);

      if(cheveronQuestions && cheveronQuestions.length>0){
        
        cheveronQuestions.forEach(que =>{
          let respecctiveResponse = queResponse.find(res=>res.Question_ID == que.Question_ID);
          if(!respecctiveResponse){
            respecctiveResponse = new LoanQResponse();
            respecctiveResponse.Question_ID = que.Question_ID;
            respecctiveResponse.Chevron_ID = que.Chevron_ID;
            respecctiveResponse.Question_Category_Code = que.Questions_Cat_Code;
            respecctiveResponse.Loan_ID = loanMaster.Loan_ID;
            respecctiveResponse.Loan_Full_ID = loanMaster.Loan_Full_ID;
            respecctiveResponse.Loan_Seq_Num = loanMaster.Loan_Seq_num;
            respecctiveResponse.FC_Question_ID_Text = que.Question_ID_Text;
            respecctiveResponse.FC_Choice1 = que.Choice1;
            respecctiveResponse.FC_Choice2 = que.Choice2;
            respecctiveResponse.FC_Subsidiary_Question_ID_Ind = que.Subsidiary_Question_ID;
            respecctiveResponse.FC_Parent_Question_ID = que.Parent_Question_ID;
            queResponse.push(respecctiveResponse);
          }else{
            respecctiveResponse.FC_Question_ID_Text = que.Question_ID_Text;
            respecctiveResponse.FC_Choice1 = que.Choice1;
            respecctiveResponse.FC_Choice2 = que.Choice2;
            respecctiveResponse.FC_Subsidiary_Question_ID_Ind = que.Subsidiary_Question_ID;
            respecctiveResponse.FC_Parent_Question_ID = que.Parent_Question_ID;
          }
          
        })
      }
      
    }
    return queResponse;
  }
}
