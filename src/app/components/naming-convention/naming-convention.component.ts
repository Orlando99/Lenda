import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastsManager } from "ng2-toastr";
import { NamingConventionapiService } from '../../services/admin/namingconventionapi.service';
import { environment } from '../../../environments/environment';
import { deserialize, serialize } from 'serializer.ts/Serializer';
import { loan_model } from '../../models/loanmodel';
import { JsonConvert } from 'json2typescript';
import { LocalStorageService } from 'ngx-webstorage';
import { NumericEditor } from '../../aggridfilters/numericaggrid';
import { AggridTxtAreaComponent } from '../../aggridfilters/textarea';

@Component({
  selector: 'app-naming-convention',
  templateUrl: './naming-convention.component.html',
  styleUrls: ['./naming-convention.component.scss']
})
export class NamingConventionComponent implements OnInit {

  public loading = false;
  private gridApi;
  public defaultColDef;
  public btndsb: boolean = true;
  private gridColumnApi;
  public columnDefs;
  public selectedrows = [];
  public frameworkComponents;
  public rowSelection;
  editing = {};
  rows = [];

  constructor(
    private toaster: ToastsManager,
    private namingconventionservice: NamingConventionapiService,
    private localstorageservice:LocalStorageService) { 

    }

    onGridReady(params) {
      
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
      params.api.setRowData(this.rows);
      setTimeout(function() {
        params.api.resetRowHeights();
      }, 500);
    }
  
    ngOnInit() {
      
      this.columnDefs = [
  
        {
          headerName: "Id",
          field: "Id",
          width: 80,
          checkboxSelection: true,
          editable: true
        },
        {
          headerName: "Old_LM_Table",
          field: "Old_LM_Table",
          width: 150,
          editable: true
        },
        {
          headerName: "Old_LM_Field",
          field: "Old_LM_Field",
          width: 150,
          editable: true
        },
        {
          headerName: "New_LM_Table",
          field: "New_LM_Table",
          width: 150,
          editable: true
        },
        {
          headerName: "New_LM_Field",
          field: "New_LM_Field",
          width: 150,
          editable: true
        },
        {
          headerName: "Seq_Num",
          field: "Seq_Num",
          width: 100,
          editable: true
        },
        {
          headerName: "Formula",
          field: "Formula",
          width: 200,
          editable: true
        },
        {
          headerName: "LoanObject",
          field: "LoanObject",
          width: 150, editable:  true,
          cellStyle: { "white-space": "normal" },
        },
        {
          headerName: "Level",
          field: "Level",
          width: 150, editable:  true,
          cellStyle: { "white-space": "normal" },
        },
        {
          headerName: "LendaPlusName",
          field: "LendaPlusName",
          width: 150, editable:  true,
          cellStyle: { "white-space": "normal" },
        },
        {
          headerName: "Comments",
          field: "Comments",
          cellStyle: { "white-space": "normal" },
          autoHeight:true,
          cellEditor:'agLargeTextCellEditor',
          width: 250, editable:  true
        }
      ];
      
      this.rowSelection = "multiple";
      this.getNamingConventionList();
    }
  
    getNamingConventionList() {
      
      this.loading=true;
      this.namingconventionservice.getNamingConventionList().subscribe(res => {
        if (res.ResCode == 1) {
          this.rows = res.Data;
          if(res.Data==null){
            this.rows=[];
          }
          this.rows.push({});
        }
        this.loading=false;
      });
     
    }
    onSelectionChanged() {
      
      this.selectedrows = this.gridApi.getSelectedRows();
      if (this.selectedrows.length > 0) {
        this.btndsb = false;
      }
      else {
        this.btndsb = true;
      }
    }
  
  
  celleditingstopped(event: any) {
    
  if(event.value.trim()!=""){
    this.loading=true;
    if (event.data.Id == undefined || event.data.Id === "") {
      
      var newItem ={};
      event.data.Id = 0;
      this.namingconventionservice.addEditNamingConvention(event.data).subscribe(res => {
        this.rows[event.rowIndex]=event.data;
        this.rows[event.rowIndex].Id = parseInt(res.Data);
        this.gridApi.setRowData(this.rows);
        this.gridApi.updateRowData({ add: [newItem] });
        this.loading=false;
      });
     
    }
    else {
      this.namingconventionservice.addEditNamingConvention(event.data).subscribe(res => {
        this.loading=false;
      });
    }
   
  }
  }
  
  search(event:any){
      
    this.gridApi.setQuickFilter(event.target.value);
  }
  Deleterow(){
    this.selectedrows.forEach(element => {
      this.namingconventionservice.deleteNamingConvention(element.Id).subscribe(res => {
        this.rows = this.rows.filter(p => p.Id != element.Id);
      })
    });
    this.rows.push({});
  }

}
