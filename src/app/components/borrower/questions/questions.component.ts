import { Component, OnInit, Input } from '@angular/core';
import { environment } from '../../../../environments/environment.prod';
import { LocalStorageService } from 'ngx-webstorage';
import { LoanQResponse, RefQuestions } from '../../../models/loan-response.model';
import { LoancalculationWorker } from '../../../Workers/calculations/loancalculationworker';
import { loan_model } from '../../../models/loanmodel';
import { QuestionscalculationworkerService } from '../../../Workers/calculations/questionscalculationworker.service';
import { LoanApiService } from '../../../services/loan/loanapi.service';
import { JsonConvert } from 'json2typescript';
import { ToastsManager } from 'ng2-toastr';
import * as _ from "lodash";
import { PublishService, Page } from "../../../services/publish.service";

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit {
  @Input() currentPageName: Page;
  refdata;
  localloanobject: loan_model;
  RefQuestions: RefQuestions[];
  LoanQResponse: LoanQResponse[];

  responses: Array<LoanQResponse>;
  @Input("chevronId")
  chevronId: string;

  @Input("chevronHeader")
  chevronHeader: string;

  @Input("displayAsChildChevron")
  displayAsChildChevron: boolean = false;

  @Input("expanded")
  expanded: boolean = true;

  isResponseUpdated: boolean = false;
  isPublishing: boolean = false;

  constructor(public localstorageservice: LocalStorageService,
    public loanserviceworker: LoancalculationWorker,
    private loanapi: LoanApiService,
    private questionService: QuestionscalculationworkerService,
    private toaster: ToastsManager,
    public publishService: PublishService) { }

  ngOnInit() {
    this.localstorageservice.observe(environment.loankey).subscribe(res => {
      this.localloanobject = res;
      if (this.localloanobject && this.localloanobject.LoanQResponse && this.localloanobject.LoanMaster[0]) {
        let existingResponses = this.localloanobject.LoanQResponse.filter(res => res.Chevron_ID == this.chevronId);
        this.responses = this.questionService.prepareResponses(this.chevronId, existingResponses, this.localloanobject.LoanMaster[0]);
        this.responses = _.sortBy(this.responses, 'FC_Sort_Order');
        this.updatePublishStatus();
      }
    })

    this.localloanobject = this.localstorageservice.retrieve(environment.loankey);
    if (this.localloanobject && this.localloanobject.LoanQResponse && this.localloanobject.LoanMaster[0]) {
      let existingResponses = this.localloanobject.LoanQResponse.filter(res => res.Chevron_ID == this.chevronId);
      this.responses = this.questionService.prepareResponses(this.chevronId, existingResponses, this.localloanobject.LoanMaster[0]);
      this.responses = _.sortBy(this.responses, 'FC_Sort_Order');
      this.updatePublishStatus();
    }
  }

  private updatePublishStatus() {
    if (this.localloanobject.LoanQResponse.find(res => res.Chevron_ID == this.chevronId && (res.ActionStatus == 1 || res.ActionStatus == 2))) {
      this.isResponseUpdated = true;
      this.publishService.enableSync(this.currentPageName);
    } else {
      this.isResponseUpdated = false;
    }
  }

  getVisibility(Parent_Question_ID) {
    let matchedParent = this.responses.find(res => res.Question_ID == Parent_Question_ID);
    if (matchedParent) {
      return matchedParent.FC_Choice1 == matchedParent.Response_Detail;
    } else {
      return false;
    }
  }

  change(response: LoanQResponse) {
    if (response) {
      let matchedResponse = this.localloanobject.LoanQResponse.find(res => res.Question_ID == response.Question_ID);
      if (matchedResponse) {
        matchedResponse.Response_Detail = response.Response_Detail;
        if (matchedResponse.Loan_Q_response_ID) {
          matchedResponse.ActionStatus = 2;
        } else {
          matchedResponse.ActionStatus = 1;
        }
      } else {
        response.ActionStatus = 1;
        this.localloanobject.LoanQResponse.push(response);
      }
    }
    this.isResponseUpdated = true;
    this.loanserviceworker.performcalculationonloanobject(this.localloanobject);
    this.publishService.enableSync(this.currentPageName);
  }

  // synctoDb() {
  //   this.isPublishing = true;
  //   this.loanapi.syncloanobject(this.localloanobject).subscribe(res => {
  //     if (res.ResCode == 1) {
  //       this.loanapi.getLoanById(this.localloanobject.Loan_Full_ID).subscribe(res => {
  //         if (res.ResCode == 1) {
  //           this.toaster.success("Records Synced");
  //           let jsonConvert: JsonConvert = new JsonConvert();
  //           this.loanserviceworker.performcalculationonloanobject(jsonConvert.deserialize(res.Data, loan_model));
  //           this.isPublishing = false;
  //           this.updatePublishStatus();
  //         }
  //         else {
  //           this.toaster.error("Could not fetch Loan Object from API")
  //           this.isPublishing = false;
  //         }
  //       });
  //     }
  //     else {
  //       this.toaster.error("Error in Sync");
  //       this.isPublishing = false;
  //     }
  //   });
  // }
}
