import { Component, OnInit } from '@angular/core';
import { loan_model, borrower_model } from '../../../models/loanmodel';
import { environment } from '../../../../environments/environment.prod';
import { deserialize } from 'serializer.ts/Serializer';
import { JsonConvert } from 'json2typescript';
import { LocalStorageService } from 'ngx-webstorage';
import { LoggingService } from '../../../services/Logs/logging.service';
import { PriceFormatter } from '../../../Workers/utility/aggrid/formatters';


@Component({
  selector: 'app-financials',
  templateUrl: './financials.component.html',
  styleUrls: ['./financials.component.scss']
})
export class FinancialsComponent implements OnInit {
  private loanMaster: any;
  public allDataFetched = false;
  public rowData = [];
 
  constructor(public localstorageservice: LocalStorageService, public logging: LoggingService) {

   
  }


  priceFormat(value){
    return PriceFormatter(value);
  }
  


  ngOnInit() {    
    this.localstorageservice.observe(environment.loankey).subscribe(res => {
      if(res!=undefined && res!=null)
      {
        this.loanMaster = res.LoanMaster[0];       
      // log
      this.logging.checkandcreatelog(1, 'financials', "LocalStorage updated");
     
       this.allDataFetched = true;       
       this.prepareviewmodel();
      }
    })
      this.getdataforgrid();
  }

  getdataforgrid() {

    let obj: any = this.localstorageservice.retrieve(environment.loankey);
    this.logging.checkandcreatelog(1, 'financials', "LocalStorage retrieved");
    if (obj != null && obj != undefined) {
      this.loanMaster = obj.LoanMaster[0];
      this.allDataFetched = true;
      if(this.loanMaster!=null)
      this.prepareviewmodel();
      else
      this.rowData=[];
    }
  }
  prepareviewmodel() {
    
   // prepare three rows here

      if(this.loanMaster)
      {  
        this.rowData=[];
        
        //1st Current Financial Row
        var currentobj={Financials:'Current',Assets:this.loanMaster.Current_Assets ,Debt:this.loanMaster.Current_Liabilities ,
        Equity:(this.loanMaster.Current_Assets - this.loanMaster.Current_Liabilities) ,Ratios:(this.loanMaster.Current_Assets / this.loanMaster.Current_Liabilities).toFixed(2),FICO: this.loanMaster.Credit_Score ,Rating: "*".repeat(this.loanMaster.Borrower_Rating || 0)  }
        this.rowData.push(currentobj);

        //1st Intermediate Financial Row
        var Intermediateobj={Financials:'Intermediate',Assets:this.loanMaster.Inter_Assets,Debt:this.loanMaster.Inter_Liabilities ,
        Equity:(this.loanMaster.Inter_Assets - this.loanMaster.Inter_Liabilities) ,Ratios:'',FICO:'',Rating:''}
        this.rowData.push(Intermediateobj)


        //1st LongTerm Financial Row
        var LongTermobj={Financials:'Long Term',Assets:this.loanMaster.Fixed_Assets,Debt:this.loanMaster.Fixed_Liabilities,
        Equity:(this.loanMaster.Fixed_Assets - this.loanMaster.Fixed_Liabilities) ,Ratios:'',FICO:'',Rating:''}
        this.rowData.push(LongTermobj)

        //Last Aggregate Row
        var Aggregateobj={Financials:'Total Financials',Assets:this.loanMaster.Total_Assets,Debt:this.loanMaster.Total_Liabilities,
        Equity:this.loanMaster.Total_Disc_Net_Worth,
        Ratios:(this.loanMaster.Total_Liabilities / this.loanMaster.Total_Assets ).toFixed(2)+' % Debt/Equity',
        FICO:"Financials as of",
        Rating:new Date(this.loanMaster.Borrower_Financials_Date).toLocaleDateString()};

        //this.pinnedBottomRowData.push(Aggregateobj);
        this.rowData.push(Aggregateobj);
      }
        
  }
          
}




