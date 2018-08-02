import { Component, OnInit, Input } from '@angular/core';
import { environment } from '../../../../environments/environment.prod';
import { LocalStorageService } from 'ngx-webstorage';
import { LoanQResponse, RefQuestions } from '../../../models/loan-response.model';
import { LoancalculationWorker } from '../../../Workers/calculations/loancalculationworker';
import { loan_model } from '../../../models/loanmodel';
import { QuestionscalculationworkerService } from '../../../Workers/calculations/questionscalculationworker.service';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit {
  refdata;
  localloanobject : loan_model;
  RefQuestions: RefQuestions[];
  LoanQResponse: LoanQResponse[];
  
  responses : Array<LoanQResponse>;
  @Input("CheveronId")
  CheveronId:string;

  constructor(public localstorageservice: LocalStorageService,
    public loanserviceworker: LoancalculationWorker,
    private questionService : QuestionscalculationworkerService) { }

  ngOnInit() {
    this.localstorageservice.observe(environment.loankey).subscribe(res=>{
      this.localloanobject = res;
      if(this.localloanobject && this.localloanobject.LoanQResponse && this.localloanobject.LoanMaster[0]){
        this.responses = this.questionService.prepareResponses(this.CheveronId,this.localloanobject.LoanQResponse,this.localloanobject.LoanMaster[0]);
      }
      
    })

    this.localloanobject = this.localstorageservice.retrieve(environment.loankey);
    if(this.localloanobject && this.localloanobject.LoanQResponse && this.localloanobject.LoanMaster[0]){
      this.responses = this.questionService.prepareResponses(this.CheveronId,this.localloanobject.LoanQResponse,this.localloanobject.LoanMaster[0]);
    }
    
  }

  getVisibility(Parent_Question_ID){
    let matchedParent = this.responses.find(res=>res.Question_ID ==Parent_Question_ID);
    if(matchedParent){
      return matchedParent.FC_Choice1 == matchedParent.Response_Detail;
    }else{
      return false;
    }

  }

  // prepareQuestions(chevronID : number, queResponse : Array<LoanQResponse>){
  //   let refdata = this.localstorageservice.retrieve(environment.referencedatakey);
  //   if(refdata.RefQuestions && refdata.RefQuestions.length >0){

  //     let cheveronQuestions  : Array<RefQuestions>= refdata.RefQuestions.filter(que=>que.Chevron_ID == chevronID);
  //     return cheveronQuestions;
  //   }else{
  //     return [];
  //   }

  // }

  change() {
    this.loanserviceworker.performcalculationonloanobject(this.localloanobject);
  }

}
