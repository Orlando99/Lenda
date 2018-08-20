import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { environment } from '../../../../environments/environment.prod';
import { loan_model, Loan_Collateral } from '../../../models/loanmodel';
import { LocalStorageService } from 'ngx-webstorage';
import { LoancalculationWorker } from '../../../Workers/calculations/loancalculationworker';
import { LoggingService } from '../../../services/Logs/logging.service';
import { CropapiService } from '../../../services/crop/cropapi.service';
import { getNumericCellEditor } from '../../../Workers/utility/aggrid/numericboxes';
import { DeleteButtonRenderer } from '../../../aggridcolumns/deletebuttoncolumn';
import { AlertifyService } from '../../../alertify/alertify.service';
import { LoanApiService } from '../../../services/loan/loanapi.service';
import { ToastsManager } from 'ng2-toastr';
import { JsonConvert } from 'json2typescript';
import { SelectEditor } from '../../../aggridfilters/selectbox';
import { GridOptions } from 'ag-grid';
import { debug } from 'util';
import { getAlphaNumericCellEditor } from '../../../Workers/utility/aggrid/alphanumericboxes';
import { CollateralService } from '../collateral.service';
import { FsaService } from './fsa.service';
import CollateralSettings from './../collateral-types.model';
import { PublishService, Page } from "../../../services/publish.service";
import { EmptyEditor } from '../../../aggridfilters/emptybox';
import { BlankCellRenderer } from '../../../aggridcolumns/tooltip/aggridrenderers';

@Component({
  selector: 'app-fsa',
  templateUrl: './fsa.component.html',
  styleUrls: ['./fsa.component.scss'],
  providers: [FsaService, CollateralService]
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
    public fsaService: FsaService,
    public publishService: PublishService) {
    this.localloanobject = this.localstorageservice.retrieve(environment.loankey);
    this.components = {blankcell:BlankCellRenderer, numericCellEditor: getNumericCellEditor(), alphaNumeric: getAlphaNumericCellEditor() ,emptyeditor:EmptyEditor};
    this.refdata = this.localstorageservice.retrieve(environment.referencedatakey);
    this.frameworkcomponents = { selectEditor: SelectEditor, deletecolumn: DeleteButtonRenderer };
    this.columnDefs = this.fsaService.getColumnDefs(this.localloanobject);
    this.context = { componentParent: this };
  }

  ngOnInit() {
    // Observe the localstorage for changes
    this.subscribeToChanges();

    // on initialization

    this.rowData = this.collateralService.getRowData(this.localloanobject, CollateralSettings.fsa.key, CollateralSettings.fsa.source,'');
    this.fsaService.computeTotal(this.localloanobject); // we will still calculate the totals
    //this.collateralService.adjustgrid(this.gridApi);
  }

  subscribeToChanges() {
    this.localstorageservice.observe(environment.loankey).subscribe(res => {
      this.rowData = this.collateralService.getRowData(res, CollateralSettings.fsa.key, CollateralSettings.fsa.source,'');
    });
  }

  onGridSizeChanged(Event: any) {
    this.adjustgrid();
  }

  private adjustgrid() {
    try {
      //  this.gridApi.sizeColumnsToFit();
    }
    catch (ex) {
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    
    this.adjustgrid();
  }

  //Grid Events
  addrow() {
    this.fsaService.addRow(this.localloanobject, this.gridApi, this.rowData, CollateralSettings.fsa.source, CollateralSettings.fsa.sourceKey);
    this.publishService.enableSync(Page.collateral);
  }

  rowvaluechanged(value: any) {
    debugger
    this.fsaService.rowValueChanged(value, this.localloanobject,"AdditionalCollateral", CollateralSettings.fsa.source, CollateralSettings.fsa.pk);
    this.publishService.enableSync(Page.collateral);
  }

  DeleteClicked(rowIndex: any) {
    debugger
    this.collateralService.deleteClicked(rowIndex, this.localloanobject, this.rowData, CollateralSettings.fsa.source, CollateralSettings.fsa.pk);
    this.publishService.enableSync(Page.collateral);
  }
}
