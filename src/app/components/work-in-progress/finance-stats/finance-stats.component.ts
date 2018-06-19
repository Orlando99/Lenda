import { Component, OnInit } from '@angular/core';
import { loan_model } from '../../../models/loanmodel';
import { LocalStorageService } from 'ngx-webstorage';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-finance-stats',
  templateUrl: './finance-stats.component.html',
  styleUrls: ['./finance-stats.component.scss']
})
export class FinanceStatsComponent implements OnInit {

  balanceSheetConfig: any;
  revenueConfig: any;
  collateralConfig: any;
  localloanobj : loan_model;
  constructor(private localstorageservice : LocalStorageService) { }

  ngOnInit() {
    this.localloanobj = this.localstorageservice.retrieve(environment.loankey);

    this.balanceSheetConfig = {
      data : [
        {
          col1: 'Assets',
          amount: this.localloanobj.Borrower.FC_Borrower_TotalAssets,
          col3 : 'FICO',
          col4 : this.localloanobj.Borrower.FC_Borrower_FICO
        },
        {
          col1: 'Debt',
          amount: this.localloanobj.Borrower.FC_Borrower_TotalDebt,
          col3 : 'Current',
          col4 : this.localloanobj.Borrower.Borrower_Current_Assets
        },
        {
          col1: 'Equity',
          amount: this.localloanobj.Borrower.FC_Borrower_TotalEquity,
          col3 : 'Debt/Equity',
          col4 : '43.2%'
        }
      ],
      highlightRowsIndex : [2]
    };
    
    this.revenueConfig = {
      data : [
        {
          revenueType: 'Corn',
          acers: '400',
          yield : '200',
          revenueAmount : '323,201'
        },
        {
          revenueType: 'Soybeans',
          acers: '4,400,000',
          yield : '43',
          revenueAmount : '246,747'
        },
        {
          revenueType: 'Stored Crop',
          acers: undefined,
          yield : undefined,
          revenueAmount : '322,500'
        },
        {
          revenueType: 'Totals',
          acers: '1,000',
          yield : undefined,
          revenueAmount : '902,457'
        }
      ],
      highlightRowsIndex : [3]
    };

    this.collateralConfig = {
      data : [
        {
          collateralType: 'Crop',
          insValue: '405,678',
          discInsValue : '385,394',
          commitPer : '204.3%'
        },
        {
          collateralType: 'Stored Crop',
          insValue: '405,678',
          discInsValue : '385,394',
          commitPer : '204.3%'
        },
        {
          collateralType: 'Total Collateral',
          insValue: '405,678',
          discInsValue : '385,394',
          commitPer : '204.3%'
        },
        {
          collateralType: 'Total Excess',
          insValue: '405,678',
          discInsValue : '385,394',
          commitPer : '204.3%'
        },
        {
          collateralType: 'Ag-Pro Credit',
          insValue: '405,678',
          discInsValue : '385,394',
          commitPer : '204.3%'
        },
        {
          collateralType: 'ARM Access/RC',
          insValue: '405,678',
          discInsValue : '385,394',
          commitPer : '204.3%'
        },
        

      ],
      highlightRowsIndex : [2,3,5]
    };
  }
}
