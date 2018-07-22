import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment.prod';
import { loan_model, Loan_Collateral } from '../../../models/loanmodel';
import { LocalStorageService } from 'ngx-webstorage';
import { LoancalculationWorker } from '../../../Workers/calculations/loancalculationworker';
import { LoggingService } from '../../../services/Logs/logging.service';
import { CropapiService } from '../../../services/crop/cropapi.service';
import { getNumericCellEditor } from '../../../Workers/utility/aggrid/numericboxes';
import { currencyFormatter, insuredFormatter, discFormatter } from '../../../Workers/utility/aggrid/collateralboxes';
import { DeleteButtonRenderer } from '../../../aggridcolumns/deletebuttoncolumn';
import { AlertifyService } from '../../../alertify/alertify.service';
import { LoanApiService } from '../../../services/loan/loanapi.service';
import { ToastsManager } from 'ng2-toastr';
import { JsonConvert } from 'json2typescript';
import { SelectEditor } from '../../../aggridfilters/selectbox';
import { GridOptions } from '../../../../../node_modules/ag-grid';
import { debug } from 'util';
import { getAlphaNumericCellEditor } from '../../../Workers/utility/aggrid/alphanumericboxes';
import { CollateralService } from '../collateral.service';
import { FsaService } from './fsa.service';

@Component({
  selector: 'app-fsa',
  templateUrl: './fsa.component.html',
  styleUrls: ['./fsa.component.scss'],
  providers: [FsaService]
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
  public deleteAction = false;
  public pinnedBottomRowData;
  public rowClassRules;

  constructor(public localstorageservice: LocalStorageService,
    private toaster: ToastsManager,
    public loanserviceworker: LoancalculationWorker,
    public cropunitservice: CropapiService,
    public logging: LoggingService,
    public alertify: AlertifyService,
    public loanapi: LoanApiService,
    public collateralService: CollateralService,
    public fsaService: FsaService) {
    this.components = { numericCellEditor: getNumericCellEditor(), alphaNumeric: getAlphaNumericCellEditor() };
    this.refdata = this.localstorageservice.retrieve(environment.referencedatakey);
    this.frameworkcomponents = { selectEditor: SelectEditor, deletecolumn: DeleteButtonRenderer };

    this.columnDefs = [
      { headerName: 'Category', field: 'Collateral_Category_Code', editable: false, width: 100 },
      { headerName: 'Description', field: 'Collateral_Description', editable: true, width: 120, cellEditor: "alphaNumeric", cellClass: ['editable-color'] },
      { headerName: 'Mkt Value', field: 'Market_Value', editable: true, cellEditor: "numericCellEditor", valueFormatter: currencyFormatter, cellClass: ['editable-color', 'text-right'] },
      { headerName: 'Prior Lien', field: 'Prior_Lien_Amount', editable: true, cellEditor: "numericCellEditor", valueFormatter: currencyFormatter, cellStyle: { textAlign: "right" }, cellClass: ['editable-color', 'text-right'] },
      { headerName: 'Lienholder', field: 'Lien_Holder', editable: true, width: 130, cellClass: 'editable-color', cellEditor: "alphaNumeric" },
      {
        headerName: 'Net Mkt Value', field: 'Net_Market_Value', editable: false, cellEditor: "numericCellEditor", valueFormatter: currencyFormatter, cellClass: ['text-right']
        // valueGetter: function (params) {
        //   return setNetMktValue(params);}
      },
      {
        headerName: 'Discount %', field: 'Disc_Value', editable: true, cellEditor: "numericCellEditor", valueFormatter: discFormatter, cellClass: ['editable-color', 'text-right'], width: 130,
        pinnedRowCellRenderer: function () { return '-'; }
      },
      {
        headerName: 'Disc Value', field: 'Disc_CEI_Value', editable: false, cellEditor: "numericCellEditor", cellClass: ['editable-color', 'text-right'],
        // valueGetter: function (params) {
        //   return setDiscValue(params);
        // },
        valueFormatter: currencyFormatter
      },
      {
        headerName: 'Insured', field: 'Insured_Flag', editable: true, cellEditor: "selectEditor", width: 100, cellClass: ['editable-color'],
        cellEditorParams: {
          values: [{ 'key': 0, 'value': 'No' }, { 'key': 1, 'value': 'Yes' }]
        }, pinnedRowCellRenderer: function () { return ' '; },
        valueFormatter: insuredFormatter
      },
      { headerName: '', field: 'value', cellRenderer: "deletecolumn", width: 80, pinnedRowCellRenderer: function () { return ' '; } }
    ];

    this.context = { componentParent: this };
  }

  ngOnInit() {
    this.localstorageservice.observe(environment.loankey).subscribe(res => {
      this.collateralService.onInit(this.localloanobject, this.gridApi, res, 'FSAComponent' ,'FSA');
    });

    this.getdataforgrid();
  }

  getdataforgrid() {
    let obj: any = this.localstorageservice.retrieve(environment.loankey);
    this.logging.checkandcreatelog(1, 'LoanCollateral - FSA', "LocalStorage retrieved");
    if (obj != null && obj != undefined) {
      this.localloanobject = obj;
      this.rowData = [];
      this.rowData = this.localloanobject.LoanCollateral !== null ? this.localloanobject.LoanCollateral.filter(lc => { return lc.Collateral_Category_Code === "FSA" && lc.ActionStatus !== 3 }) : [];
      this.pinnedBottomRowData = this.fsaService.computeTotal(obj);
    }
    this.collateralService.getgridheight();
    this.adjustgrid();
  }

  onGridSizeChanged(Event: any) {

    this.adjustgrid();
  }

  private adjustgrid() {
    try {
      this.gridApi.sizeColumnsToFit();
    }
    catch {
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.collateralService.getgridheight();
    this.adjustgrid();
  }

  syncenabled() {
    return this.rowData.filter(p => p.ActionStatus != null).length > 0 || this.deleteAction
  }

  synctoDb() {
    this.collateralService.syncToDb(this.localloanobject);
  }

  //Grid Events
  addrow() {
    this.collateralService.addRow(this.localloanobject, this.gridApi, this.rowData, "FSA");
  }

  rowvaluechanged(value: any) {
    this.collateralService.rowValueChanged(value, this.localloanobject, "FSAComponent");
  }

  DeleteClicked(rowIndex: any) {
    this.collateralService.deleteClicked(rowIndex, this.localloanobject);
  }
}
