import { Component, OnInit, ElementRef, Output, EventEmitter } from '@angular/core';
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
import { GridOptions } from '../../../../../node_modules/ag-grid';
import { debug } from 'util';
import { getAlphaNumericCellEditor } from '../../../Workers/utility/aggrid/alphanumericboxes';
import { CollateralService } from '../collateral.service';
import { OthersService } from './others.service';
import CollateralSettings from './../collateral-types.model';
import { PublishService, Page } from "../../../services/publish.service";

@Component({
  selector: 'app-others',
  templateUrl: './others.component.html',
  styleUrls: ['./others.component.scss'],
  providers: [CollateralService, OthersService]
})
export class OthersComponent implements OnInit {
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
    private hostElement: ElementRef,
    public collateralService: CollateralService,
    public othersService: OthersService,
    public publishService: PublishService) {
    this.components = { numericCellEditor: getNumericCellEditor(), alphaNumeric: getAlphaNumericCellEditor() };
    this.refdata = this.localstorageservice.retrieve(environment.referencedatakey);
    this.frameworkcomponents = { selectEditor: SelectEditor, deletecolumn: DeleteButtonRenderer };

    this.columnDefs = this.othersService.getColumnDefs();

    this.context = { componentParent: this };
  }

  ngOnInit() {
    // Observe the localstorage for changes
    this.subscribeToChanges();

    // on initialization
    this.localloanobject = this.localstorageservice.retrieve(environment.loankey);
    this.rowData = this.collateralService.getRowData(this.localloanobject, CollateralSettings.other.key, CollateralSettings.other.source, CollateralSettings.other.sourceKey);
    this.pinnedBottomRowData = this.othersService.computeTotal(this.localloanobject);
    this.collateralService.adjustgrid(this.gridApi);
  }

  subscribeToChanges() {
    this.localstorageservice.observe(environment.loankey).subscribe(res => {
      let result = this.collateralService.subscribeToChanges(res, this.localloanobject, CollateralSettings.other.key, this.rowData, this.pinnedBottomRowData);
      this.rowData = result.rowData;
      this.pinnedBottomRowData = result.pinnedBottomRowData;
    });
  }

  onGridSizeChanged(Event: any) {
    this.adjustgrid();
  }

  private adjustgrid() {
    try {
      this.gridApi.sizeColumnsToFit();
    }
    catch (ex) {
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.getgridheight();
    this.adjustgrid();
  }

  //Grid Events
  addrow() {
    this.collateralService.addRow(this.localloanobject, this.gridApi, this.rowData, CollateralSettings.other.key, CollateralSettings.other.source, CollateralSettings.other.sourceKey);
    this.publishService.enableSync(Page.collateral);
  }

  rowvaluechanged(value: any) {
    this.collateralService.rowValueChanged(value, this.localloanobject, CollateralSettings.other.component, CollateralSettings.other.source, CollateralSettings.other.pk);
    this.publishService.enableSync(Page.collateral);
  }

  DeleteClicked(rowIndex: any) {
    this.collateralService.deleteClicked(rowIndex, this.localloanobject, this.rowData, CollateralSettings.other.source, CollateralSettings.other.pk);
    this.publishService.enableSync(Page.collateral);
  }

  expansionopen() {
    setTimeout(() => {
      this.adjustparentheight();
    }, 10);
  }

  getgridheight() {
    // this.style.height = (30 * (this.rowData.length + 2) - 2).toString() + "px";
  }

  adjustparentheight() {
    var elementInHost = this.hostElement.nativeElement.getElementsByClassName("mat-expansion-panel-content");
    //var elements= Array.from(document.getElementsByClassName("mat-expansion-panel-content"));

    for (let index = 0; index < elementInHost.length; index++) {
      const element = elementInHost[index];
      var aggrid = element.getElementsByClassName("ag-root-wrapper")[0];
      element.setAttribute("style", "height:" + (aggrid.clientHeight + 80).toString() + "px");
    }
  }
}
