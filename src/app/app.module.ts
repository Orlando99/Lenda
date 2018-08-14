import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Http, HttpModule } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'ng2-toastr';
import { ChartsModule } from 'ng2-charts';
import { BarRatingModule } from "ngx-bar-rating";
import "reflect-metadata";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
//START MATERIAL COMPONENTS
import { MatButtonModule, MatCheckboxModule, MatNativeDateModule, MAT_DATE_LOCALE, MatProgressSpinner, MatProgressSpinnerModule, MatTooltipModule, MatChipsModule } from '@angular/material';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule, MatSnackBarModule } from '@angular/material';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { NgSelectModule } from '@ng-select/ng-select';
import { ClickOutsideModule } from 'ng-click-outside';
//ENDS MATERIAL COMPONENTS
import { LoadingBarHttpModule } from '@ngx-loading-bar/http';
//START SERVICES
import { LocalStorageService } from 'ngx-webstorage';
import { GlobalService, ApiService } from './services';
import { SharedModule } from './shared/shared.module';
import { AlertifyService } from './alertify/alertify.service';
import { LoanApiService } from './services/loan/loanapi.service';
import { LoginService } from './login/login.service';
//END SERVICES



//START COMPONENTS
import { AppComponent } from './app.component';
import { AlertComponent, ConfirmComponent } from './alertify/components'
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { HeaderComponent } from './shared/layout/header.component';
import { FooterComponent } from './shared/layout/footer.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { DashboardComponent } from "./dashboard/dashboard.component";
import { MasterComponent } from "./master/master.component";
import { SummaryComponent } from './components/summary/summary.component';
import { LoanListComponent } from "./components/loan-list/loan-list.component";
import { LoanOverviewComponent } from './components/loan-overview/loan-overview.component';
import { FinancialsComponent } from './components/summary/financials/financials.component';
import { Borrowercalculationworker } from './Workers/calculations/borrowercalculationworker.service';
import { Borrowerincomehistoryworker } from './Workers/calculations/borrowerincomehistoryworker.service';
import { LoancalculationWorker } from './Workers/calculations/loancalculationworker';
import { BorrowerComponent } from './components/borrower/borrower.component';
import { BalancesheetComponent } from './components/borrower/balancesheet/balancesheet.component';
import { AdminComponent } from './components/admin/admin.component';
import { NamingConventionComponent } from './components/naming-convention/naming-convention.component';
import { BorrowerapiService } from './services/borrower/borrowerapi.service';
import { LoggingService } from './services/Logs/logging.service';
import { ProjectedincomeComponent } from './components/summary/projectedincome/projectedincome.component';
import { LoancropunitcalculationworkerService } from './Workers/calculations/loancropunitcalculationworker.service';

import { NamingConventionapiService } from './services/admin/namingconventionapi.service';
import { AgGridModule } from 'ag-grid-angular';
import { NumericEditor } from "../app/aggridfilters/numericaggrid";
import { AggridTxtAreaComponent } from './aggridfilters/textarea';
import { LoadingModule } from 'ngx-loading';

