import { Component, OnInit } from '@angular/core';
import {environment} from '../../../../environments/environment';
import {LocalStorageService} from 'ngx-webstorage';
import {LoanQResponse, RefQuestions} from '../../../models/loan-response.model';
import {LoancalculationWorker} from '../../../Workers/calculations/loancalculationworker';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit {
  refdata;
  localloanobject;
  RefQuestions: RefQuestions[];
  LoanQResponse: LoanQResponse[];

  constructor(public localstorageservice: LocalStorageService,
              public loanserviceworker: LoancalculationWorker) { }

  ngOnInit() {
    this.refdata = this.localstorageservice.retrieve(environment.referencedatakey);
    this.localloanobject = this.localstorageservice.retrieve(environment.loankey);
debugger
    this.RefQuestions = this.refdata.RefQuestions;
    this.LoanQResponse = this.localloanobject.LoanQResponse;

    console.log(this.RefQuestions, this.LoanQResponse)
  }

  change() {
    this.loanserviceworker.performcalculationonloanobject(this.localloanobject);
  }

}
