import { Component, OnInit } from '@angular/core';
import { loan_model } from '../../../models/loanmodel';
import { LocalStorageService } from 'ngx-webstorage';
import { LoancalculationWorker } from '../../../Workers/calculations/loancalculationworker';
import { ToastsManager } from 'ng2-toastr';
import { LoggingService } from '../../../services/Logs/logging.service';
import { environment } from '../../../../environments/environment';
import { modelparserfordb } from '../../../Workers/utility/modelparserfordb';
import { View_cropyield } from '../../../models/view_models/View_Crop';

@Component({
  selector: 'app-yield',
  templateUrl: './yield.component.html',
  styleUrls: ['./yield.component.scss']
})
export class YieldComponent implements OnInit {
  public years=[];
  private localloanobject:loan_model=new loan_model();
  public allDataFetched=false;  
  public editarray=[];
  public arrayrow=[];
  public syncenabled=false;
  public croppricesdetails:[any];
  constructor(public localstorageservice:LocalStorageService,
  public loanserviceworker:LoancalculationWorker,
  //public borrowerservice:BorrowerapiService,
  private toaster: ToastsManager,
  public logging:LoggingService
  ) { }
  ngOnInit() {
    this.localstorageservice.observe(environment.loankey).subscribe(res=>{
      this.logging.checkandcreatelog(1,'CropYield',"LocalStorage updated");
      this.localloanobject=res;
      this.allDataFetched=true;
    })
   
    for(let i=1;i<7;i++){
       this.years.push(new Date().getFullYear()-i);
    }
    this.croppricesdetails=this.localstorageservice.retrieve(environment.croppriceskey);
    this.getdataforgrid();
  }
  getdataforgrid(){
    let obj:any=this.localstorageservice.retrieve(environment.loankey);
    this.logging.checkandcreatelog(1,'CropYield',"LocalStorage retrieved");
    if(obj!=null && obj!=undefined)
    {
    this.localloanobject=obj;
    this.createbindablemodel();
    this.allDataFetched=true;
    }
  }


  createbindablemodel(){
    
    this.arrayrow=new Array<View_cropyield>(); 
    let valuestouse=this.localloanobject.CropYield.filter(p=>this.years.indexOf(p.Crop_Year)!=-1);
    let uniquerops=this.localloanobject.CropYield.map(p=>p.Crop_Type_Code).filter((value, index, self) => self.indexOf(value) === index)
    uniquerops.forEach(element => {
      let obj=new View_cropyield()
      obj.Crop_Type_Code=element;
      obj.Crop_Type=this.croppricesdetails.find(p=>p.Crop_Type_Code==element).Crop_Code;
      this.years.forEach(element1 => {
        let foundobj=this.localloanobject.CropYield.find(p=>p.Crop_Year==element1 && p.Crop_Type_Code==element);
        if(foundobj!=null){
          obj[element1+"_yield"]=foundobj.Crop_Yield;
        }
        else{
          obj[element1+"_yield"]=0;
        }
        obj.Loan_ID=valuestouse[0].Loan_ID;
        obj.Practice_Type_Code=valuestouse.find(p=>p.Crop_Type_Code==element).Practice_Type_Code;
        obj.APH=this.localloanobject.CropYieldHistoryFCvalues.find(p=>p.FC_Crop_Type_Code==element).FC_Crop_APH;
        obj.Crop_Yield=this.localloanobject.CropYieldHistoryFCvalues.find(p=>p.FC_Crop_Type_Code==element).FC_Crop_Yield;
      });
      this.arrayrow.push(obj);
     });
  }
  startediting(value:string){
    
   if(this.editarray[value]!=true)
  this.editarray[value]=true;
  }
  valueupdate(value:any,key:string,lon_id:number){
    
    this.editarray[key]=false;
    this.localloanobject.CropYield.find(p=>p.Loan_ID==lon_id)[key.substr(0,key.length-1)] =parseInt(value);
    this.logging.checkandcreatelog(3,'CropYield',"Field Edited -"+key);
    this.loanserviceworker.performcalculationonloanobject(this.localloanobject);
    this.syncenabled=true;
  }

   synctoDb(){
    var obj=modelparserfordb(this.localloanobject.Borrower);
    // this.borrowerservice.saveupdateborrower(obj).subscribe(res=>{
    //   this.logging.checkandcreatelog(3,'BalanceSheet',"Code Synced to DB with ResCode "+res.ResCode);
    //   if(res.ResCode==1){
    //     this.toaster.success("Object Synced Successfully");
    //   }
    //   else{
    //     this.toaster.error("Error Encountered while Syncing");
    //    }
    // });
   }


}
