import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit {

  data: any;
  constructor() { }

  ngOnInit() {
    this.data = {
      partOne: [
        {
          text: 'Borrower Ratting',
          value: ['*****','***','**','*****','***','**']

        },
        {
          text: 'FICO Score',
          value: [700, 720, 700, 700, 650, 0]
        },
        {
          text: 'CPA Financials',
          value: ['Yes', 'Yes', 'Yes', '', '', '']
        },
        {
          text: '3yrs Tax Returns',
          value: ['Yes', 'Yes', 'Yes', '', '', '']
        },
        {
          text: 'Bankruptcy',
          value: ['No', 'No', 'No', 'No', '', '']
        },
        {
          text: 'Judgement',
          value: ['No', 'No', 'No', 'No', '', '']
        },
        {
          text: 'Years Farming',
          value: [33, 7, 5, 3, 0, 0]
        },
        {
          text: 'Farm Finacial Rating',
          value: ['145.8%', '100%', '100%', '0%', '', ' ']
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