import { LoancrophistoryService } from './Workers/calculations/loancrophistory.service';
import { FarmComponent } from './components/farm/farm.component';
import { FarmcalculationworkerService } from './Workers/calculations/farmcalculationworker.service';
import { FarmapiService } from './services/farm/farmapi.service';
import { FocusDirective } from './directives/focusInput';
import { BudgetComponent } from './components/budget/budget.component';
import { CropbasedbudgetComponent } from './components/budget/cropbasedbudget/cropbasedbudget.component';
import { ReferenceService } from './services/reference/reference.service';
import { SelectEditor } from './aggridfilters/selectbox';
import { InsuranceComponent } from './components/insurance/insurance.component';
import { AssociationComponent } from './components/insurance/association/association.component';
import { DeleteButtonRenderer } from './aggridcolumns/deletebuttoncolumn';
import { InsuranceapiService } from './services/insurance/insuranceapi.service';
import { FarmsInfoComponent } from './components/insurance/farms-info/farms-info.component';
import { CropYieldInfoComponent } from './components/insurance/crop-yield-info/crop-yield-info.component';
import { LoanCropUnitsInfoComponent } from './components/insurance/loan-crop-units-info/loan-crop-units-info.component';
import { BuyerAssociationComponent } from './components/borrower/buyer-association/buyer-association.component';
import { FarmerInfoComponent } from './components/borrower/farmer-info/farmer-info.component';
import { BorrowerInfoComponent } from './components/borrower/borrower-info/borrower-info.component';
import { QuestionsComponent } from './components/borrower/questions/questions.component';
import { LoanviewerComponent } from './components/loanviewer/loanviewer.component';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { LoanbudgetComponent } from './components/budget/loan-budget/loanbudget.component';
import { EmailEditor } from './Workers/utility/aggrid/emailboxes';
import { WorkInProgressComponent } from './components/work-in-progress/work-in-progress.component';
import { FinanceStatsComponent } from './components/work-in-progress/finance-stats/finance-stats.component';
import { ExceptionsComponent } from './components/work-in-progress/exceptions/exceptions.component';
import { ConditionsComponent } from './components/work-in-progress/conditions/conditions.component';
import { NotificationFeedsService } from './shared/notification-feeds/notification-feeds.service';
import { NotificationFeedsComponent } from './shared/notification-feeds/notification-feeds.component';
import { SidebarComponent } from './shared/layout/sidebar.component';
import { AdminSidebarComponent } from './shared/layout/admin-sidebar/admin-sidebar.component';
import { RightSidebarComponent } from './shared/layout/right-sidebar/right-sidebar.component';
import { MediaArticleComponent } from './shared/layout/right-sidebar/media-article/media-article.component';
import { UserArticleComponent } from './shared/layout/right-sidebar/user-article/user-article.component';
import { CreateLoanComponent } from './components/create-loan/create-loan.component';
import { SpinerComponent } from './shared/spiner/spiner.component';
import { FlowchartComponent } from './components/flowchart/flowchart.component';
import { BorrowerIncomeHistoryComponent } from './components/borrower/borrower-income-history/borrower-income-history.component';
//CROP
import { CropapiService } from './services/crop/cropapi.service';

import { CropComponent } from './components/crop/crop.component';
import { PriceComponent } from './components/crop/price/price.component';
import { YieldComponent } from './components/crop/yield/yield.component';
import { YieldDialogComponent } from './components/crop/yield/yield.component';


//Collateral
import { CollateralComponent } from './components/collateral/collateral.component';
import { FSAComponent } from './components/collateral/fsa/fsa.component';
import { LivestockComponent } from './components/collateral/livestock/livestock.component';
import { StoredCropComponent } from './components/collateral/storedcrop/storedcrop.component';
import { EquipmentComponent } from './components/collateral/equipment/equipment.component';
import { RealEstateComponent } from './components/collateral/realestate/realestate.component';
import { OthersComponent } from './components/collateral/others/others.component';
import { Collateralcalculationworker } from './Workers/calculations/collateralcalculationworker.service';
import { RatingComponent } from './components/borrower/rating/rating.component';
import { FarmFinancialComponent } from './components/borrower/farm-financial/farm-financial.component'
import { LoanMasterCalculationWorkerService } from './Workers/calculations/loan-master-calculation-worker.service';
import { CellValueComponent } from './components/borrower/shared/cell-value/cell-value.component';
import { QuestionscalculationworkerService } from './Workers/calculations/questionscalculationworker.service';
import { CurrencyDirective } from './components/borrower/shared/currency.directive';
import { PercentageDirective } from './components/borrower/shared/percentage.directive';
import { CustomentryComponent } from './components/customentry/customentry.component';
import { LoancroppracticeworkerService } from './Workers/calculations/loancroppracticeworker.service';
import { InsurancecalculationworkerService } from './Workers/calculations/insurancecalculationworker.service';
import { AssociationcalculationworkerService } from './Workers/calculations/associationcalculationworker.service';

