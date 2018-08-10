import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
import CollateralSettings from '../collateral-types.model';
import { EquipmentService } from './equipment.service';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.scss'],
  providers: [CollateralService, EquipmentService]
})
export class EquipmentComponent implements OnInit {
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
  public rowClassRules;

  constructor(public localstorageservice: LocalStorageService,
    private toaster: ToastsManager,
    public loanserviceworker: LoancalculationWorker,
    public cropunitservice: CropapiService,
    public logging: LoggingService,
    public alertify: AlertifyService,
    public loanapi: LoanApiService,
    public collateralService: CollateralService,
    public equipmentService: EquipmentService) {
    this.components = { numericCellEditor: getNumericCellEditor(), alphaNumeric: getAlphaNumericCellEditor() };
    this.refdata = this.localstorageservice.retrieve(environment.referencedatakey);
    this.frameworkcomponents = { selectEditor: SelectEditor, deletecolumn: DeleteButtonRenderer };
    this.columnDefs = this.equipmentService.getColumnDefs();
    this.context = { componentParent: this };
  }

  ngOnInit() {
    // Observe the localstorage for changes
    this.subscribeToChanges();

    // on initialization
    this.localloanobject = this.localstorageservice.retrieve(environment.loankey);
    this.rowData = this.collateralService.getRowData(this.localloanobject, CollateralSettings.equipment.key, CollateralSettings.equipment.source, CollateralSettings.equipment.sourceKey);
    this.pinnedBottomRowData = this.equipmentService.computeTotal(this.localloanobject);
    this.collateralService.adjustgrid(this.gridApi);
  }

  subscribeToChanges() {
    this.localstorageservice.observe(environment.loankey).subscribe(res => {
      let result = this.collateralService.subscribeToChanges(res, this.localloanobject, CollateralSettings.equipment.key, this.rowData, this.pinnedBottomRowData);
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
    catch (ex){
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.collateralService.getgridheight(this.rowData);
    this.adjustgrid();
  }

  isSyncRequired(isEnabled) {
    this.enableSync.emit(isEnabled);
  }

  //Grid Events
  addrow() {
    this.collateralService.addRow(this.localloanobject, this.gridApi, this.rowData, CollateralSettings.equipment.key, CollateralSettings.equipment.source, CollateralSettings.equipment.sourceKey);
    this.isSyncRequired(true);
  }

  rowvaluechanged(value: any) {
    this.collateralService.rowValueChanged(value, this.localloanobject, CollateralSettings.equipment.component, CollateralSettings.equipment.source, CollateralSettings.equipment.pk);
    this.isSyncRequired(true);
  }

  DeleteClicked(rowIndex: any) {
    this.collateralService.deleteClicked(rowIndex, this.localloanobject, this.rowData, CollateralSettings.equipment.source, CollateralSettings.equipment.pk);
    this.isSyncRequired(true);
  }
}
