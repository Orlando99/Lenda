import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { loan_model } from '../../../models/loanmodel';
import { environment } from '../../../../environments/environment.prod';
import { LoanMasterCalculationWorkerService } from '../../../Workers/calculations/loan-master-calculation-worker.service';
import { ValueType } from '../shared/cell-value/cell-value.component';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit {

  data: any;
  localloanobj: loan_model;
  constructor(private localstorageservice: LocalStorageService,
    private loanMasterCaculationWorker: LoanMasterCalculationWorkerService) { }

  ngOnInit() {
    this.localstorageservice.observe(environment.loankey).subscribe(res=>{
    this.localloanobj = res;
    this.binddata();
    })

    this.localloanobj = this.localstorageservice.retrieve(environment.loankey);
    this.binddata();

  }


  private binddata() {
    if (this.localloanobj && this.localloanobj.LoanMaster && this.localloanobj.LoanMaster[0] && this.localloanobj.Borrower) {
      let loanMaster = { ...this.localloanobj.LoanMaster[0] };
      let borrower = { ...this.localloanobj.Borrower };
      loanMaster.Borrower_Farm_Financial_Rating = '145.8%';
      borrower.Borrower_Rating = 4;
      borrower.Borrower_Credit_Score = 700;
      this.data = {
        partOne: [
          {
            text: 'Borrower Ratting',
            value: "*".repeat(loanMaster.Borrower_Rating || 0),
            staticValues: ['*****', '****', '***', '**', '*']
          },
          {
            text: 'FICO Score',
            value: loanMaster.Credit_Score || '',
            staticValues: [720, 700, 700, 650, 0]
          },
          {
            text: 'CPA Financials',
            value: borrower.Borrower_CPA_financials ? 'Yes' : 'No',
            staticValues: ['Yes', 'Yes', '', '', '']
          },
          {
            text: '3yrs Tax Returns',
            value: borrower.Borrower_3yr_Tax_Returns==1 ? 'Yes' : 'No',
            staticValues: ['Yes', 'Yes', '', '', '']
          },
          {
            text: 'Bankruptcy',
            value: loanMaster.Bankruptcy_Status==1 ? 'Yes' : 'No',
            staticValues: ['No', 'No', 'No', '', '']
          },
          {
            text: 'Judgement',
            value: loanMaster.Judgement==1 ? 'Yes' : 'No',
            staticValues: ['No', 'No', 'No', '', '']
          },
          {
            text: 'Years Farming',
            value: loanMaster.Year_Begin_Farming ? (new Date()).getFullYear() - loanMaster.Year_Begin_Farming : 'NA',
            staticValues: [7, 5, 3, 0, 0]
          },
          {
            text: 'Farm Finacial Rating',
            value: loanMaster.Borrower_Farm_Financial_Rating || '',
            staticValues: ['100%', '100%', '0%', '', ' ']
          }
        ],
        partTwo: [
          {
            text: 'Income Constant %',
            value: '',
            staticValues: this.loanMasterCaculationWorker.incomeConstant,
            valueType : ValueType.PERCENTAGE,
          },
          {
            text: 'Revanue Threshold',
            value: this.loanMasterCaculationWorker.getRevanueThresholdValue(),
            staticValues: this.loanMasterCaculationWorker.getRevanueThresholdStaticValues(),
            valueType : ValueType.AMOUNT,
          },
          {
            text: 'Insurance Constant %',
            value: '',
            staticValues:  this.loanMasterCaculationWorker.insuranceConstant,
            valueType : ValueType.PERCENTAGE,

          },
          {
            text: 'Max Crop Loan',
            value: this.loanMasterCaculationWorker.getMaxCropLoanValue(),
            staticValues: this.loanMasterCaculationWorker.getMaxCropLoanStaticValues(),
            valueType : ValueType.AMOUNT,
            hightlightRow: true
          },
        ],
        partThree: [
          {
            text: 'Max Amount Constant',
            value: '',
            staticValues: [1000000, 500000, '-', '-', '-'],
            valueType : ValueType.AMOUNT,
          },
          {
            text: 'Disc Net Worth Constant %',
            value: '',
            staticValues:  this.loanMasterCaculationWorker.discNetWorthConstant,
            valueType : ValueType.PERCENTAGE,
          },
          {
            text: 'Disc Net Worth',
            value: this.loanMasterCaculationWorker.getDiscNetWorthValue(),
            staticValues: this.loanMasterCaculationWorker.getDiscWorthStaticValue(),
            valueType : ValueType.AMOUNT,
          },
          {
            text: 'Ag-Pro Max Addition',
            value: '',
            staticValues: this.loanMasterCaculationWorker.getAgProMaxAdditionStaticValue(),
            valueType : ValueType.AMOUNT,
            hightlightRow: true
          }
        ]
      };
    }
  }
}
