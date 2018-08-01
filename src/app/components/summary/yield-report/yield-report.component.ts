import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { environment } from '../../../../environments/environment.prod';
import { loan_model } from '../../../models/loanmodel';

@Component({
  selector: 'app-yield-report',
  templateUrl: './yield-report.component.html',
  styleUrls: ['./yield-report.component.scss']
})
export class YieldReportComponent implements OnInit {

  constructor(public localstorageservice: LocalStorageService) {
 
  }
  cropYield: Array<any>;
  cropYear : number;
  years : Array<number> = [];

  ngOnInit() {    

    this.cropYear = this.localstorageservice.retrieve(environment.loankey).LoanMaster[0] != null ? this.localstorageservice.retrieve(environment.loankey).LoanMaster[0].Crop_Year : 0;

    for(let i=1; i<8;i++){
      this.years.push(this.cropYear-i);
    };
    this.localstorageservice.observe(environment.loankey).subscribe(res => {
      if(res!=undefined && res!=null)
      {

        if(res && res.CropYield){
          this.cropYield = res.CropYield;
        }       
       
      }
    });
  
    let res: any = this.localstorageservice.retrieve(environment.loankey);
    if(res && res.CropYield){
      this.cropYield = res.CropYield;
    }
  }


  // getdataforgrid() {

  //   let obj: any = this.localstorageservice.retrieve(environment.loankey);
  //   // this.logging.checkandcreatelog(1, 'financials', "LocalStorage retrieved");
  //   if (obj != null && obj != undefined) {
  //     this.loanMaster = obj.LoanMaster[0];
  //     this.allDataFetched = true;
  //     if(this.loanMaster!=null)
  //     this.prepareviewmodel();
  //     else
  //     this.rowData=[];
  //   }
  // }
  // prepareviewmodel() {
    
  //  // prepare three rows here

  //     if(this.loanMaster)
  //     {  
  //       this.rowData=[];
        
  //       //1st Current Financial Row
  //       var currentobj={Financials:'Current',Assets:this.loanMaster.Current_Assets ,Debt:this.loanMaster.Current_Liabilities ,
  //       Equity:(this.loanMaster.Current_Assets - this.loanMaster.Current_Liabilities) ,Ratios:(this.loanMaster.Current_Assets / this.loanMaster.Current_Liabilities *100).toFixed(1)+ '%',FICO: this.loanMaster.Credit_Score ,Rating: "*".repeat(this.loanMaster.Borrower_Rating || 0)  }
  //       this.rowData.push(currentobj);

  //       //1st Intermediate Financial Row
  //       var Intermediateobj={Financials:'Intermediate',Assets:this.loanMaster.Inter_Assets,Debt:this.loanMaster.Inter_Liabilities ,
  //       Equity:(this.loanMaster.Inter_Assets - this.loanMaster.Inter_Liabilities) ,Ratios:'',FICO:'',Rating:''}
  //       this.rowData.push(Intermediateobj)


  //       //1st LongTerm Financial Row
  //       var LongTermobj={Financials:'Long Term',Assets:this.loanMaster.Fixed_Assets,Debt:this.loanMaster.Fixed_Liabilities,
  //       Equity:(this.loanMaster.Fixed_Assets - this.loanMaster.Fixed_Liabilities) ,Ratios:'',FICO:'',Rating:''}
  //       this.rowData.push(LongTermobj)

  //       //Last Aggregate Row
  //       var Aggregateobj={Financials:'Total Financials',Assets:this.loanMaster.Total_Assets,Debt:this.loanMaster.Total_Liabilities,
  //       Equity:this.loanMaster.Total_Disc_Net_Worth,
  //       Ratios:(this.loanMaster.Total_Liabilities / this.loanMaster.Total_Assets *100 ).toFixed(1)+' % Debt/Equity',
  //       FICO:"Financials as of",
  //       Rating:new Date(this.loanMaster.Financials_Date).toLocaleDateString()};

  //       //this.pinnedBottomRowData.push(Aggregateobj);
  //       this.rowData.push(Aggregateobj);
  //     }
        
  // }

}
