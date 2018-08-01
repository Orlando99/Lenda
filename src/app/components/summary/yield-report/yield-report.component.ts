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

    //this.cropYear = this.localstorageservice.retrieve(environment.loankey).LoanMaster[0] != null ? this.localstorageservice.retrieve(environment.loankey).LoanMaster[0].Crop_Year : 0;

    
    this.localstorageservice.observe(environment.loankey).subscribe(res => {
      if(res!=undefined && res!=null)
      {

        if(res && res.CropYield && res.LoanMaster){
          this.prepareData(res);
        }       
       
      }
    });
  
    let res: any = this.localstorageservice.retrieve(environment.loankey);

    if(res && res.CropYield && res.LoanMaster){
      this.prepareData(res);
    }
  }



  private prepareData(res: any) {
    this.cropYield = res.CropYield;
    this.cropYear = res.LoanMaster[0].Crop_Year;
    this.years = [];
    for (let i = 1; i < 8; i++) {
      this.years.push(this.cropYear - i);
    }
    ;
  }
}
