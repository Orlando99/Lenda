import { Component, OnInit } from '@angular/core';
import { FsaService } from './fsa/fsa.service';
import { LiveStockService } from './livestock/livestock.service';
import {FormControl} from '@angular/forms';
import { LocalStorageService } from 'ngx-webstorage';
import { environment } from '../../../environments/environment.prod';
@Component({
  selector: 'app-collateral',
  templateUrl: './collateral.component.html',
  styleUrls: ['./collateral.component.scss'],
  providers: [FsaService, LiveStockService]
})

export class CollateralComponent implements OnInit {
  categories:  any = [];
  categoryList: string[] = ['Buyer','FSA', 'Livestock', 'Equipment', 'Real Estate', 'Stored Crop', 'Marketing Contracts', 'Others'];
  loanFullID: string;

  constructor(private localstorageservice: LocalStorageService) { 

    console.log(this.categories);
    this.loanFullID = this.localstorageservice.retrieve(environment.loanidkey)
    // 
  }

  ngOnInit() {
    
    let obj:any = this.localstorageservice.retrieve(environment.collateralTables)

    if(obj !== undefined && obj !== null){
      let value = obj.findIndex(f => { return f.loanFullID == this.loanFullID})
      if(value !== -1)
        this.categories = obj[value].values;
    }
  }


  menuSelected(e){
    let store = this.localstorageservice.retrieve(environment.collateralTables);

    if(store != null && store != undefined){
      let exist = store.findIndex(f => { return f.loanFullID == this.loanFullID})
      
      if(store[exist]){
        store[exist].values = e.value
      }else{
        store.push({loanFullID: this.loanFullID, values: e.value});
      }
      
      this.localstorageservice.store(environment.collateralTables,store);
    }else{
      store = [{loanFullID: this.loanFullID, values: e.value}];
      this.localstorageservice.store(environment.collateralTables,store);
    }
     
  }
}


