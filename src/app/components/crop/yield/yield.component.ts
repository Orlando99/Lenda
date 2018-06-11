import { Component, OnInit } from '@angular/core';
import { loan_model } from '../../../models/loanmodel';
import { LocalStorageService } from 'ngx-webstorage';
import { LoancalculationWorker } from '../../../Workers/calculations/loancalculationworker';
import { ToastsManager } from 'ng2-toastr';
import { LoggingService } from '../../../services/Logs/logging.service';
import { environment } from '../../../../environments/environment';
import { modelparserfordb } from '../../../Workers/utility/modelparserfordb';
import { Loan_Crop_Type_Practice_Type_Yield_EditModel } from '../../../models/cropmodel';
import { CropapiService } from '../../../services/crop/cropapi.service';

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
  public editorder=[];
  public syncenabled=false;
  public croppricesdetails:[any];
  constructor(public localstorageservice:LocalStorageService,
  public loanserviceworker:LoancalculationWorker,
  public cropserviceapi:CropapiService,
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
    this.croppricesdetails= this.localstorageservice.retrieve(environment.referencedatakey);
    this.getdataforgrid();
  }
  getdataforgrid(){
    let obj:any=this.localstorageservice.retrieve(environment.loankey);
    this.logging.checkandcreatelog(1,'CropYield',"LocalStorage retrieved");
    if(obj!=null && obj!=undefined)
    {
    this.localloanobject=obj;
    this.allDataFetched=true;
    }
  }
  startediting(value:string){
    
    this.editarray=[];
  this.editarray[value]=true;
  }
  valueupdate(value:any,key:string,year:number,cropid:number,lon_id:number){
    debugger
    this.editarray[key]=false;
    if(value==""){
      value="0";
    }
    this.localloanobject.CropYield.find(p=>p.Loan_ID==lon_id && p.Crop_ID==cropid)[year] =parseInt(value);
    this.logging.checkandcreatelog(3,'CropYield',"Field Edited -"+key);
    this.loanserviceworker.performcalculationonloanobject(this.localloanobject);
    let edit=new Loan_Crop_Type_Practice_Type_Yield_EditModel();
    edit.CropId=cropid;
    edit.CropYear=year;
    edit.IsPropertyYear=true;
    edit.LoanID=lon_id;
    edit.PropertyName=year.toString();
    edit.PropertyValue=value;
    this.editorder.push(edit);
    this.syncenabled=true;
  }

   synctoDb(){
     debugger
    this.editorder.forEach(element => {
      this.cropserviceapi.saveupdateLoanCropYield(element).subscribe(res=>{
        this.toaster.success("Object Synchronized Successfully")
      })
    });
    this.editorder=[];
    this.syncenabled=false;
   }


}
