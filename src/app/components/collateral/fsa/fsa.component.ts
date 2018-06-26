import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { loan_model} from '../../../models/loanmodel';
import { LocalStorageService } from 'ngx-webstorage';
import { LoancalculationWorker } from '../../../Workers/calculations/loancalculationworker';
import { LoggingService } from '../../../services/Logs/logging.service';
import { CropapiService } from '../../../services/crop/cropapi.service';
import { getNumericCellEditor } from '../../../Workers/utility/aggrid/numericboxes';
import { DeleteButtonRenderer } from '../../../aggridcolumns/deletebuttoncolumn';
import { AlertifyService } from '../../../alertify/alertify.service';
import { LoanApiService } from '../../../services/loan/loanapi.service';

@Component({
  selector: 'app-fsa',
  templateUrl: './fsa.component.html',
  styleUrls: ['./fsa.component.scss']
})
export class FSAComponent implements OnInit {
  public refdata: any = {};
  public columnDefs = [];
  private localloanobject: loan_model = new loan_model();
 
  public rowData = [];
  public components;
  public context;
  public frameworkcomponents;
  public editType;
  public gridApi;
  public columnApi;

  style = {
    marginTop: '10px',
    width: '93%',
    height: '100px',
    boxSizing: 'border-box'
  };
  
  constructor(public localstorageservice: LocalStorageService,
    public loanserviceworker: LoancalculationWorker,
    public cropunitservice: CropapiService,
    public logging: LoggingService,
    public alertify:AlertifyService,
    public loanapi:LoanApiService){ 

      this.components = { numericCellEditor: getNumericCellEditor() };
      this.refdata = this.localstorageservice.retrieve(environment.referencedatakey);
      this.frameworkcomponents = {deletecolumn: DeleteButtonRenderer };
      
      this.columnDefs = [
        { headerName: 'Category', field: 'Collateral_Category_Code',  editable: true },
        { headerName: 'Description', field: 'Collateral_Description',  editable: true },
        { headerName: 'Mkt Value', field: 'Market_Value',  editable: true },
        { headerName: 'Prior Lien', field: 'Prior_Lien_Amount',  editable: true },
        { headerName: 'Lienholder', field: 'Lien_Holder',  editable: true },
        { headerName: 'Net Mkt Value', field: 'Net_Market_Value',  editable: true },
        { headerName: 'Discount %', field: 'Disc_CEI_Value',  editable: true },
        { headerName: 'Disc Value', field: 'Disc_Value',  editable: true },
        { headerName: 'Insured', field: 'Net_Market_Value',  editable: true },
        { headerName: 'Net Mkt Value', field: 'Insured_Flag',  editable: true },
        { headerName: '', field: 'value',  cellRenderer: "deletecolumn" }
      ];
 
      this.context = { componentParent: this }; 
  }
  
  ngOnInit() {
    this.localstorageservice.observe(environment.loankey).subscribe(res => {
      this.logging.checkandcreatelog(1, 'LoanCollateral', "LocalStorage updated");
      this.localloanobject = res;
      this.rowData=[];
      this.rowData=this.localloanobject.LoanCollateral.filter(lc=>{ return lc.Collateral_Category_Code === "FSA"})
        this.getgridheight();
    });
    this.getdataforgrid();
  }

  getdataforgrid() {
    let obj: any = this.localstorageservice.retrieve(environment.loankey);
    this.logging.checkandcreatelog(1, 'LoanCollateral', "LocalStorage retrieved");
    if (obj != null && obj != undefined) {
      this.localloanobject = obj;
      this.rowData=[];
      this.rowData=this.localloanobject.LoanCollateral.filter(lc=>{ return lc.Collateral_Category_Code === "FSA"})
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.getgridheight();
  }
 
  synctoDb() {
  }

  //Grid Events
  addrow() {
  }

  valuechanged(value:any,selectname:any,rowindex:any){
  }

  rowvaluechanged(value: any) {

  }

  

  DeleteClicked(rowIndex: any) {

  }

  syncenabled(){
   
  }

  getgridheight(){
    this.style.height=(28*(this.rowData.length+2)).toString()+"px";
  }
}