//ag grid enterprise
import { LicenseManager } from "ag-grid-enterprise/main";
import { OptimizerComponent } from './components/optimizer/optimizer.component';
import { SubTableComponent } from './components/borrower/farm-financial/sub-table/sub-table.component';
import { ChartsVisualizationComponent } from './components/summary/charts-visualization/charts-visualization.component';
import { CashFlowComponent } from './components/summary/charts-visualization/cash-flow/cash-flow.component';
import { RiskAndReturnComponent } from './components/summary/charts-visualization/risk-and-return/risk-and-return.component';
import { CompanyInfoComponent } from './components/summary/charts-visualization/company-info/company-info.component';
import { RiskChartComponent } from './components/summary/charts-visualization/risk-and-return/risk-chart/risk-chart.component';
import { CommitmentChartComponent } from './components/summary/charts-visualization/risk-and-return/commitment-chart/commitment-chart.component';
import { SidebarModule } from 'ng-sidebar';
import { PoliciesComponent } from './components/insurance/policies/policies.component';
import { ChipsListEditor } from './aggridcolumns/chipscelleditor';
import { EmptyEditor } from './aggridfilters/emptybox';
import { BottomIconsComponent } from './components/summary/charts-visualization/company-info/bottom-icons/bottom-icons.component';
import { ProgressChartComponent } from './components/summary/charts-visualization/company-info/progress-chart/progress-chart.component';
import { BudgetHelperService } from './components/budget/budget-helper.service';
import { OverallCalculationServiceService } from './Workers/calculations/overall-calculation-service.service';
import { WorkInProgressStatsComponent } from './components/work-in-progress/work-in-progress-stats/work-in-progress-stats.component';
import { MarketingContractsComponent } from './components/collateral/marketing-contracts/marketing-contracts.component';
import { CollateralReportComponent } from './components/work-in-progress/collateral-report/collateral-report.component';
import { MarketingcontractcalculationService } from './Workers/calculations/marketingcontractcalculation.service';
import { OptimizercalculationService } from './Workers/calculations/optimizercalculationservice.service';
import { AphComponent } from './components/insurance/aph/aph.component';
import { CropunitrecordsComponent } from './components/work-in-progress/cropunitrecords/cropunitrecords.component';
import { GlobalErrorHandler } from './services/global-error-handler.service';
import { ToasterService } from './services/toaster.service';

//RECORDS
import { FarmRecordsComponent } from './components/work-in-progress/farmrecords/farmrecords.component';
import { LoanCropsRecordsComponent } from './components/work-in-progress/loancroprecords/loancroprecords.component';
import { AssociationRecordsComponent } from './components/work-in-progress/associationrecords/associationrecords.component';
import { LoanMarketingRecordsComponent } from './components/work-in-progress/loanmarketingrecords/loanmarketingrecords.component';
import { SyncStatusComponent } from './components/work-in-progress/syncstatus/syncstatus.component';
import { LoanCollateralRecordsComponent } from './components/work-in-progress/loancollateralrecords/loancollateralrecords.component';
import { AgGridTooltipComponent } from './aggridcolumns/tooltip/tooltip.component';
import { CommitteeComponent } from './components/committee/committee.component';
import { RangebarComponent } from './ui-components/rangebar/rangebar.component';
import { SvgTooltipComponent } from './ui-components/svg-tooltip/svg-tooltip.component';
import { YieldReportComponent } from './components/summary/yield-report/yield-report.component';
import { BudgetReportComponent } from './components/summary/budget-report/budget-report.component';
import { LiquidityAnalysisComponent } from './components/borrower/farm-financial/liquidity-analysis/liquidity-analysis.component';
import { BorrowerRatingComponent } from './components/borrower/farm-financial/borrower-rating/borrower-rating.component';
import { ValidationService } from './Workers/calculations/validation.service';
import { BtnPublishComponent } from './ui-components/btn-publish/btn-publish.component';
import { BooleanEditor } from './aggridfilters/booleanaggrid.';
import { ExceptionService } from './Workers/calculations/exception.service';


LicenseManager.setLicenseKey("MTUzNjQ0NzYwMDAwMA==712c48d48d0a3ec85f3243b1295999ec");

