import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';
import { NamingConventionapiService } from '../../services/admin/namingconventionapi.service';
import { environment } from '../../../environments/environment';
import { deserialize, serialize } from 'serializer.ts/Serializer';
import { loan_model } from '../../models/loanmodel';
import { JsonConvert } from 'json2typescript';
import { LocalStorageService } from 'ngx-webstorage';
import { NumericEditor } from '../../aggridfilters/numericaggrid';
import { AggridTxtAreaComponent } from '../../aggridfilters/textarea';
import { IfObservable } from 'rxjs/observable/IfObservable';
import { MAT_LABEL_GLOBAL_OPTIONS } from '@angular/material';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-naming-convention',
  templateUrl: './naming-convention.component.html',
  styleUrls: ['./naming-convention.component.scss'],
  providers: [
    {provide: MAT_LABEL_GLOBAL_OPTIONS, useValue: {float: 'auto'}}
  ]
})

export class NamingConventionComponent implements OnInit {

  public loading = false;
  private gridApi;
  public defaultColDef;
  public btndsb: boolean = true;
  public gridColumnApi;
  public getRowHeight;
  public columnDefs;
  public selectedrows = [];
  public frameworkComponents;
  public rowSelection;
  editing = {};
  rows = [];
  public allColumnIds = [];
  public selectedValue = 'All';
  public tables=[]
  private unfilteredRow;

  constructor(
    private toaster: ToastsManager,
    private namingconventionservice: NamingConventionapiService,
    private localstorageservice: LocalStorageService) {
        this.tables=['All']
       
    }

    onGridReady(params) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
      params.api.setRowData(this.rows);
      setTimeout(function() {
        params.api.resetRowHeights();
      }, 1000);
    }

    onColumnEvent(params) {
      if (params.finished) {
        params.api.resetRowHeights();
      }
    }

    ngOnInit() {
      this.allColumnIds.push('Formula');
      this.allColumnIds.push('Comments');
      this.columnDefs = [
        {
          headerName: 'Id',
          field: 'Id',
          width: 80,
          checkboxSelection: true,
          editable: false
        },
        {
          headerName: 'Old_LM_Table',
          field: 'Old_LM_Table',
          width: 150,
          editable: true
        },
        {
          headerName: 'Old_LM_Field',
          field: 'Old_LM_Field',
          width: 150,
          editable: true
        },
        {
          headerName: 'New_LM_Table',
          field: 'New_LM_Table',
          width: 150,
          editable: true
        },
        {
          headerName: 'New_LM_Field',
          field: 'New_LM_Field',
          width: 150,
          editable: true
        },
        {
          headerName: 'Seq_Num',
          field: 'Seq_Num',
          width: 100,
          editable: true
        },
        {
          headerName: 'Formula',
          field: 'Formula',
          width: 300,
          editable: true,
          autoHeight: true,
          cellEditor: 'agLargeTextCellEditor',
          cellStyle: { 'white-space': 'normal' },
        },
        {
          headerName: 'LoanObject',
          field: 'LoanObject',
          width: 150, editable:  true,
          cellStyle: { 'white-space': 'normal' },
        },
        {
          headerName: 'Level',
          field: 'Level',
          width: 150, editable:  true,
          cellStyle: { 'white-space': 'normal' },
        },
        {
          headerName: 'LendaPlusName',
          field: 'LendaPlusName',
          width: 150, editable:  true,
          cellStyle: { 'white-space': 'normal' },
        },
        {
          headerName: 'Comments',
          field: 'Comments',
          cellStyle: { 'white-space': 'normal' },
          autoHeight: true,
          cellEditor: 'agLargeTextCellEditor',
          width: 250, editable:  true
        },
        {
          headerName: 'Status',
          field: 'Status',
          autoHeight: true,
          width: 80,
          cellStyle: function(params) {
            if (params.value == -5) {
                return {color: 'red'};
            } else if(params.value == 1) {
              return {color: 'green'};
            }
          }
        },
        {
          headerName: 'Role',
          field: 'Role',
          autoHeight: true,
          width: 80
        }
      ];
      this.rowSelection = 'multiple';
      this.getNamingConventionList();
      this.getRowHeight = function(params) {
        if (params.data.Formula !== undefined) {
         let formulaLength = 0;
         let commentLength = 0;
          if  (params.data.Formula.length > 0 || params.data.Comments.length) {
            formulaLength = 25 * (params.data.Formula.split('\n').length + 1);
            commentLength = 25 * (params.data.Comments.split('\n').length + 1);
            if ( formulaLength > commentLength ) {
              return formulaLength;
            } else {
              return commentLength;
            }
          } else {
            return 30;
          }
        } else {
          return 30;
        }
      };
    }
    getNamingConventionList() {
      this.loading = true;
      this.namingconventionservice.getNamingConventionList().subscribe(res => {
        if (res.ResCode === 1) {
          this.unfilteredRow = res.Data
          this.rows = res.Data;
          if (res.Data === null) {
            this.rows = [];
          }
          this.rows.push({});

          this.rows.forEach(val => {
            if(this.tables.indexOf(val.New_LM_Table) === -1){
              this.tables.push(val.New_LM_Table);     
             } 
          })

        }
        
        this.loading = false;
      });
    }

    onSelectionChanged() {
      this.selectedrows = this.gridApi.getSelectedRows();
      if (this.selectedrows.length > 0) {
        this.btndsb = false;
      } else {
        this.btndsb = true;
      }
    }
  celleditingstopped(event: any) {
  if (event.value.trim() !== '' || (event.data.Id > 0 && event.value.trim() === '')) {
    this.loading = true;
    if (event.data.Id === undefined || event.data.Id === '') {
      const newItem = {};
      event.data.Id = 0;
      this.namingconventionservice.addEditNamingConvention(event.data).subscribe(res => {
        this.rows[event.rowIndex] = event.data;
        this.rows[event.rowIndex].Id = parseInt(res.Data);
        this.gridApi.updateRowData({ add: [newItem] });
        event.api.resetRowHeights();
        this.loading = false;
      });
    } else {
      this.namingconventionservice.addEditNamingConvention(event.data).subscribe(res => {
        event.api.resetRowHeights();
        this.loading = false;
      });
    }
  }
  }
  search(event: any) {
    this.gridApi.setQuickFilter(event.target.value);
  }
  Deleterow() {
    const ids = [];
    this.selectedrows.forEach(element => {
      ids.push(element.Id);
    });
    this.loading = true;
    this.namingconventionservice.deleteNamingConvention(ids).subscribe(res => {
      if (res.ResCode === 1) {
            this.rows = res.Data;
            if (res.Data === null) {
              this.rows = [];
            }
            this.rows.push({});
          }
          this.loading = false;
    });
  }

  filterLM(){
    if(this.selectedValue === 'All'){
      this.rows = this.unfilteredRow;
    }else{
      this.rows = this.unfilteredRow;
      let newRow = this.rows.filter(e =>{
        if(e.New_LM_Table === this.selectedValue){
          return e;}
      });
      this.rows = newRow;
    }
  }
  
}
