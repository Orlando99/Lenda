import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { loan_model } from '../../../models/loanmodel';
import { environment } from '../../../../environments/environment.prod';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit {

  data: any;
  localloanobj : loan_model;
  constructor( private localstorageservice : LocalStorageService ) { }

  ngOnInit() {

    this.localloanobj = this.localstorageservice.retrieve(environment.loankey);
    if (this.localloanobj && this.localloanobj.LoanMaster && this.localloanobj.LoanMaster[0] && this.localloanobj.Borrower) {

      let loanMaster = {...this.localloanobj.LoanMaster[0]};
      let borrower= {...this.localloanobj.Borrower};
      
      loanMaster.Borrower_Farm_Financial_Rating = '145.8%';

      borrower.Borrower_Rating = 4;
      borrower.Borrower_Credit_Score = 700;
      
      this.data = {
        partOne: [
          {
            text: 'Borrower Ratting',
            value: "*".repeat(borrower.Borrower_Rating || 0),
            staticValues: ['*****','****','***','**','*']
  
          },
          {
            text: 'FICO Score',
            value: borrower.Borrower_Credit_Score || '' ,
            staticValues : [ 720, 700, 700, 650, 0]
          },
          {
            text: 'CPA Financials',
            value: borrower.Borrower_CPA_financials? 'Yes':'No' ,
            staticValues : ['Yes', 'Yes', '', '', '']
          
          },
          {
            text: '3yrs Tax Returns',
            value: borrower.Borrower_3yr_Tax_Returns? 'Yes' : 'No',
            staticValues :[ 'Yes', 'Yes', '', '', '']
          },
          {
            text: 'Bankruptcy',
            value: borrower.Borrower_Banruptcy_status ? 'Yes' : 'No',
            staticValues:[ 'No', 'No', 'No', '', '']
          },
          {
            text: 'Judgement',
            value: borrower.Borrower_Judgement_Ind? 'Yes' : 'No',
            staticValues:[ 'No', 'No', 'No', '', '']
          },
          {
            text: 'Years Farming',
            value: loanMaster.Year_Begin_Farming ? (new Date()).getFullYear() - loanMaster.Year_Begin_Farming : 'NA',
            staticValues:[ 7, 5, 3, 0, 0]
          },
          {
            text: 'Farm Finacial Rating',
            value: loanMaster.Borrower_Farm_Financial_Rating || '',
            staticValues : [ '100%', '100%', '0%', '', ' ']
          }
        ],
        partTwo : [
          {
            text: 'Income Constant %',
            value: ['', '90%','90%','90%','90%','90%',]
          },
          {
            text: 'Revanue Threshold',
            value: ['902,457','902,457','902,457','812,211','812,211','812,211'],
            isAmount :  true
          },
          {
            text: 'Insurance Constant %',
            value: ['', '110%','105%','100%','100%','100%']
          },
          {
            text: 'Max Crop Loan',
            value: ['902,457','902,457','902,457','812,211','812,211','812,211'],
            isAmount :  true,
            hightlightRow : true
          },
  
        ],
        partThree : [
          {
            text: 'Max Amount Constant',
            value: ['','1,000,000','500,000','-','-','-'],
            isAmount :  true
          },
          {
            text: 'Disc Net Worth Constant %',
            value: ['','100%','100%','100%','100%','100%',]
          },
          {
            text: 'Disc Net Worth',
            value: ['1,140,000','1,140,000','1,140,000','1,140,000','1,140,000','1,140,000'],
            isAmount : true
          },
          {
            text : 'Ag-Pro Max Addition',
            value: ['','1,000,000','500,000','-','-','-'],
            isAmount :  true,
            hightlightRow : true
          }
        ]
      }
    }
    
  }

}