@NgModule({
  declarations: [
    NumericEditor,
    BooleanEditor,
    SelectEditor,
    EmptyEditor,
    ChipsListEditor,
    AppComponent,
    SpinerComponent,
    DeleteButtonRenderer,
    ConfirmComponent,
    LoginComponent,
    PageNotFoundComponent,
    DashboardComponent,
    MasterComponent,
    AlertComponent,
    EmailEditor,
    FooterComponent,
    HeaderComponent,
    SummaryComponent,
    LoanListComponent,
    LoanOverviewComponent,
    FinancialsComponent,
    BorrowerComponent,
    BalancesheetComponent,
    ProjectedincomeComponent,
    CropComponent, PriceComponent, YieldComponent, YieldDialogComponent,
    AdminComponent,
    NamingConventionComponent,
    AggridTxtAreaComponent,
    FarmComponent,
    FocusDirective,
    CurrencyDirective,
    PercentageDirective,
    BudgetComponent,
    CropbasedbudgetComponent, InsuranceComponent, AssociationComponent, FarmsInfoComponent, CropYieldInfoComponent, LoanCropUnitsInfoComponent, BuyerAssociationComponent, FarmerInfoComponent, BorrowerInfoComponent, QuestionsComponent, DistributerComponent, ThirdpartyComponent, HarvesterComponent, LoanviewerComponent,
    LoanCropUnitsInfoComponent, BuyerAssociationComponent, QuestionsComponent,
    LoanbudgetComponent,
    FarmerInfoComponent,
    BorrowerInfoComponent,
    WorkInProgressComponent,
    FinanceStatsComponent,
    ExceptionsComponent,
    ConditionsComponent,
    NotificationFeedsComponent,
    SidebarComponent,
    RightSidebarComponent,
    MediaArticleComponent,
    UserArticleComponent,
    CreateLoanComponent,
    CollateralComponent, FSAComponent, LivestockComponent, StoredCropComponent, EquipmentComponent, RealEstateComponent, OthersComponent,
    FlowchartComponent,
    RatingComponent,
    FarmFinancialComponent,
    CellValueComponent,
    CustomentryComponent,
    OptimizerComponent,
    CustomentryComponent,
    SubTableComponent,
    ChartsVisualizationComponent,
    CashFlowComponent,
    RiskAndReturnComponent,
    CompanyInfoComponent,
    PoliciesComponent,
    RiskChartComponent,
    CommitmentChartComponent,
    CompanyInfoComponent,
    BottomIconsComponent,
    ProgressChartComponent,
    CurrencyDirective,
    PercentageDirective,
    WorkInProgressStatsComponent,
    MarketingContractsComponent,
    CollateralReportComponent,
    BorrowerIncomeHistoryComponent,
    AphComponent,
    CropunitrecordsComponent,
    FarmRecordsComponent,
    LoanCropsRecordsComponent,
    AssociationRecordsComponent,
    LoanMarketingRecordsComponent,
    SyncStatusComponent,
    LoanCollateralRecordsComponent,
    CommitteeComponent,
    RangebarComponent,
    SvgTooltipComponent,
    YieldReportComponent,
    BudgetReportComponent,
    AgGridTooltipComponent,
    LiquidityAnalysisComponent,
    BorrowerRatingComponent,
    AdminSidebarComponent,
    BtnPublishComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    HttpClientModule,
    NgSelectModule,
    SharedModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatFormFieldModule,
    MatMenuModule,
    MatToolbarModule,
    MatListModule,
    MatTableModule,
    MatGridListModule,
    MatDialogModule,
    MatExpansionModule,
    MatTabsModule,
    MatTooltipModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatPaginatorModule,
    MatButtonToggleModule,
    LoadingModule,
    NgxJsonViewerModule,
    AgGridModule.withComponents([NumericEditor,BooleanEditor, SelectEditor, ChipsListEditor, EmptyEditor, AgGridTooltipComponent]),
    ToastModule.forRoot(),
    SidebarModule.forRoot(),
    ChartsModule,
    BarRatingModule,
    AngularMultiSelectModule,
    ClickOutsideModule,
    NgbModule.forRoot(),
    LoadingBarHttpModule
  ],
  exports: [
    FormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatFormFieldModule,
    MatMenuModule,
    MatToolbarModule,
    MatTooltipModule,
    MatListModule,
    MatTableModule,
    MatGridListModule,
    MatExpansionModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatTabsModule,
    MatIconModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatPaginatorModule,
    MatButtonToggleModule,
    FocusDirective,
    CurrencyDirective,
    PercentageDirective,
    NgxJsonViewerModule,
    MatDialogModule
  ],
  providers: [
    LocalStorageService,
    GlobalService,
    MatDialogModule,
    AlertifyService,
    LoanApiService,
    ApiService,
    Borrowercalculationworker,
    Borrowerincomehistoryworker,
    Collateralcalculationworker,
    LoancalculationWorker,
    LoanMasterCalculationWorkerService,
    BorrowerapiService,
    LoancropunitcalculationworkerService,
    LoancrophistoryService,
    FarmcalculationworkerService,
    LoggingService,
    FarmapiService,
    NamingConventionapiService,
    CropapiService,
    ReferenceService,
    InsuranceapiService,
    NotificationFeedsService,
    QuestionscalculationworkerService,
    LoancroppracticeworkerService,
    InsurancecalculationworkerService,
    AssociationcalculationworkerService,
    BudgetHelperService,
    OverallCalculationServiceService,
    LoginService,
    MarketingcontractcalculationService,
    OptimizercalculationService,
    ValidationService,
    ExceptionService,
    ToasterService,
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    }
  ],
  entryComponents: [DeleteButtonRenderer, ConfirmComponent, EmailEditor, YieldDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
