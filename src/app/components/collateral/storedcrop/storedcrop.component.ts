import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { environment } from '../../../../environments/environment.prod';
import { loan_model, Loan_Collateral } from '../../../models/loanmodel';
import { LocalStorageService } from 'ngx-webstorage';
import { LoancalculationWorker } from '../../../Workers/calculations/loancalculationworker';
import { LoggingService } from '../../../services/Logs/logging.service';
import { CropapiService } from '../../../services/crop/cropapi.service';
import { getNumericCellEditor } from '../../../Workers/utility/aggrid/numericboxes';
import { currencyFormatter, insuredFormatter, discFormatter, numberFormatter } from '../../../Workers/utility/aggrid/collateralboxes';
import { DeleteButtonRenderer } from '../../../aggridcolumns/deletebuttoncolumn';
import { AlertifyService } from '../../../alertify/alertify.service';
import { LoanApiService } from '../../../services/loan/loanapi.service';
import { ToastsManager } from 'ng2-toastr';
import { JsonConvert } from 'json2typescript';
import { SelectEditor } from '../../../aggridfilters/selectbox';
import { getAlphaNumericCellEditor } from '../../../Workers/utility/aggrid/alphanumericboxes';
import { CollateralService } from '../collateral.service';
import { StoredCropService } from './storedcrop.service';
import CollateralSettings from './../collateral-types.model';

@Component({
  selector: 'app-storedcrop',
  templateUrl: './storedcrop.component.html',
  styleUrls: ['./storedcrop.component.scss'],
  providers: [CollateralService, StoredCropService]
})
export class StoredCropComponent implements OnInit {
  @Output() enableSync = new EventEmitter();
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

  constructor(public localstorageservice: LocalStorageService,
    private toaster: ToastsManager,
    public loanserviceworker: LoancalculationWorker,
    public cropunitservice: CropapiService,
    public logging: LoggingService,
    public alertify: AlertifyService,
    public loanapi: LoanApiService,
    public collateralService: CollateralService,
    public storedcropService: StoredCropService) {

    this.components = { numericCellEditor: getNumericCellEditor(), alphaNumeric: getAlphaNumericCellEditor() };
    this.refdata = this.localstorageservice.retrieve(environment.referencedatakey);
    this.frameworkcomponents = { selectEditor: SelectEditor, deletecolumn: DeleteButtonRenderer };


    this.columnDefs = [
      { headerName: 'Category', field: 'Collateral_Category_Code', editable: false, width: 100 },
      { headerName: 'Description', field: 'Collateral_Description', cellEditor: "alphaNumeric", editable: true, width: 120, cellClass: 'editable-color' },
      { headerName: 'Qty', field: 'Qty', editable: true, cellEditor: "numericCellEditor", valueFormatter: numberFormatter, cellClass: ['editable-color', 'text-right'], width: 90 },
      { headerName: 'Price', field: 'Price', editable: true, cellEditor: "numericCellEditor", valueFormatter: currencyFormatter, cellClass: ['editable-color', 'text-right'], width: 110 },

      { headerName: 'Mkt Value', field: 'Market_Value', editable: false, cellEditor: "numericCellEditor", valueFormatter: currencyFormatter, cellClass: ['text-right'], width: 130 },
      { headerName: 'Prior Lien', field: 'Prior_Lien_Amount', editable: true, cellEditor: "numericCellEditor", valueFormatter: currencyFormatter, cellClass: ['editable-color', 'text-right'], width: 130 },
      { headerName: 'Lienholder', field: 'Lien_Holder', editable: true, width: 120, cellEditor: "alphaNumeric", cellClass: ['editable-color'] },
      {
        headerName: 'Net Mkt Value', field: 'Net_Market_Value', editable: false, cellEditor: "numericCellEditor", valueFormatter: currencyFormatter, cellClass: ['text-right'],
        // valueGetter: function (params) {
        //   return setNetMktValue(params);}
      },
      {
        headerName: 'Discount %', field: 'Disc_Value', editable: true, cellEditor: "numericCellEditor", valueFormatter: discFormatter, cellStyle: { textAlign: "right" }, width: 110, cellClass: ['editable-color', 'text-right'],
        pinnedRowCellRenderer: function () { return ' '; }
      },
      {
        headerName: 'Disc Value', field: 'Disc_CEI_Value', editable: false, cellEditor: "numericCellEditor", cellClass: ['text-right'],
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
    // Observe the localstorage for changes
    this.subscribeToChanges();

    // on initialization
    this.localloanobject = this.localstorageservice.retrieve(environment.loankey);
    this.rowData = this.collateralService.getRowData(this.localloanobject, CollateralSettings.storedCrop.key, CollateralSettings.storedCrop.source);
    this.pinnedBottomRowData = this.storedcropService.computeTotal(this.localloanobject);
    this.collateralService.adjustgrid(this.gridApi);
  }

  subscribeToChanges() {
    this.localstorageservice.observe(environment.loankey).subscribe(res => {
      let result = this.collateralService.subscribeToChanges(res, this.localloanobject, CollateralSettings.storedCrop.key, this.rowData, this.pinnedBottomRowData);
      this.rowData = result.rowData;
      this.pinnedBottomRowData = result.pinnedBottomRowData;
    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.collateralService.getgridheight(this.rowData);
  }

  isSyncRequired(isEnabled) {
    this.enableSync.emit(isEnabled);
  }

  //Grid Events
  addrow() {
    this.collateralService.addRow(this.localloanobject, this.gridApi, this.rowData, CollateralSettings.storedCrop.key, CollateralSettings.storedCrop.source);
    this.isSyncRequired(true);
  }

  rowvaluechanged(value: any) {
    this.collateralService.rowValueChanged(value, this.localloanobject, CollateralSettings.storedCrop.component, CollateralSettings.storedCrop.source);
    this.isSyncRequired(true);
  }

  DeleteClicked(rowIndex: any) {
    this.collateralService.deleteClicked(rowIndex, this.localloanobject, this.rowData, CollateralSettings.storedCrop.source);
    this.isSyncRequired(true);
  }

  onGridSizeChanged(Event: any) {
    try {
      this.gridApi.sizeColumnsToFit();
    }
    catch (ex) {

    }
  }
}
