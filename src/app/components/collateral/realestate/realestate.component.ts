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
import { getAlphaNumericCellEditor } from '../../../Workers/utility/aggrid/alphanumericboxes';
import { CollateralService } from '../collateral.service';
import { RealEstateService } from './realestate.service';
import CollateralSettings from '../collateral-types.model';

@Component({
  selector: 'app-realestate',
  templateUrl: './realestate.component.html',
  styleUrls: ['./realestate.component.scss'],
  providers: [CollateralService, RealEstateService]
})
export class RealEstateComponent implements OnInit {
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
    private hostElement: ElementRef,
    public collateralService: CollateralService,
    public realEstateService: RealEstateService) {
    this.components = { numericCellEditor: getNumericCellEditor(), alphaNumeric: getAlphaNumericCellEditor() };
    this.refdata = this.localstorageservice.retrieve(environment.referencedatakey);
    this.frameworkcomponents = { selectEditor: SelectEditor, deletecolumn: DeleteButtonRenderer };
    this.columnDefs = this.realEstateService.getColumnDefs();
    this.context = { componentParent: this };
  }

  ngOnInit() {
    this.subscribeToChanges();

    // on initialization
    this.localloanobject = this.localstorageservice.retrieve(environment.loankey);
    this.rowData = this.collateralService.getRowData(this.localloanobject, CollateralSettings.realestate.key, CollateralSettings.realestate.source, CollateralSettings.realestate.sourceKey);
    this.pinnedBottomRowData = this.realEstateService.computeTotal(this.localloanobject);
    this.collateralService.adjustgrid(this.gridApi);
  }

  subscribeToChanges() {
    this.localstorageservice.observe(environment.loankey).subscribe(res => {
      let result = this.collateralService.subscribeToChanges(res, this.localloanobject, CollateralSettings.realestate.key, this.rowData, this.pinnedBottomRowData);
      this.rowData = result.rowData;
      this.pinnedBottomRowData = result.pinnedBottomRowData;
    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.getgridheight();
    //this.adjustparentheight();
  }

  isSyncRequired(isEnabled) {
    this.enableSync.emit(isEnabled);
  }

  //Grid Events
  addrow() {
    this.collateralService.addRow(this.localloanobject, this.gridApi, this.rowData, CollateralSettings.realestate.key, CollateralSettings.realestate.source, CollateralSettings.realestate.sourceKey);
    this.isSyncRequired(true);
  }

  rowvaluechanged(value: any) {
    this.collateralService.rowValueChanged(value, this.localloanobject, CollateralSettings.realestate.component, CollateralSettings.realestate.source, CollateralSettings.realestate.pk);
    this.isSyncRequired(true);
  }

  DeleteClicked(rowIndex: any) {
    this.collateralService.deleteClicked(rowIndex, this.localloanobject, this.rowData, CollateralSettings.realestate.source, CollateralSettings.realestate.pk);
    this.isSyncRequired(true);
  }

  getgridheight() {
    //this.style.height=(30*(this.rowData.length+2)).toString()+"px";
  }

  onGridSizeChanged(Event: any) {
    try {
      this.gridApi.sizeColumnsToFit();
      this.adjustparentheight();
    }
    catch (ex){

    }
  }

  expansionopen() {
    setTimeout(() => {
      this.adjustparentheight();
    }, 10);

  }

  adjustparentheight() {
    var elementInHost = this.hostElement.nativeElement.getElementsByClassName("mat-expansion-panel-content");
    // var elements= Array.from(document.getElementsByClassName("mat-expansion-panel-content"));

    for (let index = 0; index < elementInHost.length; index++) {
      const element = elementInHost[index];
      var aggrid = element.getElementsByClassName("ag-root-wrapper")[0];
      element.setAttribute("style", "height:" + (aggrid.clientHeight + 80).toString() + "px");
    }
  }
}
