import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { loan_model, Loan_Collateral, Loan_Marketing_Contract } from '../../../models/loanmodel';
import { LocalStorageService } from 'ngx-webstorage';
import { ToastsManager } from 'ng2-toastr';
import { LoancalculationWorker } from '../../../Workers/calculations/loancalculationworker';
import { CropapiService } from '../../../services/crop/cropapi.service';
import { LoggingService } from '../../../services/Logs/logging.service';
import { AlertifyService } from '../../../alertify/alertify.service';
import { LoanApiService } from '../../../services/loan/loanapi.service';
import { getNumericCellEditor, numberValueSetter } from '../../../Workers/utility/aggrid/numericboxes';
import { environment } from '../../../../environments/environment.prod';
import { SelectEditor } from '../../../aggridfilters/selectbox';
import { DeleteButtonRenderer } from '../../../aggridcolumns/deletebuttoncolumn';
import { currencyFormatter, discFormatter, insuredFormatter } from '../../../Workers/utility/aggrid/collateralboxes';
import { JsonConvert } from 'json2typescript';
import { lookupStateValue } from '../../../Workers/utility/aggrid/stateandcountyboxes';
import * as _ from 'lodash';
import { MarketingcontractcalculationService } from '../../../Workers/calculations/marketingcontractcalculation.service';
import { getAlphaNumericCellEditor } from '../../../Workers/utility/aggrid/alphanumericboxes';
import { CollateralService } from '../collateral.service';
import { MarketingContractsService } from './marketing-contracts.service';
import CollateralSettings from './../collateral-types.model';

@Component({
  selector: 'app-marketing-contracts',
  templateUrl: './marketing-contracts.component.html',
  styleUrls: ['./marketing-contracts.component.scss'],
  providers: [CollateralService, MarketingContractsService]
})
export class MarketingContractsComponent implements OnInit {
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
  public pinnedBottomRowData;

  constructor(public localstorageservice: LocalStorageService,
    private toaster: ToastsManager,
    public loanserviceworker: LoancalculationWorker,
    public cropunitservice: CropapiService,
    public logging: LoggingService,
    public alertify: AlertifyService,
    public loanapi: LoanApiService,
    private marketingContractCalculationService: MarketingcontractcalculationService,
    public collateralService: CollateralService,
    public marketingContractsService: MarketingContractsService) {

    this.components = { numericCellEditor: getNumericCellEditor(), alphaNumeric: getAlphaNumericCellEditor() };
    this.refdata = this.localstorageservice.retrieve(environment.referencedatakey);
    this.frameworkcomponents = { selectEditor: SelectEditor, deletecolumn: DeleteButtonRenderer };
    this.columnDefs = this.marketingContractsService.getColumnDefs();
    this.context = { componentParent: this };
  }

  ngOnInit() {
    // Observe the localstorage for changes
    this.subscribeToChanges();

    // on initialization
    this.localloanobject = this.localstorageservice.retrieve(environment.loankey);
    this.rowData = this.collateralService.getRowData(this.localloanobject, CollateralSettings.marketingContracts.key, CollateralSettings.marketingContracts.source, CollateralSettings.marketingContracts.sourceKey);
    this.collateralService.adjustgrid(this.gridApi);
  }

  subscribeToChanges() {
    this.localstorageservice.observe(environment.loankey).subscribe(res => {
      let result = this.collateralService.subscribeToChanges(res, this.localloanobject, CollateralSettings.marketingContracts.key, this.rowData, this.pinnedBottomRowData);
      this.rowData = result.rowData;
      this.pinnedBottomRowData = result.pinnedBottomRowData;
      this.gridApi.refreshCells();
    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
  }

  isSyncRequired(isEnabled) {
    this.enableSync.emit(isEnabled);
  }

  //Grid Events
  addrow() {
    this.collateralService.addRow(this.localloanobject, this.gridApi, this.rowData, CollateralSettings.marketingContracts.key, CollateralSettings.marketingContracts.source, CollateralSettings.marketingContracts.sourceKey);
    this.isSyncRequired(true);
  }

  rowvaluechanged(value: any) {
    this.marketingContractsService.rowvaluechanged(value);
    this.isSyncRequired(true);
  }

  DeleteClicked(rowIndex: any) {
    this.collateralService.deleteClicked(rowIndex, this.localloanobject, this.rowData, CollateralSettings.marketingContracts.source, CollateralSettings.marketingContracts.pk);
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
